import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import {productDB} from '../data/BaseDeDatos'; 
import { useCarrito } from '../context/CarritoContext';


function DetalleProducto() {
    const { id } = useParams(); 
    const { agregarAlCarrito } = useCarrito();
    const [productos, setProductos] = useState([null]);

    useEffect(() => {
        const encontrado = productDB.getById(id);
        setProducto(encontrado);
    }, [id]);


if (!producto) {
        return (
            <main className="container my-5 text-center">
                <h2>Producto no encontrado 😢</h2>
                <Link to="/productos" className="btn btn-warning mt-3">Volver a productos</Link>
            </main>
        );
    }

    
    
    return (
        <main className="container my-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
                    <li className="breadcrumb-item active">{producto.producto}</li>
                </ol>
            </nav>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <img 
                        src={producto.foto} 
                        alt={producto.producto} 
                        className="img-fluid rounded shadow-sm" 
                        style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
                    />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <span className="badge bg-secondary mb-2 align-self-start">
                        {producto.categoria}
                    </span>
                    <h1 className="fw-bold">{producto.producto}</h1>
                    <p className="text-muted fs-5 mb-1">Marca: {producto.marca}</p>
                    <p className="text-muted">Código: {producto.codigo}</p>
                    
                    <h2 className="text-success fw-bold my-3">
                        ${producto.precio.toLocaleString('es-CL')}
                    </h2>
                    
                    <p className="lead">{producto.descripcion}</p>
                    
                    <p className="mb-4">
                        <strong>Stock disponible:</strong> {producto.stock} unidades
                    </p>

                    <div className="mt-auto">
                        <button 
                            className="btn btn-warning btn-lg w-100 mb-3"
                            onClick={() => agregarAlCarrito(producto)}
                        >
                            🛒 Agregar al carrito
                        </button>
                        <Link to="/productos" className="btn btn-outline-dark w-100">
                            Seguir comprando
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default DetalleProducto; 