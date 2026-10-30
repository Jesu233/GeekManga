import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Encabezado from '../src/components/Encabezado';
import { useCarrito } from '../src/context/CarritoContext';
import { PATHS } from '../src/routes/paths';

// Mock del contexto: controlamos la cantidad de productos sin montar el Provider
vi.mock('../src/context/CarritoContext', () => ({
    useCarrito: vi.fn(),
}));

const renderEncabezado = (ruta = '/') =>
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <Encabezado />
        </MemoryRouter>
    );

beforeEach(() => {
    useCarrito.mockReturnValue({ cantidadTotal: 3 });
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
