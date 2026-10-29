

export const PATHS = {
    HOME: '/',
    NOSOTROS: '/nosotros',
    BLOGS: '/blogs',
    PRODUCTOS: '/productos',
    CONTACTO: '/contacto',
    TIENDA: '/tienda',
    CARRITO: '/carrito',
    CATEGORIAS: '/categoria',
    OFERTAS: '/ofertas',
    LOGIN: '/login',
    REGISTRARSE: "/registro",

    PRODUCTOS_ROUTE: '/productos/:id',        
    PRODUCTO_DETALLE: (id) => `/productos/${id}`,
    CATEGORIA_DETALLE: (nombre) => `/categoria/${nombre}`,

    PAGO: '/pago',
    PAGO_EXITOSO: '/pago-exitoso',
    PAGO_ERROR: '/pago-error',
};
