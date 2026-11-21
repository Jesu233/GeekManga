import axios from 'axios';
import api, { mensajeDeError, registrarAlExpirarSesion } from '../src/services/api';

// Se reemplaza el "adapter" de axios para simular respuestas del backend sin red
const responder = (fn) => {
    api.defaults.adapter = fn;
};

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe('api (cliente axios)', () => {
    it('agrega el header Authorization cuando hay token', async () => {
        localStorage.setItem('geekmanga_token', 'abc');
        let headerEnviado;
        responder(async (config) => {
            headerEnviado = config.headers.Authorization;
            return { data: [], status: 200, statusText: 'OK', headers: {}, config };
        });

        await api.get('/producto');

        expect(headerEnviado).toBe('Bearer abc');
    });

    it('con un 401 renueva el token y reintenta la petición', async () => {
        localStorage.setItem('geekmanga_token', 'viejo');
        localStorage.setItem('geekmanga_refresh_token', 'refresh');
        vi.spyOn(axios, 'post').mockResolvedValue({ data: { token: 'nuevo', refreshToken: 'refresh2' } });

        const tokensUsados = [];
        responder(async (config) => {
            tokensUsados.push(config.headers.Authorization);
            if (config.headers.Authorization === 'Bearer viejo') {
                const error = new Error('401');
                error.config = config;
                error.response = { status: 401, data: {} };
                throw error;
            }
            return { data: 'ok', status: 200, statusText: 'OK', headers: {}, config };
        });

        const respuesta = await api.get('/boleta/mis-boletas');

        expect(respuesta.data).toBe('ok');
        expect(tokensUsados).toEqual(['Bearer viejo', 'Bearer nuevo']);
        expect(localStorage.getItem('geekmanga_token')).toBe('nuevo');
    });

    it('si la renovación falla limpia la sesión y avisa', async () => {
        localStorage.setItem('geekmanga_token', 'viejo');
        localStorage.setItem('geekmanga_refresh_token', 'vencido');
        vi.spyOn(axios, 'post').mockRejectedValue(new Error('refresh inválido'));
        const alExpirar = vi.fn();
        registrarAlExpirarSesion(alExpirar);

        responder(async (config) => {
            const error = new Error('401');
            error.config = config;
            error.response = { status: 401, data: {} };
            throw error;
        });

        await expect(api.get('/auth/me')).rejects.toThrow();
        expect(alExpirar).toHaveBeenCalled();
        expect(localStorage.getItem('geekmanga_token')).toBeNull();
    });
});

describe('mensajeDeError', () => {
    it('usa el mensaje que envía el backend', () => {
        expect(mensajeDeError({ response: { data: { mensaje: 'Stock insuficiente' } } })).toBe('Stock insuficiente');
    });

    it('une los errores por campo', () => {
        expect(mensajeDeError({ response: { data: { campos: { a: 'Falta A', b: 'Falta B' } } } })).toBe('Falta A. Falta B');
    });

    it('avisa cuando no hay conexión', () => {
        expect(mensajeDeError(new Error('Network Error'))).toContain('No se pudo conectar');
    });
});
