import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Login from '../src/pages/Login';
import { useAuth } from '../src/context/AuthContext';

// Mock de useNavigate: así comprobamos a dónde redirige sin navegar de verdad
const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return { ...actual, useNavigate: () => navigateMock };
});

// Mock de la sesión: login() simula la respuesta del backend
vi.mock('../src/context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

const loginMock = vi.fn();

const renderLogin = (estado) =>
    render(
        <MemoryRouter initialEntries={[{ pathname: '/login', state: estado }]}>
            <Login />
        </MemoryRouter>
    );

const iniciarSesion = async (user, correo, password) => {
    if (correo) await user.type(screen.getByLabelText('Correo'), correo);
    if (password) await user.type(screen.getByLabelText('Contraseña'), password);
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
};

beforeEach(() => {
    navigateMock.mockClear();
    loginMock.mockReset();
    useAuth.mockReturnValue({ login: loginMock });
});

describe('Login - validaciones del formulario', () => {
    it('muestra errores de campos obligatorios si se envía vacío', async () => {
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user);

        expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument();
        expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument();
        expect(loginMock).not.toHaveBeenCalled();
    });

    it('marca los inputs como inválidos cuando faltan', async () => {
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user);

        expect(screen.getByLabelText('Correo')).toHaveClass('is-invalid');
        expect(screen.getByLabelText('Contraseña')).toHaveClass('is-invalid');
    });

    it('rechaza un correo con formato inválido sin llamar al backend', async () => {
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user, 'correo-sin-arroba', 'clave123');

        expect(screen.getByText('El formato del correo no es válido.')).toBeInTheDocument();
        expect(loginMock).not.toHaveBeenCalled();
    });
});

describe('Login - conexión con el backend', () => {
    it('envía el correo normalizado y la contraseña', async () => {
        const user = userEvent.setup();
        loginMock.mockResolvedValue({ nombre: 'Ana', rol: 'USER' });
        renderLogin();

        await iniciarSesion(user, '  Ana@Correo.CL ', 'clave123');

        expect(loginMock).toHaveBeenCalledWith('ana@correo.cl', 'clave123');
    });

    it('redirige al Home a un cliente (USER)', async () => {
        const user = userEvent.setup();
        loginMock.mockResolvedValue({ nombre: 'Ana', rol: 'USER' });
        renderLogin();

        await iniciarSesion(user, 'ana@correo.cl', 'clave123');

        expect(navigateMock).toHaveBeenCalledWith('/');
    });

    it.each(['ADMIN', 'VENDEDOR'])('redirige al panel a un %s', async (rol) => {
        const user = userEvent.setup();
        loginMock.mockResolvedValue({ nombre: 'Staff', rol });
        renderLogin();

        await iniciarSesion(user, 'staff@gmail.com', 'clave123');

        expect(navigateMock).toHaveBeenCalledWith('/admin');
    });

    it('vuelve a la página protegida que se intentó visitar', async () => {
        const user = userEvent.setup();
        loginMock.mockResolvedValue({ nombre: 'Ana', rol: 'USER' });
        renderLogin({ desde: '/pago' });

        await iniciarSesion(user, 'ana@correo.cl', 'clave123');

        expect(navigateMock).toHaveBeenCalledWith('/pago', { replace: true });
    });

    it('muestra un error si el backend responde 401', async () => {
        const user = userEvent.setup();
        loginMock.mockRejectedValue({ response: { status: 401, data: {} } });
        renderLogin();

        await iniciarSesion(user, 'ana@correo.cl', 'mala');

        expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.');
        expect(navigateMock).not.toHaveBeenCalled();
    });

    it('avisa cuando el backend no responde', async () => {
        const user = userEvent.setup();
        loginMock.mockRejectedValue(new Error('Network Error'));
        renderLogin();

        await iniciarSesion(user, 'ana@correo.cl', 'clave123');

        expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con el servidor');
    });
});
