import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext();

export function useCarrito() {
    return useContext(CarritoContext);
}

export function CarritoProvider({ children }) {
    const [carrito, setCarrito] = useState([]);

    const agregarAlCarrito = (producto) => {
        const productoExistente = carrito.find(item => item.id === producto.id);
        if (productoExistente) {
            setCarrito(carrito.map(item => 
                item.id === producto.id 
                    ? { ...item, cantidad: item.cantidad + 1 } 
                    : item
            ));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };

    const vaciarCarrito = () => setCarrito([]);

    const eliminarDelCarrito = (id) => {
        setCarrito(carrito.filter(item => item.id !== id));
    };

    const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
    const precioTotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

    return (
        <CarritoContext.Provider 
            value={{ carrito, agregarAlCarrito, vaciarCarrito, eliminarDelCarrito, cantidadTotal, precioTotal }}
        >
            {children}
        </CarritoContext.Provider>
    );
}