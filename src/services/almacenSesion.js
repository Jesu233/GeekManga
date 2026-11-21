// Guarda la sesión en localStorage para que sobreviva a recargas de página y nuevas pestañas.
// Solo se guardan los tokens y datos básicos del usuario (nunca la contraseña).
// El access token expira (1 hora) y al recargar se valida contra el backend con /auth/me.

const CLAVES = {
    TOKEN: 'geekmanga_token',
    REFRESH: 'geekmanga_refresh_token',
    USUARIO: 'geekmanga_usuario',
};

const leerUsuario = () => {
    try {
        const data = localStorage.getItem(CLAVES.USUARIO);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

export const almacenSesion = {
    obtenerToken: () => localStorage.getItem(CLAVES.TOKEN),
    obtenerRefreshToken: () => localStorage.getItem(CLAVES.REFRESH),
    obtenerUsuario: leerUsuario,

    guardar({ token, refreshToken, usuario }) {
        if (token) localStorage.setItem(CLAVES.TOKEN, token);
        if (refreshToken) localStorage.setItem(CLAVES.REFRESH, refreshToken);
        if (usuario) localStorage.setItem(CLAVES.USUARIO, JSON.stringify(usuario));
    },

    guardarUsuario(usuario) {
        localStorage.setItem(CLAVES.USUARIO, JSON.stringify(usuario));
    },

    limpiar() {
        localStorage.removeItem(CLAVES.TOKEN);
        localStorage.removeItem(CLAVES.REFRESH);
        localStorage.removeItem(CLAVES.USUARIO);
    },
};
