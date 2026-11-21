import { Link } from 'react-router';
import { useCarrito } from '../context/CarritoContext';
import { formatoPrecio, imagenProducto, nombreCategoria, precioVigente } from '../services/formato';
import { PATHS } from '../routes/paths';

function TarjetaProducto({ producto }) {
    const { agregarAlCarrito } = useCarrito();
    const agotado = producto.stock === 0;
    const enOferta = producto.oferta && producto.precioOferta != null;

    return (
        <div className="col">
            <div className="card h-100 shadow-sm position-relative">
                {enOferta && (
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2" style={{ zIndex: 1 }}>
                        OFERTA
                    </span>
                )}
                <img
                    src={imagenProducto(producto)}
                    className="card-img-top"
                    alt={producto.producto}
                    style={{ objectFit: 'cover', height: '250px' }}
                />
                <div className="card-body d-flex flex-column">
                    <span className="badge bg-secondary mb-2 align-self-start">
                        {nombreCategoria(producto)}
                    </span>

                    {agotado && (
                        <span className="badge bg-danger mb-2 align-self-start">
                            Agotado
                        </span>
                    )}

                    <h5 className="card-title">{producto.producto}</h5>
                    <p className="card-text text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        {producto.marca}
                    </p>

                    <div className="mb-3">
                        {enOferta && (
                            <small className="text-muted text-decoration-line-through d-block">
                                {formatoPrecio(producto.precio)}
                            </small>
                        )}
                        <h6 className={`fw-bold mb-0 ${enOferta ? 'text-danger' : ''}`}>
                            {formatoPrecio(precioVigente(producto))}
                        </h6>
                    </div>

                    <div className="mt-auto d-flex gap-2">
                        <Link to={PATHS.PRODUCTO_DETALLE(producto.id)} className="btn btn-outline-dark w-100">
                            Ver más
                        </Link>
                        <button
                            className="btn btn-warning w-100"
                            onClick={() => agregarAlCarrito(producto)}
                            disabled={agotado}
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
