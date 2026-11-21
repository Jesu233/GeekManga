// Conversión y validación entre el formulario de producto y el JSON del backend
import { IMAGEN_POR_DEFECTO } from './formato';

// Imágenes disponibles en /public/images
export const IMAGENES_DISPONIBLES = [
    '/images/onepiece.jpg',
    '/images/naruto.jpg',
    '/images/spiderman.jpg',
    '/images/berserk.jpg',
    '/images/manga.jpeg',
    '/images/vol1-223.jpeg',
    '/images/gogos.jpg',
];

export const PRODUCTO_VACIO = {
    codigo: '',
    producto: '',
    precio: '',
    marca: '',
    stock: '',
    stockCritico: '',
    categoriaId: '',
    oferta: false,
    precioOferta: '',
    descripcion: '',
    urlFoto: IMAGEN_POR_DEFECTO,
};

/** Producto del backend -> valores del formulario */
export const productoAFormulario = (p) => ({
    codigo: p.codigo ?? '',
    producto: p.producto ?? '',
    precio: p.precio ?? '',
    marca: p.marca ?? '',
    stock: p.stock ?? '',
    stockCritico: p.stockCritico ?? '',
    categoriaId: p.categoria?.categoriaId ?? '',
    oferta: Boolean(p.oferta),
    precioOferta: p.precioOferta ?? '',
    descripcion: p.descripcion ?? '',
    urlFoto: p.urlFoto || IMAGEN_POR_DEFECTO,
});

/** Valores del formulario -> JSON que espera el backend */
export const formularioAProducto = (f) => ({
    codigo: f.codigo.trim(),
    producto: f.producto.trim(),
    precio: Number(f.precio),
    marca: f.marca.trim(),
    stock: Number(f.stock),
    stockCritico: Number(f.stockCritico),
    oferta: f.oferta,
    precioOferta: f.oferta && f.precioOferta !== '' ? Number(f.precioOferta) : null,
    descripcion: f.descripcion.trim() || null,
    urlFoto: f.urlFoto.trim() || null,
    categoria: { categoriaId: Number(f.categoriaId) },
});

/** Mismas reglas que valida el backend, para avisar antes de enviar */
export const validarProducto = (f) => {
    const e = {};
    if (!f.codigo.trim()) e.codigo = 'El código es obligatorio';
    if (f.producto.trim().length < 2) e.producto = 'El nombre debe tener al menos 2 caracteres';
    if (f.producto.trim().length > 50) e.producto = 'El nombre no puede superar 50 caracteres';
    if (!f.marca.trim()) e.marca = 'La marca es obligatoria';
    if (f.precio === '' || Number(f.precio) < 0) e.precio = 'Ingresa un precio válido';
    if (f.stock === '' || Number(f.stock) < 0) e.stock = 'Ingresa un stock válido';
    if (f.stockCritico === '' || Number(f.stockCritico) < 0) e.stockCritico = 'Ingresa un stock crítico válido';
    if (!f.categoriaId) e.categoria = 'Selecciona una categoría';
    if (f.descripcion.length > 300) e.descripcion = 'Máximo 300 caracteres';
    if (f.urlFoto.length > 255) e.urlFoto = 'La ruta de la imagen es demasiado larga';
    if (f.oferta) {
        if (f.precioOferta === '') e.precioOferta = 'Ingresa el precio de oferta';
        else if (Number(f.precioOferta) >= Number(f.precio)) e.precioOferta = 'Debe ser menor al precio normal';
    }
    return e;
};
