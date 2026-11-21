import api from './api';

export const listarCategorias = () => api.get('/categoria').then((r) => r.data);
export const buscarCategoria = (id) => api.get(`/categoria/buscar/${id}`).then((r) => r.data);

// Solo ADMIN
export const crearCategoria = (nombreCategoria) =>
    api.post('/categoria', { nombreCategoria }).then((r) => r.data);
export const actualizarCategoria = (id, nombreCategoria) =>
    api.put(`/categoria/actualizar/${id}`, { nombreCategoria }).then((r) => r.data);
export const eliminarCategoria = (id) => api.delete(`/categoria/eliminar/${id}`);
