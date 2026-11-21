import axios from 'axios';
import { almacenSesion } from './almacenSesion';

// URL del backend. Se puede cambiar con la variable VITE_API_URL en un archivo .env
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

// Cliente axios único: todas las peticiones de la app pasan por aquí
const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

// Función que AuthContext registra para enterarse cuando la sesión expira del todo
let alExpirarSesion = () => {};
export const registrarAlExpirarSesion = (fn) => {
    alExpirarSesion = fn;
};

// 1) Antes de cada petición: si hay token, se agrega el header Authorization
api.interceptors.request.use((config) => {
    const token = almacenSesion.obtenerToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2) Si el backend responde 401 (token expirado) se pide un token nuevo con el
//    refresh token y se reintenta la petición original UNA vez.
//    Si varias peticiones fallan al mismo tiempo, comparten la misma renovación.
let renovacionEnCurso = null;

const renovarToken = async () => {
    const refreshToken = almacenSesion.obtenerRefreshToken();
    if (!refreshToken) throw new Error('Sin refresh token');
    // Se usa axios "limpio" para que esta llamada no pase por los interceptores
    const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
    almacenSesion.guardar(data);
    return data.token;
};

api.interceptors.response.use(
    (respuesta) => respuesta,
    async (error) => {
        const original = error.config;
        const esRutaAuth = original?.url?.includes('/auth/login')
            || original?.url?.includes('/auth/registro')
            || original?.url?.includes('/auth/refresh');

        if (error.response?.status === 401 && original && !original._reintentado && !esRutaAuth
            && almacenSesion.obtenerRefreshToken()) {
            original._reintentado = true;
            try {
                renovacionEnCurso = renovacionEnCurso || renovarToken();
                const tokenNuevo = await renovacionEnCurso;
                original.headers.Authorization = `Bearer ${tokenNuevo}`;
                return api(original);
            } catch (errorRenovacion) {
                almacenSesion.limpiar();
                alExpirarSesion();
                return Promise.reject(errorRenovacion);
            } finally {
                renovacionEnCurso = null;
            }
        }
        return Promise.reject(error);
    }
);

/** Convierte un error de axios en un mensaje para mostrar al usuario. */
export const mensajeDeError = (error, porDefecto = 'Ocurrió un error inesperado') => {
    if (!error?.response) {
        return 'No se pudo conectar con el servidor. Revisa que el backend esté encendido.';
    }
    const { data } = error.response;
    if (data?.campos) {
        return Object.values(data.campos).join('. ');
    }
    return data?.mensaje || porDefecto;
};

/** Errores por campo que devuelve el backend cuando falla @Valid: { campo: mensaje } */
export const erroresDeCampos = (error) => error?.response?.data?.campos || {};

export default api;
