import api from './api';

// POST /auth/login -> { token, refreshToken, expiraEnMs, usuario: { usuarioId, nombre, correo, rol } }
export const login = (correo, password) =>
    api.post('/auth/login', { correo, password }).then((r) => r.data);

// POST /auth/registro -> misma respuesta que login (queda con sesión iniciada como USER)
export const registrar = (datos) =>
    api.post('/auth/registro', datos).then((r) => r.data);

// GET /auth/me -> datos del usuario dueño del token (se usa al recargar la página)
export const obtenerUsuarioActual = () =>
    api.get('/auth/me').then((r) => r.data);
