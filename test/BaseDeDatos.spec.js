
import { productDB } from '../src/data/BaseDeDatos';

describe('Base de Datos de Productos', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('debe devolver todos los productos iniciales', () => {
        const productos = productDB.getAll();
        expect(productos.length).toBeGreaterThan(0);
    });

    it('debe crear un producto nuevo y asignarle un ID', () => {
        const nuevoProducto = {
            producto: 'Halo Infinite',
            precio: 39999,
            marca: 'Microsoft',
            stock: 5,
            categoria: 'Shooter',
            foto: '/images/halo.jpg'
        };

        const creado = productDB.create(nuevoProducto);
        
        expect(creado.id).toBeDefined();
        expect(creado.producto).toBe('Halo Infinite');
        
       
        const productos = productDB.getAll();
        expect(productos.length).toBeGreaterThan(4); 
    });

    it('debe encontrar un producto por su ID', () => {
        const producto = productDB.getById('demo-1');
        expect(producto).toBeDefined();
        expect(producto.producto).toBe('One Piece - Tomo 1');
    });

    it('debe devolver null si el ID no existe', () => {
        const producto = productDB.getById('id-inexistente');
        expect(producto).toBeUndefined();
    });

    it('debe actualizar el stock de un producto', () => {
        const actualizado = productDB.update('demo-1', { stock: 99 });
        expect(actualizado.stock).toBe(99);
        
        const verificado = productDB.getById('demo-1');
        expect(verificado.stock).toBe(99);
    });

    it('debe eliminar un producto', () => {
        const antes = productDB.getAll().length;
        productDB.delete('demo-1');
        const despues = productDB.getAll().length;
        
        expect(despues).toBe(antes - 1);
        expect(productDB.getById('demo-1')).toBeUndefined();
    });
});