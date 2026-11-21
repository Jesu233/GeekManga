// Pruebas del panel de administración conectado a la API (servicios simulados con vi.mock)
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import AdminPanel from '../src/pages/AdminPanel';
import AdminListadoProductos from '../src/pages/AdminListadoProductos';
import AdminAgregarProducto from '../src/pages/AdminAgregarProducto';
import AdminEditarProducto from '../src/pages/AdminEditarProducto';
import AdminUsuarios from '../src/pages/AdministrarUsuarios';
import AdminBoletas from '../src/pages/AdminBoletas';
import * as productoService from '../src/services/productoService';
import * as categoriaService from '../src/services/categoriaService';
import * as usuarioService from '../src/services/usuarioService';
import * as boletaService from '../src/services/boletaService';
import { useAuth } from '../src/context/AuthContext';

vi.mock('../src/services/productoService');
vi.mock('../src/services/categoriaService');
vi.mock('../src/services/usuarioService');
vi.mock('../src/services/boletaService');
vi.mock('../src/context/AuthContext', () => ({ useAuth: vi.fn() }));

const categorias = [{ categoriaId: 1, nombreCategoria: 'Manga' }, { categoriaId: 2, nombreCategoria: 'Figura' }];
const onePiece = {
    id: 1, codigo: 'M001', producto: 'One Piece - Tomo 1', marca: 'Shueisha', precio: 15990, oferta: true,
    precioOferta: 12990, stock: 12, stockCritico: 5, descripcion: 'Clásico', urlFoto: '/images/onepiece.jpg', categoria: categorias[0],
};
const berserk = {
    id: 4, codigo: 'M002', producto: 'Berserk - Tomo 1', marca: 'Panini', precio: 18990, oferta: false,
    precioOferta: null, stock: 3, stockCritico: 5, urlFoto: '/images/berserk.jpg', categoria: categorias[0],
};
const boleta = {
    id: 7, fechaEmision: '2026-11-21T16:40:00', total: 25980, usuario: { usuarioId: 3, nombre: 'Cliente', correo: 'cliente@gmail.com' },
    detalles: [{ id: 1, cantidad: 2, precioUnitario: 12990, subtotal: 25980, producto: { id: 1, producto: 'One Piece - Tomo 1' } }],
};
const usuarios = [
    { usuarioId: 1, nombre: 'Administrador', apellidos: 'GeekManga', run: '11111111-1', correo: 'admin@gmail.com', tipoUsuario: 'ADMIN' },
    { usuarioId: 3, nombre: 'Cliente', apellidos: 'Demo', run: '33333333-3', correo: 'cliente@gmail.com', tipoUsuario: 'USER' },
];

const comoRol = (rol) => useAuth.mockReturnValue({
    usuario: { usuarioId: 1, nombre: rol === 'ADMIN' ? 'Administrador' : 'Vale', correo: 'x@gmail.com', rol },
    logout: vi.fn(),
    tieneRol: (...roles) => roles.includes(rol),
});

const renderEn = (ruta, patron, elemento) =>
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path={patron} element={elemento} />
                <Route path="/admin/listado" element={<p>Listado de productos</p>} />
            </Routes>
        </MemoryRouter>
    );

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    productoService.listarProductos.mockResolvedValue([onePiece, berserk]);
    categoriaService.listarCategorias.mockResolvedValue(categorias);
    usuarioService.listarUsuarios.mockResolvedValue(usuarios);
    boletaService.listarBoletas.mockResolvedValue([boleta]);
});

describe('AdminPanel', () => {
    it('ADMIN ve el resumen completo con datos del backend', async () => {
        comoRol('ADMIN');
        renderEn('/admin', '/admin', <AdminPanel />);

        expect(await screen.findByText('Usuarios registrados:')).toBeInTheDocument();
        expect(usuarioService.listarUsuarios).toHaveBeenCalled();
        expect(screen.getByRole('link', { name: 'Administrar usuarios' })).toBeInTheDocument();
        expect(screen.getAllByText('$25.980').length).toBeGreaterThan(0);
    });

    it('VENDEDOR no ve usuarios ni productos y no consulta /usuario', async () => {
        comoRol('VENDEDOR');
        renderEn('/admin', '/admin', <AdminPanel />);

        expect(await screen.findByText('Boletas emitidas:')).toBeInTheDocument();
        expect(screen.queryByText('Usuarios registrados:')).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Administrar usuarios' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Ir a productos' })).not.toBeInTheDocument();
        expect(usuarioService.listarUsuarios).not.toHaveBeenCalled();
    });
});

describe('AdminListadoProductos', () => {
    it('ADMIN puede eliminar productos', async () => {
        const user = userEvent.setup();
        comoRol('ADMIN');
        productoService.eliminarProducto.mockResolvedValue({});
        renderEn('/admin/listado', '/admin/listado', <AdminListadoProductos />);

        const fila = (await screen.findByText('Berserk - Tomo 1')).closest('tr');
        await user.click(within(fila).getByRole('button', { name: 'Eliminar' }));

        expect(productoService.eliminarProducto).toHaveBeenCalledWith(4);
        expect(await screen.findByText('Producto eliminado.')).toBeInTheDocument();
    });

    it('VENDEDOR ve el listado sin botones de edición', async () => {
        comoRol('VENDEDOR');
        renderEn('/admin/listado', '/admin/listado', <AdminListadoProductos />);

        expect(await screen.findByText('One Piece - Tomo 1')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Editar' })).not.toBeInTheDocument();
    });
});

describe('AdminAgregarProducto', () => {
    it('valida el formulario antes de enviar', async () => {
        const user = userEvent.setup();
        comoRol('ADMIN');
        renderEn('/admin/agregar-producto', '/admin/agregar-producto', <AdminAgregarProducto />);

        await user.click(await screen.findByRole('button', { name: 'Subir producto' }));

        expect(screen.getByText('El código es obligatorio')).toBeInTheDocument();
        expect(screen.getByText('Selecciona una categoría', { selector: '.invalid-feedback' })).toBeInTheDocument();
        expect(productoService.crearProducto).not.toHaveBeenCalled();
    });

    it('envía el producto con la categoría como objeto', async () => {
        const user = userEvent.setup();
        comoRol('ADMIN');
        productoService.crearProducto.mockImplementation(async (p) => ({ ...p, id: 9 }));
        renderEn('/admin/agregar-producto', '/admin/agregar-producto', <AdminAgregarProducto />);

        await user.type(await screen.findByLabelText('Código'), 'F002');
        await user.type(screen.getByLabelText('Nombre del Producto'), 'Figura Goku');
        await user.type(screen.getByLabelText('Precio del Producto'), '29990');
        await user.type(screen.getByLabelText('Marca del producto'), 'Bandai');
        await user.type(screen.getByLabelText('Stock'), '4');
        await user.type(screen.getByLabelText('Stock crítico'), '1');
        await user.selectOptions(screen.getByLabelText('Categoría'), '2');
        await user.click(screen.getByLabelText('Producto en oferta'));
        await user.type(screen.getByLabelText('Precio de oferta'), '24990');
        await user.click(screen.getByRole('button', { name: 'Subir producto' }));

        expect(productoService.crearProducto).toHaveBeenCalledWith(expect.objectContaining({
            codigo: 'F002', precio: 29990, oferta: true, precioOferta: 24990, categoria: { categoriaId: 2 },
        }));
        expect(await screen.findByText('¡Producto "Figura Goku" agregado con éxito!')).toBeInTheDocument();
    });

    it('rechaza un precio de oferta mayor al precio normal', async () => {
        const user = userEvent.setup();
        comoRol('ADMIN');
        renderEn('/admin/agregar-producto', '/admin/agregar-producto', <AdminAgregarProducto />);

        await user.type(await screen.findByLabelText('Precio del Producto'), '1000');
        await user.click(screen.getByLabelText('Producto en oferta'));
        await user.type(screen.getByLabelText('Precio de oferta'), '2000');
        await user.click(screen.getByRole('button', { name: 'Subir producto' }));

        expect(screen.getByText('Debe ser menor al precio normal')).toBeInTheDocument();
    });

    it('muestra el error del backend si el código está repetido', async () => {
        const user = userEvent.setup();
        comoRol('ADMIN');
        productoService.crearProducto.mockRejectedValue({ response: { status: 409, data: { mensaje: 'Ya existe un producto con el código M001' } } });
        renderEn('/admin/agregar-producto', '/admin/agregar-producto', <AdminAgregarProducto />);

        await user.type(await screen.findByLabelText('Código'), 'M001');
        await user.type(screen.getByLabelText('Nombre del Producto'), 'Repetido');
        await user.type(screen.getByLabelText('Precio del Producto'), '1000');
        await user.type(screen.getByLabelText('Marca del producto'), 'X');
        await user.type(screen.getByLabelText('Stock'), '1');
        await user.type(screen.getByLabelText('Stock crítico'), '1');
        await user.selectOptions(screen.getByLabelText('Categoría'), '1');
        await user.click(screen.getByRole('button', { name: 'Subir producto' }));

        expect(await screen.findByText('Ya existe un producto con el código M001')).toBeInTheDocument();
    });

    it('crea categorías', async () => {
        const user = userEvent.setup();
        comoRol('ADMIN');
        categoriaService.crearCategoria.mockResolvedValue({ categoriaId: 3, nombreCategoria: 'Comic' });
        renderEn('/admin/agregar-producto', '/admin/agregar-producto', <AdminAgregarProducto />);

        await user.type(await screen.findByLabelText('Nueva categoría'), 'Comic');
        await user.click(screen.getByRole('button', { name: 'Agregar categoría' }));

        expect(categoriaService.crearCategoria).toHaveBeenCalledWith('Comic');
    });
});

describe('AdminEditarProducto', () => {
    it('carga el producto, guarda los cambios y vuelve al listado', async () => {
        const user = userEvent.setup();
        comoRol('ADMIN');
        productoService.buscarProducto.mockResolvedValue(onePiece);
        productoService.actualizarProducto.mockResolvedValue(onePiece);
        renderEn('/admin/editar-producto/1', '/admin/editar-producto/:id', <AdminEditarProducto />);

        const stock = await screen.findByLabelText('Stock');
        expect(stock).toHaveValue(12);
        await user.clear(stock);
        await user.type(stock, '20');
        await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

        expect(productoService.actualizarProducto).toHaveBeenCalledWith('1', expect.objectContaining({ stock: 20 }));
        expect(await screen.findByText('Listado de productos')).toBeInTheDocument();
    });
});

describe('AdministrarUsuarios', () => {
    it('lista usuarios con sus roles y no permite eliminarse a sí mismo', async () => {
        comoRol('ADMIN');
        renderEn('/admin/usuarios', '/admin/usuarios', <AdminUsuarios />);

        const filaAdmin = (await screen.findByText('admin@gmail.com')).closest('tr');
        expect(within(filaAdmin).queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
        expect(screen.getByText('Vendedor', { selector: 'option' })).toBeInTheDocument();
    });

    it('crea un usuario con el rol elegido', async () => {
        const user = userEvent.setup();
        comoRol('ADMIN');
        usuarioService.crearUsuario.mockResolvedValue({ usuarioId: 9 });
        renderEn('/admin/usuarios', '/admin/usuarios', <AdminUsuarios />);

        await user.type(await screen.findByLabelText('Nombre'), 'Vale');
        await user.type(screen.getByLabelText('RUN'), '22222222-2');
        await user.type(screen.getByLabelText('Correo'), 'Vale@Gmail.com');
        await user.type(screen.getByLabelText('Contraseña'), 'vale123');
        await user.selectOptions(screen.getByLabelText('Tipo de usuario'), 'VENDEDOR');
        await user.click(screen.getByRole('button', { name: 'Guardar usuario' }));

        expect(usuarioService.crearUsuario).toHaveBeenCalledWith(expect.objectContaining({
            correo: 'vale@gmail.com', tipoUsuario: 'VENDEDOR', password: 'vale123',
        }));
        expect(await screen.findByText('Usuario creado.')).toBeInTheDocument();
    });

    it('edita un usuario sin obligar a cambiar la contraseña', async () => {
        const user = userEvent.setup();
        comoRol('ADMIN');
        usuarioService.actualizarUsuario.mockResolvedValue({});
        renderEn('/admin/usuarios', '/admin/usuarios', <AdminUsuarios />);

        const fila = (await screen.findByText('cliente@gmail.com')).closest('tr');
        await user.click(within(fila).getByRole('button', { name: 'Editar' }));
        await user.click(screen.getByRole('button', { name: 'Actualizar usuario' }));

        expect(usuarioService.actualizarUsuario).toHaveBeenCalledWith(3, expect.objectContaining({ password: null, tipoUsuario: 'USER' }));
    });

    it('elimina un usuario', async () => {
        const user = userEvent.setup();
        comoRol('ADMIN');
        usuarioService.eliminarUsuario.mockResolvedValue({});
        renderEn('/admin/usuarios', '/admin/usuarios', <AdminUsuarios />);

        const fila = (await screen.findByText('cliente@gmail.com')).closest('tr');
        await user.click(within(fila).getByRole('button', { name: 'Eliminar' }));

        expect(usuarioService.eliminarUsuario).toHaveBeenCalledWith(3);
    });
});

describe('AdminBoletas', () => {
    it('lista las ventas y muestra el detalle', async () => {
        const user = userEvent.setup();
        comoRol('VENDEDOR');
        renderEn('/admin/boletas', '/admin/boletas', <AdminBoletas />);

        expect(await screen.findByText('cliente@gmail.com')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Ver detalle' }));
        expect(screen.getByText(/One Piece - Tomo 1: 2 ×/)).toBeInTheDocument();
    });
});
