import { Link } from 'react-router';
import { useCarrito } from '../context/CarritoContext'; // 👈 Importamos el hook

function TarjetaProducto({ producto }) {
    const { agregarAlCarrito } = useCarrito(); // 👈 Traemos la función

    return (
        <div className="col">
            <div className="card h-100 shadow-sm">
                <img 
                    src={producto.foto} 
                    className="card-img-top" 
                    alt={producto.producto} 
                    style={{ objectFit: 'cover', height: '250px' }}
                />
                <div className="card-body d-flex flex-column">
                    <span className="badge bg-secondary mb-2 align-self-start">
                        {producto.categoria}
                    </span>
                    <h5 className="card-title">{producto.producto}</h5>
                    <p className="card-text text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        {producto.marca}
                    </p>
                    {producto.stock === 0 && (
                        <span className="badge bg-danger mb-2 align-self-start">Agotado</span>
                    )}
                    <h6 className="fw-bold mb-3">
                        ${producto.precio.toLocaleString('es-CL')}
                    </h6>
                    
                    <div className="mt-auto d-flex gap-2">
                        <Link to={`/productos/${producto.id}`} className="btn btn-outline-dark w-100">
                            Ver más
                        </Link>
                        {/* 👇 Aquí ejecutamos la función del carrito */}
                        <button 
                            className="btn btn-warning w-100"
                            onClick={() => agregarAlCarrito(producto)}
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TarjetaProducto;