import { Link } from 'react-router';
import { useCarrito } from '../context/CarritoContext';
import { PATHS } from '../routes/paths';

function Carrito() {
    // Traemos todo lo necesario del contexto
    const { carrito, precioTotal, agregarAlCarrito, quitarDelCarrito, vaciarCarrito } = useCarrito();

    // Función simple para vaciar (debes agregarla a tu contexto luego)
    // const { vaciarCarrito } = useCarrito(); 

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
                    {/* El botón de vaciar lo podemos implementar luego */}
                    <button className="btn btn-outline-dark" type="button">Vaciar carrito</button>
                </div>

                {/* Tabla del carrito en React */}
                <div className="table-responsive bg-white p-3 rounded shadow-sm">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            <img src={item.foto} alt={item.producto} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                                            <div>
                                                <h6 className="mb-0">{item.producto}</h6>
                                                <small className="text-muted">{item.marca}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>${item.precio.toLocaleString('es-CL')}</td>
                                    <td>{item.cantidad}</td>
                                    <td className="fw-bold">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                                    <td>
                                        <button className="btn btn-sm btn-danger" onClick={() => quitarDelCarrito(item.id)}>❌</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-end mt-4 fs-4 fw-bold">
                    <span className="me-3">Total:</span>
                    <span>${precioTotal.toLocaleString('es-CL')}</span>
                </div>

                <div className="mt-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <Link to="/productos" className="btn btn-outline-dark btn-lg">Seguir comprando</Link>
                    <Link to= {PATHS.PAGO} className="btn btn-warning btn-lg">Comprar</Link>
                    <button className="btn btn-outline-dark" onClick={vaciarCarrito}>Vaciar carrito</button>
                </div>
            </section>
        </main>
    );
}

export default Carrito;