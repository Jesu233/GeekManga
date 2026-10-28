

export const PATHS = {
    HOME: '/',
    NOSOTROS: '/nosotros',
    BLOGS: '/blogs',
    PRODUCTOS: '/productos',
    CONTACTO: '/contacto',
    TIENDA: '/tienda',
    CARRITO: '/carrito',
    CONTACTO: '/contacto',
    CATEGORIAS: '/categoria',
    

    PRODUCTOS_ROUTE: '/productos/:id',        
    PRODUCTO_DETALLE: (id) => `/productos/${id}`,
    CATEGORIA_DETALLE: (nombre) => `/categoria/${nombre}`
};
