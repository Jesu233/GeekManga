// Utilidades para mostrar los datos que entrega el backend

export const IMAGEN_POR_DEFECTO = '/images/manga.jpeg';

/** 15990 -> "$15.990" */
export const formatoPrecio = (valor) => `$${Number(valor ?? 0).toLocaleString('es-CL')}`;

/** Precio que realmente se cobra: el de oferta si está activa (misma regla que el backend). */
export const precioVigente = (producto) =>
    producto?.oferta && producto?.precioOferta != null ? producto.precioOferta : producto?.precio ?? 0;

/** El backend envía la categoría como objeto { categoriaId, nombreCategoria } */
export const nombreCategoria = (producto) => producto?.categoria?.nombreCategoria ?? '';

export const imagenProducto = (producto) => producto?.urlFoto || IMAGEN_POR_DEFECTO;

/** "2026-11-21T16:40:00" -> "21-11-2026 16:40" */
export const formatoFecha = (fechaIso) => {
    if (!fechaIso) return '';
    const fecha = new Date(fechaIso);
    return fecha.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
};
