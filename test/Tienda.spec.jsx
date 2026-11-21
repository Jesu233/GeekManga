// Pruebas de las páginas públicas de la tienda conectadas a la API (servicios simulados con vi.mock)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import Productos from '../src/pages/Productos';
import DetalleProducto from '../src/pages/DetalleProducto';
import Ofertas from '../src/pages/Ofertas';
import Categorias from '../src/pages/Categorias';
import CategoriaDetalle from '../src/pages/CategoriaDetalle';
import * as productoService from '../src/services/productoService';
import * as categoriaService from '../src/services/categoriaService';
import { useCarrito } from '../src/context/CarritoContext';

vi.mock('../src/services/productoService');
vi.mock('../src/services/categoriaService');
vi.mock('../src/context/CarritoContext', () => ({ useCarrito: vi.fn() }));

const manga = { categoriaId: 1, nombreCategoria: 'Manga' };
const onePiece = {
    id: 1, codigo: 'M001', producto: 'One Piece - Tomo 1', marca: 'Shueisha', precio: 15990,
    oferta: true, precioOferta: 12990, stock: 12, stockCritico: 5, descripcion: 'Clásico',
    urlFoto: '/images/onepiece.jpg', categoria: manga,
};
const berserk = {
    id: 4, codigo: 'M002', producto: 'Berserk - Tomo 1', marca: 'Panini', precio: 18990,
    oferta: false, precioOferta: null, stock: 0, stockCritico: 5, urlFoto: '/images/berserk.jpg', categoria: manga,
};

const agregarMock = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
    useCarrito.mockReturnValue({ carrito: [], agregarAlCarrito: agregarMock });
});

const renderEn = (ruta, patron, elemento) =>
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes><Route path={patron} element={elemento} /></Routes>
        </MemoryRouter>
    );

describe('Productos', () => {
    it('muestra los productos que entrega el backend con precio de oferta', async () => {
        productoService.listarProductos.mockResolvedValue([onePiece, berserk]);

        renderEn('/productos', '/productos', <Productos />);

        expect(await screen.findByText('One Piece - Tomo 1')).toBeInTheDocument();
        expect(screen.getByText('$12.990')).toBeInTheDocument();      // precio vigente
        expect(screen.getByText('$15.990')).toHaveClass('text-decoration-line-through');
        expect(screen.getAllByText('Manga')).toHaveLength(2);         // categoría como objeto
    });

    it('deshabilita "Agregar" en productos agotados y agrega los disponibles', async () => {
        const user = userEvent.setup();
        productoService.listarProductos.mockResolvedValue([onePiece, berserk]);

        renderEn('/productos', '/productos', <Productos />);
        const botones = await screen.findAllByRole('button', { name: 'Agregar' });

        expect(botones[1]).toBeDisabled();
        await user.click(botones[0]);
        expect(agregarMock).toHaveBeenCalledWith(onePiece);
    });

    it('muestra un error con opción de reintentar si el backend no responde', async () => {
        const user = userEvent.setup();
        productoService.listarProductos
            .mockRejectedValueOnce(new Error('Network Error'))
            .mockResolvedValueOnce([onePiece]);

        renderEn('/productos', '/productos', <Productos />);

        expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con el servidor');
        await user.click(screen.getByRole('button', { name: 'Reintentar' }));
        expect(await screen.findByText('One Piece - Tomo 1')).toBeInTheDocument();
    });
});

describe('DetalleProducto', () => {
    it('pide el producto por id y lo muestra', async () => {
        productoService.buscarProducto.mockResolvedValue(onePiece);

        renderEn('/productos/1', '/productos/:id', <DetalleProducto />);

        expect(await screen.findByRole('heading', { name: 'One Piece - Tomo 1' })).toBeInTheDocument();
        expect(productoService.buscarProducto).toHaveBeenCalledWith('1');
        expect(screen.getByText('Código: M001')).toBeInTheDocument();
    });

    it('muestra "Producto no encontrado" si el backend responde 404', async () => {
        productoService.buscarProducto.mockRejectedValue({ response: { status: 404, data: {} } });

        renderEn('/productos/99', '/productos/:id', <DetalleProducto />);

        expect(await screen.findByText('Producto no encontrado 😢')).toBeInTheDocument();
    });

    it('marca como agotado un producto sin stock', async () => {
        productoService.buscarProducto.mockResolvedValue(berserk);

        renderEn('/productos/4', '/productos/:id', <DetalleProducto />);

        expect(await screen.findByRole('button', { name: 'Agotado' })).toBeDisabled();
    });
});

describe('Ofertas', () => {
    it('usa el endpoint de ofertas', async () => {
        productoService.listarOfertas.mockResolvedValue([onePiece]);

        renderEn('/ofertas', '/ofertas', <Ofertas />);

        expect(await screen.findByText('One Piece - Tomo 1')).toBeInTheDocument();
        expect(productoService.listarOfertas).toHaveBeenCalled();
    });

    it('avisa cuando no hay ofertas', async () => {
        productoService.listarOfertas.mockResolvedValue([]);

        renderEn('/ofertas', '/ofertas', <Ofertas />);

        expect(await screen.findByText('No hay ofertas disponibles en este momento.')).toBeInTheDocument();
    });
});

describe('Categorías', () => {
    it('lista las categorías con su cantidad de productos', async () => {
        categoriaService.listarCategorias.mockResolvedValue([manga, { categoriaId: 2, nombreCategoria: 'Figura' }]);
        productoService.listarProductos.mockResolvedValue([onePiece, berserk]);

        renderEn('/categoria', '/categoria', <Categorias />);

        expect(await screen.findByRole('heading', { name: 'Manga' })).toBeInTheDocument();
        expect(screen.getByText('2 producto(s)')).toBeInTheDocument();
        expect(screen.getByText('0 producto(s)')).toBeInTheDocument();
        expect(screen.getAllByRole('link', { name: 'Ver productos' })[0]).toHaveAttribute('href', '/categorias/1');
    });

    it('el detalle muestra los productos de la categoría', async () => {
        categoriaService.buscarCategoria.mockResolvedValue(manga);
        productoService.listarPorCategoria.mockResolvedValue([onePiece]);

        renderEn('/categorias/1', '/categorias/:id', <CategoriaDetalle />);

        expect(await screen.findByText('Categoría: Manga')).toBeInTheDocument();
        expect(screen.getByText('One Piece - Tomo 1')).toBeInTheDocument();
        expect(productoService.listarPorCategoria).toHaveBeenCalledWith('1');
    });

    it('el detalle avisa si la categoría no existe', async () => {
        categoriaService.buscarCategoria.mockRejectedValue({ response: { status: 404, data: {} } });
        productoService.listarPorCategoria.mockResolvedValue([]);

        renderEn('/categorias/9', '/categorias/:id', <CategoriaDetalle />);

        expect(await screen.findByText('La categoría no existe.')).toBeInTheDocument();
    });
});
