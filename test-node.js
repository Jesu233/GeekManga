// 1. Simulamos el localStorage
global.localStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, value) { this.store[key] = String(value); },
    clear() { this.store = {}; }
};

// 2. Definimos productos iniciales
const initialProducts = [
    { id: 'demo-1', producto: 'One Piece - Tomo 1', precio: 15990, stock: 10 },
    { id: 'demo-2', producto: 'Figura Naruto', precio: 24990, stock: 5 }
];

// 3. Base de datos
const KEYS = { PRODUCTS: 'geekmanga_products' };

// 👇 AQUÍ ESTÁ EL TRUCO: Esta función reinicia la base de datos con los datos iniciales
const resetDB = () => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(initialProducts));
};

const createCRUD = (key) => {
    return {
        getAll: () => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        },
        create: (item) => {
            const items = JSON.parse(localStorage.getItem(key) || "[]");
            const newItem = { ...item, id: `new-${Date.now()}` };
            localStorage.setItem(key, JSON.stringify([...items, newItem]));
            return newItem;
        },
        getById: (id) => {
            const items = JSON.parse(localStorage.getItem(key) || "[]");
            return items.find(i => i.id === id);
        },
        update: (id, fields) => {
            const items = JSON.parse(localStorage.getItem(key) || "[]");
            const updatedItems = items.map(i => i.id === id ? { ...i, ...fields } : i);
            localStorage.setItem(key, JSON.stringify(updatedItems));
            return updatedItems.find(i => i.id === id);
        },
        delete: (id) => {
            const items = JSON.parse(localStorage.getItem(key) || "[]");
            const filtered = items.filter(i => i.id !== id);
            localStorage.setItem(key, JSON.stringify(filtered));
            return true;
        }
    };
};

const productDB = createCRUD(KEYS.PRODUCTS);

// 4. Corremos las pruebas
console.log("=== EJECUTANDO PRUEBAS UNITARIAS DE BASE DE DATOS ===\n");
let passed = 0;
let failed = 0;

function test(nombre, callback) {
    try {
        resetDB(); // 👈 Antes de cada prueba, reseteamos los datos
        callback();
        console.log(`✅ PASA: ${nombre}`);
        passed++;
    } catch (error) {
        console.error(`❌ FALLA: ${nombre} -> ${error.message}`);
        failed++;
    }
}

test('debe devolver todos los productos iniciales', () => {
    const productos = productDB.getAll();
    if (productos.length !== 2) throw new Error('No devolvió los 2 productos');
});

test('debe crear un producto nuevo', () => {
    const creado = productDB.create({ producto: 'Halo Infinite', precio: 39999 });
    if (!creado.id || creado.producto !== 'Halo Infinite') throw new Error('No se creó bien');
});

test('debe encontrar un producto por su ID', () => {
    const producto = productDB.getById('demo-1');
    if (!producto || producto.producto !== 'One Piece - Tomo 1') throw new Error('No lo encontró');
});

test('debe actualizar el stock de un producto', () => {
    const actualizado = productDB.update('demo-1', { stock: 99 });
    if (actualizado.stock !== 99) throw new Error('No actualizó');
});

test('debe eliminar un producto', () => {
    productDB.delete('demo-1');
    const productoEliminado = productDB.getById('demo-1');
    if (productoEliminado) throw new Error('No eliminó el producto');
});

console.log(`\n=== RESULTADO FINAL: ${passed} pasadas, ${failed} fallidas ===`);