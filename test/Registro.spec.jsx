import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Registro from '../src/pages/Registro';
import { useAuth } from '../src/context/AuthContext';

vi.mock('../src/context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

const registrarMock = vi.fn();

const renderRegistro = () =>
    render(
        <MemoryRouter>
            <Registro />
        </MemoryRouter>
    );

const completar = async (user, datos) => {
    const campos = {
        Nombre: datos.nombre,
        Apellidos: datos.apellidos,
        RUN: datos.run,
        'Correo Electrónico': datos.correo,
        Contraseña: datos.password,
        'Confirmar Contraseña': datos.confirmar,
    };
    for (const [label, valor] of Object.entries(campos)) {
        if (valor) await user.type(screen.getByLabelText(label), valor);
    }
    await user.click(screen.getByRole('button', { name: 'Registrarse' }));
};

const validos = {
    nombre: 'Ana',
    apellidos: 'Pérez',
    run: '12345678-9',
    correo: 'Ana@Correo.cl',
    password: 'clave123',
    confirmar: 'clave123',
};

beforeEach(() => {
    registrarMock.mockReset();
    useAuth.mockReturnValue({ registrar: registrarMock });
});

describe('Registro - validaciones', () => {
    it('exige nombre, RUN, correo y contraseña', async () => {
        const user = userEvent.setup();
        renderRegistro();

        await completar(user, { nombre: 'Ana' });

        expect(screen.getByRole('alert')).toHaveTextContent('El nombre, RUN, correo y contraseña son obligatorios.');
        expect(registrarMock).not.toHaveBeenCalled();
    });

    it('valida el formato del RUN', async () => {
        const user = userEvent.setup();
        renderRegistro();

        await completar(user, { ...validos, run: '12.345.678' });

        expect(screen.getByRole('alert')).toHaveTextContent('El RUN debe ir sin puntos y con guion');
    });

    it('valida que las contraseñas coincidan', async () => {
        const user = userEvent.setup();
        renderRegistro();

        await completar(user, { ...validos, confirmar: 'otra123' });

        expect(screen.getByRole('alert')).toHaveTextContent('Las contraseñas no coinciden.');
        expect(registrarMock).not.toHaveBeenCalled();
    });
});

describe('Registro - conexión con el backend', () => {
    it('envía los datos al backend con el correo normalizado', async () => {
        const user = userEvent.setup();
        registrarMock.mockResolvedValue({ nombre: 'Ana', rol: 'USER' });
        renderRegistro();

        await completar(user, validos);

        expect(registrarMock).toHaveBeenCalledWith({
            nombre: 'Ana',
            apellidos: 'Pérez',
            run: '12345678-9',
            correo: 'ana@correo.cl',
            password: 'clave123',
        });
        expect(await screen.findByRole('status')).toHaveTextContent('¡Cuenta creada con éxito!');
    });

    it('muestra el mensaje del backend cuando el correo ya existe (409)', async () => {
        const user = userEvent.setup();
        registrarMock.mockRejectedValue({
            response: { status: 409, data: { mensaje: 'El correo ana@correo.cl ya está registrado' } },
        });
        renderRegistro();

        await completar(user, validos);

        expect(await screen.findByRole('alert')).toHaveTextContent('El correo ana@correo.cl ya está registrado');
    });

    it('muestra los errores por campo que devuelve el backend (400)', async () => {
        const user = userEvent.setup();
        registrarMock.mockRejectedValue({
            response: { status: 400, data: { mensaje: 'Revisa los campos', campos: { nombre: 'Nombre demasiado largo' } } },
        });
        renderRegistro();

        await completar(user, validos);

        expect(await screen.findByRole('alert')).toHaveTextContent('Nombre demasiado largo');
    });
});
