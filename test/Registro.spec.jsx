import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Registro from '../src/pages/Registro';

// Mock de useNavigate para comprobar la redirección al login
const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return { ...actual, useNavigate: () => navigateMock };
});

const renderRegistro = () =>
    render(
        <MemoryRouter>
            <Registro />
        </MemoryRouter>
    );

// Los <label> de este formulario no están asociados a los inputs (sin htmlFor),
// por eso se buscan los campos por su atributo name.
const campo = (container, name) => container.querySelector(`input[name="${name}"]`);

const llenarFormulario = async (user, container, datos) => {
    for (const [name, valor] of Object.entries(datos)) {
        await user.type(campo(container, name), valor);
    }
};

const datosValidos = {
    nombre: 'Ana',
    apellidos: 'Pérez',
    run: '12345678-9',
    correo: 'Ana@Correo.cl',
    password: 'clave123',
    confirmarPassword: 'clave123',
};

beforeEach(() => {
    localStorage.clear();
    navigateMock.mockClear();
});

afterEach(() => {
    vi.useRealTimers();
});

describe('Registro - renderizado', () => {
    it('muestra todos los campos del formulario y el botón de registro', () => {
        const { container } = renderRegistro();

        ['nombre', 'apellidos', 'run', 'correo', 'password', 'confirmarPassword'].forEach((name) => {
            expect(campo(container, name)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /inicia sesión aquí/i })).toHaveAttribute('href', '/login');
    });

    it('actualiza el estado del formulario mientras el usuario escribe', async () => {
        const user = userEvent.setup();
        const { container } = renderRegistro();

        await user.type(campo(container, 'nombre'), 'Ana');
        await user.type(campo(container, 'run'), '12345678-9');

        expect(campo(container, 'nombre')).toHaveValue('Ana');
        expect(campo(container, 'run')).toHaveValue('12345678-9');
    });
});

describe('Registro - validaciones', () => {
    it('muestra error si faltan nombre, correo o contraseña', () => {
        const { container } = renderRegistro();

        // fireEvent.submit evita la validación nativa de los atributos "required"
        // y permite ejecutar la validación propia del componente.
        fireEvent.submit(container.querySelector('form'));

        expect(screen.getByText('El nombre, correo y contraseña son obligatorios.')).toBeInTheDocument();
        expect(localStorage.getItem('usuarios')).toBeNull();
    });

    it('muestra error si las contraseñas no coinciden', async () => {
        const user = userEvent.setup();
        const { container } = renderRegistro();

        await llenarFormulario(user, container, {
            ...datosValidos,
            confirmarPassword: 'otra-clave',
        });
        await user.click(screen.getByRole('button', { name: 'Registrarse' }));

        expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument();
        expect(localStorage.getItem('usuarios')).toBeNull();
        expect(navigateMock).not.toHaveBeenCalled();
    });

    it('rechaza un correo que ya está registrado (sin importar mayúsculas)', async () => {
        localStorage.setItem('usuarios', JSON.stringify([{ id: 'user-1', correo: 'ana@correo.cl' }]));
        const user = userEvent.setup();
        const { container } = renderRegistro();

        await llenarFormulario(user, container, datosValidos);
        await user.click(screen.getByRole('button', { name: 'Registrarse' }));

        expect(screen.getByText(/este correo ya está registrado/i)).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('usuarios'))).toHaveLength(1);
    });
});

describe('Registro - creación de la cuenta', () => {
    it('guarda un usuario de tipo Cliente con el correo normalizado', async () => {
        const user = userEvent.setup();
        const { container } = renderRegistro();

        await llenarFormulario(user, container, datosValidos);
        await user.click(screen.getByRole('button', { name: 'Registrarse' }));

        const usuarios = JSON.parse(localStorage.getItem('usuarios'));
        expect(usuarios).toHaveLength(1);
        expect(usuarios[0]).toMatchObject({
            nombre: 'Ana',
            apellidos: 'Pérez',
            correo: 'ana@correo.cl',
            tipoUsuario: 'Cliente',
        });
        expect(usuarios[0].id).toMatch(/^user-/);
    });

    it('muestra el mensaje de éxito y redirige al login después de 2 segundos', async () => {
        const user = userEvent.setup();
        const { container } = renderRegistro();

        // Se escribe con timers reales; los falsos se activan justo antes de enviar,
        // porque user-event se bloquea si se usa con vi.useFakeTimers().
        await llenarFormulario(user, container, datosValidos);
        vi.useFakeTimers();
        fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

        expect(screen.getByText(/cuenta creada con éxito/i)).toBeInTheDocument();
        expect(navigateMock).not.toHaveBeenCalled(); // todavía no pasan los 2 segundos

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(navigateMock).toHaveBeenCalledWith('/login');
    });
});
