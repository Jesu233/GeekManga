// src/context/CarritoContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { precioVigente } from '../services/formato';

const CarritoContext = createContext();

const STORAGE_KEY = 'geekmanga_carrito';

// Los productos de la versión antigua (localStorage) tenían ids como "demo-1" o "new-123".
// Ya no existen en el backend, así que se descartan al cargar el carrito.
const esProductoAntiguo = (item) => typeof item.id === 'string' && /^(demo|new)-/.test(item.id);

const leerCarritoGuardado = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        const items = data ? JSON.parse(data) : [];
        return Array.isArray(items) ? items.filter((item) => !esProductoAntiguo(item)) : [];
    } catch (error) {
        console.error('Error leyendo carrito:', error);
        return [];
    }
};

/**
 * Del producto que entrega la API se guarda solo lo necesario para mostrar el carrito.
 * "precio" es el precio vigente (oferta si corresponde). Es solo referencial:
 * al pagar, el backend vuelve a calcular el total con los precios reales.
 */
const crearLinea = (producto) => ({
    id: producto.id,
    producto: producto.producto,
    marca: producto.marca,
    urlFoto: producto.urlFoto,
    precio: precioVigente(producto),
    precioNormal: producto.precio,
    stock: producto.stock,
    cantidad: 1,
});

export function CarritoProvider({ children }) {
    // Inicializamos con lo que haya en el storage
    const [carrito, setCarrito] = useState(leerCarritoGuardado);

    // Cada vez que cambie el carrito, lo guardamos en localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    }, [carrito]);

    // Agregar producto (si ya existe, suma cantidad sin pasar del stock disponible)
    const agregarAlCarrito = (producto) => {
        setCarrito(prev => {
            const existente = prev.find(item => item.id === producto.id);
            if (existente) {
                const limite = existente.stock ?? Infinity;
                if (existente.cantidad >= limite) return prev;
                return prev.map(item =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            if (producto.stock === 0) return prev;
            return [...prev, crearLinea(producto)];
        });
    };

    // Restar una unidad (si llega a 0 se quita)
    const disminuirCantidad = (id) => {
        setCarrito(prev => prev
            .map(item => (item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item))
            .filter(item => item.cantidad > 0));
    };

    // Quitar producto
    const quitarDelCarrito = (id) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
    };

    // Vaciar
    const vaciarCarrito = () => {
        setCarrito([]);
    };

    // Cantidad total (para el badge del header)
    const cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    // Precio total referencial (el definitivo lo calcula el backend al crear la boleta)
    const precioTotal = carrito.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
    );

    return (
        <CarritoContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                disminuirCantidad,
                quitarDelCarrito,
                vaciarCarrito,
                cantidadTotal,
                precioTotal,
            }}
        >
            {children}
        </CarritoContext.Provider>
    );
}

export function useCarrito() {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error('useCarrito debe usarse dentro de CarritoProvider');
    }
    return context;
}
