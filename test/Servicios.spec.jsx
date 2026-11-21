// Verifica que cada servicio llame al endpoint REST correcto del backend
import api from '../src/services/api';
import * as authService from '../src/services/authService';
import * as productoService from '../src/services/productoService';
import * as categoriaService from '../src/services/categoriaService';
import * as usuarioService from '../src/services/usuarioService';
import * as boletaService from '../src/services/boletaService';

let peticiones = [];

beforeEach(() => {
    peticiones = [];
    localStorage.clear();
    // Adapter falso: registra método, URL y cuerpo, y responde 200 con { ok: true }
    api.defaults.adapter = async (config) => {
        peticiones.push({
            metodo: config.method.toUpperCase(),
            url: config.url,
            cuerpo: config.data ? JSON.parse(config.data) : undefined,
        });
        return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config };
    };
});

const ultima = () => peticiones[peticiones.length - 1];

describe('Servicios REST', () => {
    it.each([
        ['login', () => authService.login('a@b.cl', 'x'), 'POST', '/auth/login'],
        ['registro', () => authService.registrar({ nombre: 'A' }), 'POST', '/auth/registro'],
        ['usuario actual', () => authService.obtenerUsuarioActual(), 'GET', '/auth/me'],

        ['listar productos', () => productoService.listarProductos(), 'GET', '/producto'],
        ['ofertas', () => productoService.listarOfertas(), 'GET', '/producto/ofertas'],
        ['por categoría', () => productoService.listarPorCategoria(2), 'GET', '/producto/categoria/2'],
        ['buscar producto', () => productoService.buscarProducto(5), 'GET', '/producto/buscar/5'],
        ['crear producto', () => productoService.crearProducto({ codigo: 'X' }), 'POST', '/producto'],
        ['actualizar producto', () => productoService.actualizarProducto(5, {}), 'PUT', '/producto/actualizar/5'],
        ['eliminar producto', () => productoService.eliminarProducto(5), 'DELETE', '/producto/eliminar/5'],

        ['listar categorías', () => categoriaService.listarCategorias(), 'GET', '/categoria'],
        ['buscar categoría', () => categoriaService.buscarCategoria(1), 'GET', '/categoria/buscar/1'],
        ['crear categoría', () => categoriaService.crearCategoria('Comic'), 'POST', '/categoria'],
        ['actualizar categoría', () => categoriaService.actualizarCategoria(1, 'Mangas'), 'PUT', '/categoria/actualizar/1'],
        ['eliminar categoría', () => categoriaService.eliminarCategoria(1), 'DELETE', '/categoria/eliminar/1'],

        ['listar usuarios', () => usuarioService.listarUsuarios(), 'GET', '/usuario'],
        ['buscar usuario', () => usuarioService.buscarUsuario(3), 'GET', '/usuario/buscar/3'],
        ['crear usuario', () => usuarioService.crearUsuario({}), 'POST', '/usuario'],
        ['actualizar usuario', () => usuarioService.actualizarUsuario(3, {}), 'PUT', '/usuario/actualizar/3'],
        ['eliminar usuario', () => usuarioService.eliminarUsuario(3), 'DELETE', '/usuario/eliminar/3'],

        ['mis boletas', () => boletaService.misBoletas(), 'GET', '/boleta/mis-boletas'],
        ['buscar boleta', () => boletaService.buscarBoleta(7), 'GET', '/boleta/buscar/7'],
        ['listar boletas', () => boletaService.listarBoletas(), 'GET', '/boleta'],
    ])('%s -> %s %s', async (_nombre, llamada, metodo, url) => {
        await llamada();
        expect(ultima()).toMatchObject({ metodo, url });
    });

    it('crearBoleta envía solo productoId y cantidad', async () => {
        await boletaService.crearBoleta([
            { id: 1, producto: 'OP', precio: 999, cantidad: 2 },
            { id: 4, producto: 'Berserk', precio: 1, cantidad: 1 },
        ]);

        expect(ultima()).toEqual({
            metodo: 'POST',
            url: '/boleta',
            cuerpo: { items: [{ productoId: 1, cantidad: 2 }, { productoId: 4, cantidad: 1 }] },
        });
    });

    it('crearCategoria envía el nombre con el campo que espera el backend', async () => {
        await categoriaService.crearCategoria('Comic');
        expect(ultima().cuerpo).toEqual({ nombreCategoria: 'Comic' });
    });
});
