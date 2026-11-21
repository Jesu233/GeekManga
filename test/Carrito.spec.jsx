import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Carrito from '../src/pages/Carrito';
import { useCarrito } from '../src/context/CarritoContext';
import { useAuth } from '../src/context/AuthContext';
import { PATHS } from '../src/routes/paths';

// Mock de los contextos: la página se prueba aislada, sin Provider ni localStorage
vi.mock('../src/context/CarritoContext', () => ({
    useCarrito: vi.fn(),
}));
vi.mock('../src/context/AuthContext', () => ({
    useAuth: vi.fn(() => ({ usuario: null })),
}));

const items = [
    { id: 'm1', producto: 'One Piece - Tomo 1', marca: 'Shueisha', precio: 10000, cantidad: 2, foto: '/images/op.jpg' },
    { id: 'f1', producto: 'Figura Luffy', marca: 'Bandai', precio: 25000, cantidad: 3, foto: '/images/luffy.jpg' },
];

const crearContexto = (extra = {}) => ({
    carrito: items,
    precioTotal: 95000, // 2 x 10.000 + 3 x 25.000
    agregarAlCarrito: vi.fn(),
    disminuirCantidad: vi.fn(),
    quitarDelCarrito: vi.fn(),
    vaciarCarrito: vi.fn(),
    ...extra,
});

const renderCarrito = () =>
    render(
        <MemoryRouter>
            <Carrito />
        </MemoryRouter>
    );

describe('Página Carrito', () => {
    it('muestra el mensaje de carrito vacío y el enlace a la tienda', () => {
        useCarrito.mockReturnValue(crearContexto({ carrito: [], precioTotal: 0 }));

        renderCarrito();

        expect(screen.getByRole('heading', { name: /tu carrito está vacío/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /ir a la tienda/i })).toHaveAttribute('href', '/productos');
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('lista cada producto con su nombre y marca', () => {
        useCarrito.mockReturnValue(crearContexto());

        renderCarrito();

        expect(screen.getByText('One Piece - Tomo 1')).toBeInTheDocument();
        expect(screen.getByText('Figura Luffy')).toBeInTheDocument();
        expect(screen.getByText('Shueisha')).toBeInTheDocument();
        expect(screen.getByText('Bandai')).toBeInTheDocument();
        // 1 fila de encabezado + 2 productos
        expect(screen.getAllByRole('row')).toHaveLength(3);
    });

    it('muestra el subtotal de cada producto y el total con formato chileno', () => {
        useCarrito.mockReturnValue(crearContexto());

        renderCarrito();

        expect(screen.getByText('$20.000')).toBeInTheDocument(); // 2 x 10.000
        expect(screen.getByText('$75.000')).toBeInTheDocument(); // 3 x 25.000
        expect(screen.getByText('$95.000')).toBeInTheDocument(); // total
    });

    it('al hacer clic en ❌ llama a quitarDelCarrito con el id del producto', async () => {
        const contexto = crearContexto();
        useCarrito.mockReturnValue(contexto);
        const user = userEvent.setup();

        renderCarrito();
        const botonesQuitar = screen.getAllByRole('button', { name: '❌' });
        await user.click(botonesQuitar[1]);

        expect(contexto.quitarDelCarrito).toHaveBeenCalledTimes(1);
        expect(contexto.quitarDelCarrito).toHaveBeenCalledWith('f1');
    });

    it('el botón "Vaciar carrito" inferior llama a vaciarCarrito', async () => {
        const contexto = crearContexto();
        useCarrito.mockReturnValue(contexto);
        const user = userEvent.setup();

        renderCarrito();
        const botonesVaciar = screen.getAllByRole('button', { name: /vaciar carrito/i });
        await user.click(botonesVaciar[botonesVaciar.length - 1]);

        expect(contexto.vaciarCarrito).toHaveBeenCalledTimes(1);
    });

    it('los botones + y − cambian la cantidad', async () => {
        const contexto = crearContexto();
        useCarrito.mockReturnValue(contexto);
        const user = userEvent.setup();

        renderCarrito();
        await user.click(screen.getByRole('button', { name: 'Agregar una unidad de One Piece - Tomo 1' }));
        await user.click(screen.getByRole('button', { name: 'Quitar una unidad de Figura Luffy' }));

        expect(contexto.agregarAlCarrito).toHaveBeenCalledWith(items[0]);
        expect(contexto.disminuirCantidad).toHaveBeenCalledWith('f1');
    });

    it('avisa que se pedirá iniciar sesión si no hay sesión', () => {
        useCarrito.mockReturnValue(crearContexto());
        renderCarrito();
        expect(screen.getByText('Para comprar te pediremos iniciar sesión.')).toBeInTheDocument();
    });

    it('no muestra el aviso si el usuario ya inició sesión', () => {
        useAuth.mockReturnValue({ usuario: { nombre: 'Ana', rol: 'USER' } });
        useCarrito.mockReturnValue(crearContexto());
        renderCarrito();
        expect(screen.queryByText('Para comprar te pediremos iniciar sesión.')).not.toBeInTheDocument();
    });

    it('incluye los enlaces para seguir comprando y para ir al pago', () => {
        useCarrito.mockReturnValue(crearContexto());

        renderCarrito();

        expect(screen.getByRole('link', { name: /seguir comprando/i })).toHaveAttribute('href', '/productos');
        expect(screen.getByRole('link', { name: 'Comprar' })).toHaveAttribute('href', PATHS.PAGO);
    });
});
