// src/context/AuthContext.jsx
// Mantiene el estado de autenticación de toda la app.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { almacenSesion } from '../services/almacenSesion';
import { registrarAlExpirarSesion } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Al iniciar se lee la sesión guardada (persistencia ante recargas de página)
    const [usuario, setUsuario] = useState(() => almacenSesion.obtenerUsuario());
    // Mientras se valida el token guardado no se decide si mostrar o no una ruta protegida
    const [cargando, setCargando] = useState(() => Boolean(almacenSesion.obtenerToken()));

    useEffect(() => {
        // Si el refresh token también expiró, api.js avisa y se cierra la sesión
        registrarAlExpirarSesion(() => setUsuario(null));

        if (!almacenSesion.obtenerToken()) {
            setCargando(false);
            return;
        }

        // Se confirma con el backend que el token sigue siendo válido
        // (y se actualizan nombre/rol por si cambiaron).
        authService.obtenerUsuarioActual()
            .then((datos) => {
                almacenSesion.guardarUsuario(datos);
                setUsuario(datos);
            })
            .catch((error) => {
                // Si el backend responde con error (token inválido/expirado) se cierra la sesión.
                // Si el backend no responde (apagado), se mantiene la sesión guardada.
                if (error?.response) {
                    almacenSesion.limpiar();
                    setUsuario(null);
                }
            })
            .finally(() => setCargando(false));
    }, []);

    const login = useCallback(async (correo, password) => {
        const datos = await authService.login(correo, password);
        almacenSesion.guardar(datos);
        setUsuario(datos.usuario);
        return datos.usuario;
    }, []);

    const registrar = useCallback(async (datosRegistro) => {
        const datos = await authService.registrar(datosRegistro);
        almacenSesion.guardar(datos);
        setUsuario(datos.usuario);
        return datos.usuario;
    }, []);

    const logout = useCallback(() => {
        almacenSesion.limpiar();
        setUsuario(null);
    }, []);

    const tieneRol = useCallback(
        (...roles) => Boolean(usuario) && roles.includes(usuario.rol),
        [usuario]
    );

    const valor = useMemo(() => ({
        usuario,
        cargando,
        estaAutenticado: Boolean(usuario),
        login,
        registrar,
        logout,
        tieneRol,
    }), [usuario, cargando, login, registrar, logout, tieneRol]);

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}
