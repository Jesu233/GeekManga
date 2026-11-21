import { useParams, Link } from 'react-router';
import { useCarrito } from '../context/CarritoContext';
import EstadoCarga from '../components/EstadoCarga';
import { useApi } from '../hooks/useApi';
import { buscarProducto } from '../services/productoService';
import { formatoPrecio, imagenProducto, nombreCategoria, precioVigente } from '../services/formato';

function DetalleProducto() {
    const { id } = useParams();
    const { carrito, agregarAlCarrito } = useCarrito();

    // GET /api/v1/producto/buscar/{id} (público)
    const { datos: producto, cargando, error, codigoError, recargar } =
        useApi(() => buscarProducto(id), [id]);

    if (cargando) {
        return (
            <main className="container my-5">
                <EstadoCarga cargando texto="Cargando producto..." />
            </main>
        );
    }

    // Si no existe el producto (404) o el id no es válido (400)
    if (codigoError === 404 || codigoError === 400) {
        return (
            <main className="container my-5 text-center">
                <h2>Producto no encontrado 😢</h2>
                <Link to="/productos" className="btn btn-warning mt-3">
                    Volver a productos
                </Link>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container my-5">
                <EstadoCarga error={error} onReintentar={recargar} />
            </main>
        );
    }

    const enOferta = producto.oferta && producto.precioOferta != null;
    const enCarrito = carrito.find((item) => item.id === producto.id)?.cantidad ?? 0;
    const sinStockDisponible = producto.stock === 0 || enCarrito >= producto.stock;

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
                        src={imagenProducto(producto)}
                        alt={producto.producto}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
                    />
                </div>

                <div className="col-md-6 d-flex flex-column">
                    <span className="badge bg-secondary mb-2 align-self-start">
                        {nombreCategoria(producto)}
                    </span>
                    <h1 className="fw-bold">{producto.producto}</h1>
                    <p className="text-muted fs-5 mb-1">Marca: {producto.marca}</p>
                    <p className="text-muted">Código: {producto.codigo}</p>

                    <div className="my-3">
                        {enOferta && (
                            <span className="text-muted text-decoration-line-through fs-5 me-3">
                                {formatoPrecio(producto.precio)}
                            </span>
                        )}
                        <span className={`fw-bold fs-2 ${enOferta ? 'text-danger' : 'text-success'}`}>
                            {formatoPrecio(precioVigente(producto))}
                        </span>
                        {enOferta && <span className="badge bg-danger ms-2">OFERTA</span>}
                    </div>

                    <p className="lead">{producto.descripcion}</p>

                    <p className="mb-4">
                        <strong>Stock disponible:</strong> {producto.stock} unidades
                        {producto.stock > 0 && producto.stock <= producto.stockCritico && (
                            <span className="badge bg-warning text-dark ms-2">¡Últimas unidades!</span>
                        )}
                    </p>

                    <div className="mt-auto">
                        <button
                            className="btn btn-warning btn-lg w-100 mb-3"
                            onClick={() => agregarAlCarrito(producto)}
                            disabled={sinStockDisponible}
                        >
                            {producto.stock === 0 ? 'Agotado' : '🛒 Agregar al carrito'}
                        </button>
                        {enCarrito > 0 && (
                            <p className="text-muted small">Tienes {enCarrito} en tu carrito.</p>
                        )}
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
