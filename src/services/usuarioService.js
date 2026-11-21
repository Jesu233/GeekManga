import api from './api';

// Solo ADMIN: administración de usuarios. La contraseña nunca viene en las respuestas.
export const listarUsuarios = () => api.get('/usuario').then((r) => r.data);
export const buscarUsuario = (id) => api.get(`/usuario/buscar/${id}`).then((r) => r.data);

// datos: { nombre, apellidos, run, correo, password, tipoUsuario: 'ADMIN' | 'VENDEDOR' | 'USER' }
export const crearUsuario = (datos) => api.post('/usuario', datos).then((r) => r.data);

// Al editar, si password va vacía el backend mantiene la actual
export const actualizarUsuario = (id, datos) =>
    api.put(`/usuario/actualizar/${id}`, datos).then((r) => r.data);

export const eliminarUsuario = (id) => api.delete(`/usuario/eliminar/${id}`);
