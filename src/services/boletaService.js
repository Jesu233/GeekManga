import api from './api';

// Cualquier usuario con sesión: paga el carrito.
// Solo viajan productoId y cantidad; el backend toma el usuario del token
// y calcula precios, total y descuento de stock.
export const crearBoleta = (carrito) =>
    api.post('/boleta', {
        items: carrito.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
    }).then((r) => r.data);

export const misBoletas = () => api.get('/boleta/mis-boletas').then((r) => r.data);
export const buscarBoleta = (id) => api.get(`/boleta/buscar/${id}`).then((r) => r.data);

// Solo ADMIN y VENDEDOR
export const listarBoletas = () => api.get('/boleta').then((r) => r.data);
