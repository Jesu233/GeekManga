// src/context/CarritoContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

const STORAGE_KEY = 'geekmanga_carrito';

// Función auxiliar para leer del storage
const leerCarritoGuardado = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error leyendo carrito:', error);
        return [];
    }
};

export function CarritoProvider({ children }) {
    // Inicializamos con lo que haya en el storage
    const [carrito, setCarrito] = useState(leerCarritoGuardado);

    // Cada vez que cambie el carrito, lo guardamos en localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    }, [carrito]);

    // Agregar producto (si ya existe, suma cantidad)
    const agregarAlCarrito = (producto) => {
        setCarrito(prev => {
            const existente = prev.find(item => item.id === producto.id);
            if (existente) {
                return prev.map(item =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
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

    // Precio total
    const precioTotal = carrito.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
    );

    return (
        <CarritoContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
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