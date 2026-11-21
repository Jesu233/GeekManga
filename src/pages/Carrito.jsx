import { Link } from 'react-router';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { formatoPrecio, imagenProducto } from '../services/formato';
import { PATHS } from '../routes/paths';

function Carrito() {
    const { carrito, precioTotal, agregarAlCarrito, disminuirCantidad, quitarDelCarrito, vaciarCarrito } = useCarrito();
    const { usuario } = useAuth();

    if (carrito.length === 0) {
        return (
            <main className="container my-5 text-center">
                <h2>Tu carrito está vacío 😢</h2>
                <Link to="/productos" className="btn btn-warning mt-3">Ir a la tienda</Link>
            </main>
        );
    }

    return (
        <main className="container my-4">
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active">Carrito</li>
                </ol>
            </nav>

            <section className="carrito-shell">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                    <h1 className="mb-0">Mi carrito</h1>
                </div>

                <div className="table-responsive bg-white p-3 rounded shadow-sm">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            <img src={imagenProducto(item)} alt={item.producto} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                                            <div>
                                                <h6 className="mb-0">{item.producto}</h6>
                                                <small className="text-muted">{item.marca}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {item.precioNormal > item.precio && (
                                            <small className="text-muted text-decoration-line-through d-block">
                                                {formatoPrecio(item.precioNormal)}
                                            </small>
                                        )}
                                        {formatoPrecio(item.precio)}
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <button className="btn btn-sm btn-outline-dark" aria-label={`Quitar una unidad de ${item.producto}`} onClick={() => disminuirCantidad(item.id)}>−</button>
                                            <span>{item.cantidad}</span>
                                            <button
                                                className="btn btn-sm btn-outline-dark"
                                                aria-label={`Agregar una unidad de ${item.producto}`}
                                                onClick={() => agregarAlCarrito(item)}
                                                disabled={item.stock != null && item.cantidad >= item.stock}
                                            >+</button>
                                        </div>
                                    </td>
                                    <td className="fw-bold">{formatoPrecio(item.precio * item.cantidad)}</td>
                                    <td>
                                        <button className="btn btn-sm btn-danger" onClick={() => quitarDelCarrito(item.id)}>❌</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-end mt-4 fs-4 fw-bold">
                    <span className="me-3">Total:</span>
                    <span>{formatoPrecio(precioTotal)}</span>
                </div>

                {!usuario && (
                    <p className="text-end text-muted mb-0">Para comprar te pediremos iniciar sesión.</p>
                )}

                <div className="mt-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <Link to="/productos" className="btn btn-outline-dark btn-lg">Seguir comprando</Link>
                    <Link to={PATHS.PAGO} className="btn btn-warning btn-lg">Comprar</Link>
                    <button className="btn btn-outline-dark" onClick={vaciarCarrito}>Vaciar carrito</button>
                </div>
            </section>
        </main>
    );
}

export default Carrito;
