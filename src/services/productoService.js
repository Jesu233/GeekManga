import api from './api';

// Lectura pública del catálogo
export const listarProductos = () => api.get('/producto').then((r) => r.data);
export const listarOfertas = () => api.get('/producto/ofertas').then((r) => r.data);
export const listarPorCategoria = (categoriaId) =>
    api.get(`/producto/categoria/${categoriaId}`).then((r) => r.data);
export const buscarProducto = (id) => api.get(`/producto/buscar/${id}`).then((r) => r.data);

// Solo ADMIN (el backend responde 403 a otros roles)
export const crearProducto = (producto) => api.post('/producto', producto).then((r) => r.data);
export const actualizarProducto = (id, producto) =>
    api.put(`/producto/actualizar/${id}`, producto).then((r) => r.data);
export const eliminarProducto = (id) => api.delete(`/producto/eliminar/${id}`);
