import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Login from '../src/pages/Login';

// Mock de useNavigate: así comprobamos a dónde redirige sin navegar de verdad
const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return { ...actual, useNavigate: () => navigateMock };
});

const clienteGuardado = {
    id: 'user-1',
    nombre: 'Ana',
    correo: 'ana@correo.cl',
    password: 'clave123',
    tipoUsuario: 'Cliente',
};

const renderLogin = () =>
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

const iniciarSesion = async (user, correo, password) => {
    if (correo) await user.type(screen.getByLabelText('Correo'), correo);
    if (password) await user.type(screen.getByLabelText('Contraseña'), password);
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
};

beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    navigateMock.mockClear();
});

describe('Login - validaciones del formulario', () => {
    it('muestra errores de campos obligatorios si se envía vacío', async () => {
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user);

        expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument();
        expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument();
        expect(navigateMock).not.toHaveBeenCalled();
    });

    it('marca el input de correo como inválido cuando falta', async () => {
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user);

        expect(screen.getByLabelText('Correo')).toHaveClass('is-invalid');
        expect(screen.getByLabelText('Contraseña')).toHaveClass('is-invalid');
    });

    it('rechaza un correo con formato inválido', async () => {
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user, 'correo-sin-arroba', 'clave123');

        expect(screen.getByText('El formato del correo no es válido.')).toBeInTheDocument();
        expect(navigateMock).not.toHaveBeenCalled();
    });

    it('no muestra mensajes de error antes de enviar el formulario', () => {
        renderLogin();

        expect(screen.queryByText('El correo es obligatorio.')).not.toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});

describe('Login - autenticación y redirección', () => {
    it('muestra una alerta si las credenciales son incorrectas', async () => {
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user, 'nadie@correo.cl', 'mala');

        expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.');
        expect(sessionStorage.getItem('usuarioActivo')).toBeNull();
        expect(navigateMock).not.toHaveBeenCalled();
    });

    it('el administrador por defecto inicia sesión y va a /admin', async () => {
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user, 'admin@gmail.com', 'admin123');

        const sesion = JSON.parse(sessionStorage.getItem('usuarioActivo'));
        expect(sesion).toMatchObject({ correo: 'admin@gmail.com', tipoUsuario: 'Administrador' });
        expect(sesion.password).toBeUndefined(); // la contraseña no se guarda en la sesión
        expect(navigateMock).toHaveBeenCalledWith('/admin');
    });

    it('un cliente registrado inicia sesión y va al Home', async () => {
        localStorage.setItem('usuarios', JSON.stringify([clienteGuardado]));
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user, 'ana@correo.cl', 'clave123');

        expect(JSON.parse(sessionStorage.getItem('usuarioActivo'))).toMatchObject({
            nombre: 'Ana',
            tipoUsuario: 'Cliente',
        });
        expect(navigateMock).toHaveBeenCalledWith('/');
    });

    it('un vendedor también es redirigido a /admin', async () => {
        localStorage.setItem(
            'usuarios',
            JSON.stringify([{ ...clienteGuardado, id: 'user-2', correo: 'vende@correo.cl', tipoUsuario: 'Vendedor' }])
        );
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user, 'vende@correo.cl', 'clave123');

        expect(navigateMock).toHaveBeenCalledWith('/admin');
    });

    it('normaliza el correo a minúsculas antes de buscar al usuario', async () => {
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user, 'ADMIN@GMAIL.COM', 'admin123');

        expect(navigateMock).toHaveBeenCalledWith('/admin');
    });

    it('si los usuarios guardados están corruptos, igual permite entrar como administrador', async () => {
        localStorage.setItem('usuarios', '{esto-no-es-json');
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user, 'admin@gmail.com', 'admin123');

        expect(navigateMock).toHaveBeenCalledWith('/admin');
        // El admin por defecto se vuelve a guardar con un JSON válido
        expect(JSON.parse(localStorage.getItem('usuarios'))).toHaveLength(1);
    });

    it('crea el administrador por defecto en localStorage la primera vez', async () => {
        const user = userEvent.setup();
        renderLogin();

        await iniciarSesion(user, 'admin@gmail.com', 'admin123');

        const usuarios = JSON.parse(localStorage.getItem('usuarios'));
        expect(usuarios.some((u) => u.correo === 'admin@gmail.com')).toBe(true);
    });
});
