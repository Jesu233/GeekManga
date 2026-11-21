import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Encabezado from '../src/components/Encabezado';
import { useCarrito } from '../src/context/CarritoContext';
import { useAuth } from '../src/context/AuthContext';
import { PATHS } from '../src/routes/paths';

// Mock de los contextos: controlamos carrito y sesión sin montar los Providers
vi.mock('../src/context/CarritoContext', () => ({
    useCarrito: vi.fn(),
}));
vi.mock('../src/context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

const logoutMock = vi.fn();

const sesion = (usuario) => ({
    usuario,
    logout: logoutMock,
    tieneRol: (...roles) => Boolean(usuario) && roles.includes(usuario.rol),
});

const renderEncabezado = (ruta = '/') =>
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <Encabezado />
        </MemoryRouter>
    );

beforeEach(() => {
    useCarrito.mockReturnValue({ cantidadTotal: 3 });
    useAuth.mockReturnValue(sesion(null));
    logoutMock.mockClear();
});

describe('Encabezado - tienda', () => {
    it('muestra el logo de la tienda', () => {
        renderEncabezado();

        expect(screen.getByAltText('logo geek&manga')).toBeInTheDocument();
    });

    it('muestra los enlaces de navegación con sus rutas', () => {
        renderEncabezado();

        const enlaces = {
            Home: PATHS.HOME,
            Productos: PATHS.PRODUCTOS,
            Categorías: PATHS.CATEGORIAS,
            OFERTAS: PATHS.OFERTAS,
            Nosotros: PATHS.NOSOTROS,
            Blogs: PATHS.BLOGS,
            Contacto: PATHS.CONTACTO,
            Registrarse: PATHS.REGISTRARSE,
            'Iniciar sesión': PATHS.LOGIN,
        };

        Object.entries(enlaces).forEach(([nombre, ruta]) => {
            expect(screen.getByRole('link', { name: nombre })).toHaveAttribute('href', ruta);
        });
    });

    it('muestra la cantidad de productos del carrito', () => {
        renderEncabezado();

        const enlaceCarrito = screen.getByRole('link', { name: /carrito/i });
        expect(enlaceCarrito).toHaveTextContent('Carrito (3)');
        expect(enlaceCarrito).toHaveAttribute('href', PATHS.CARRITO);
    });

    it('muestra 0 cuando el carrito está vacío', () => {
        useCarrito.mockReturnValue({ cantidadTotal: 0 });

        renderEncabezado();

        expect(screen.getByRole('link', { name: /carrito/i })).toHaveTextContent('Carrito (0)');
    });
});

describe('Encabezado - sesión', () => {
    it('con sesión de cliente muestra su nombre y oculta registro, login y panel', () => {
        useAuth.mockReturnValue(sesion({ nombre: 'Ana', correo: 'ana@gmail.com', rol: 'USER' }));

        renderEncabezado();

        expect(screen.getByText('👤 Ana')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Registrarse' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Panel' })).not.toBeInTheDocument();
    });

    it('muestra el acceso al panel a ADMIN y VENDEDOR', () => {
        useAuth.mockReturnValue(sesion({ nombre: 'Vale', correo: 'v@gmail.com', rol: 'VENDEDOR' }));

        renderEncabezado();

        expect(screen.getByRole('link', { name: 'Panel' })).toHaveAttribute('href', PATHS.ADMIN);
    });

    it('cierra la sesión desde el menú del usuario', async () => {
        const user = userEvent.setup();
        useAuth.mockReturnValue(sesion({ nombre: 'Ana', correo: 'ana@gmail.com', rol: 'USER' }));

        renderEncabezado();
        await user.click(screen.getByText('👤 Ana'));
        await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

        expect(logoutMock).toHaveBeenCalled();
    });
});

describe('Encabezado - rutas de administración', () => {
    it('no renderiza nada en rutas que empiezan con /admin', () => {
        const { container } = renderEncabezado('/admin/productos');

        expect(container).toBeEmptyDOMElement();
        expect(screen.queryByAltText('logo geek&manga')).not.toBeInTheDocument();
    });

    it('sí se renderiza en rutas que solo contienen "admin" pero no empiezan con él', () => {
        renderEncabezado('/productos/administrar');

        expect(screen.getByAltText('logo geek&manga')).toBeInTheDocument();
    });
});
