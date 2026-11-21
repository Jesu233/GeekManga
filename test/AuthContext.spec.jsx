import { act, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import * as authService from '../src/services/authService';

vi.mock('../src/services/authService', () => ({
    login: vi.fn(),
    registrar: vi.fn(),
    obtenerUsuarioActual: vi.fn(),
}));

const respuestaLogin = {
    token: 'access-123',
    refreshToken: 'refresh-123',
    usuario: { usuarioId: 1, nombre: 'Ana', correo: 'ana@gmail.com', rol: 'USER' },
};

let ctx;
function Consumidor() {
    ctx = useAuth();
    return <p>{ctx.cargando ? 'cargando' : ctx.usuario ? `hola ${ctx.usuario.nombre}` : 'anónimo'}</p>;
}

const renderProvider = () => render(<AuthProvider><Consumidor /></AuthProvider>);

beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});

describe('AuthContext', () => {
    it('sin token guardado parte como anónimo y no llama al backend', () => {
        renderProvider();
        expect(screen.getByText('anónimo')).toBeInTheDocument();
        expect(authService.obtenerUsuarioActual).not.toHaveBeenCalled();
    });

    it('login guarda tokens y usuario en localStorage', async () => {
        authService.login.mockResolvedValue(respuestaLogin);
        renderProvider();

        await act(() => ctx.login('ana@gmail.com', 'clave'));

        expect(screen.getByText('hola Ana')).toBeInTheDocument();
        expect(localStorage.getItem('geekmanga_token')).toBe('access-123');
        expect(localStorage.getItem('geekmanga_refresh_token')).toBe('refresh-123');
        expect(ctx.tieneRol('USER')).toBe(true);
        expect(ctx.tieneRol('ADMIN')).toBe(false);
    });

    it('mantiene la sesión al recargar validando el token con /auth/me', async () => {
        localStorage.setItem('geekmanga_token', 'access-123');
        localStorage.setItem('geekmanga_usuario', JSON.stringify(respuestaLogin.usuario));
        authService.obtenerUsuarioActual.mockResolvedValue({ ...respuestaLogin.usuario, nombre: 'Ana María' });

        renderProvider();

        expect(screen.getByText('cargando')).toBeInTheDocument();
        expect(await screen.findByText('hola Ana María')).toBeInTheDocument();
    });

    it('cierra la sesión si el backend rechaza el token guardado', async () => {
        localStorage.setItem('geekmanga_token', 'vencido');
        localStorage.setItem('geekmanga_usuario', JSON.stringify(respuestaLogin.usuario));
        authService.obtenerUsuarioActual.mockRejectedValue({ response: { status: 401 } });

        renderProvider();

        expect(await screen.findByText('anónimo')).toBeInTheDocument();
        expect(localStorage.getItem('geekmanga_token')).toBeNull();
    });

    it('si el backend está apagado conserva la sesión guardada', async () => {
        localStorage.setItem('geekmanga_token', 'access-123');
        localStorage.setItem('geekmanga_usuario', JSON.stringify(respuestaLogin.usuario));
        authService.obtenerUsuarioActual.mockRejectedValue(new Error('Network Error'));

        renderProvider();

        await waitFor(() => expect(screen.getByText('hola Ana')).toBeInTheDocument());
    });

    it('logout borra la sesión', async () => {
        authService.login.mockResolvedValue(respuestaLogin);
        renderProvider();
        await act(() => ctx.login('ana@gmail.com', 'clave'));

        act(() => ctx.logout());

        expect(screen.getByText('anónimo')).toBeInTheDocument();
        expect(localStorage.getItem('geekmanga_token')).toBeNull();
    });
});
