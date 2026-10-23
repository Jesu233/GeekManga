import { useParams, Link } from 'react-router';
import { productosDemo } from '../data/productosDemo';
import { useCarrito } from '../context/CarritoContext';

function DetalleProducto() {
    // 1. Obtenemos el ID de la URL (ej: /productos/demo-1)
    const { id } = useParams();
    
    // 2. Traemos la función para agregar del carrito
    const { agregarAlCarrito } = useCarrito();

    // 3. Buscamos el producto en nuestro arreglo
    const producto = productosDemo.find(p => p.id === id);

    // Si el producto no existe, mostramos un mensaje
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
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{producto.producto}</li>
                </ol>
            </nav>

            <div className="row">
                {/* Imagen del producto */}
                <div className="col-md-6 mb-4">
                    <img 
                        src={producto.foto} 
                        alt={producto.producto} 
                        className="img-fluid rounded shadow-sm" 
                        style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
                    />
                </div>

                {/* Información del producto */}
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