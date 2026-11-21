// src/pages/MisCompras.jsx
// Historial de compras del usuario con sesión iniciada (GET /api/v1/boleta/mis-boletas).
import { Link } from 'react-router';
import EstadoCarga from '../components/EstadoCarga';
import { useApi } from '../hooks/useApi';
import { misBoletas } from '../services/boletaService';
import { formatoFecha, formatoPrecio } from '../services/formato';

function MisCompras() {
    const { datos: boletas, cargando, error, recargar } = useApi(misBoletas);

    return (
        <main className="container my-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active">Mis compras</li>
                </ol>
            </nav>

            <h1 className="mb-4">Mis compras</h1>

            <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} texto="Cargando tus compras..." />

            {!cargando && !error && boletas?.length === 0 && (
                <div className="alert alert-info">
                    Todavía no tienes compras. <Link to="/productos">Ir a la tienda</Link>
                </div>
            )}

            {!cargando && !error && boletas?.map((boleta) => (
                <div className="card shadow-sm mb-3" key={boleta.id}>
                    <div className="card-header d-flex justify-content-between flex-wrap">
                        <span><strong>Boleta N° {boleta.id}</strong> · {formatoFecha(boleta.fechaEmision)}</span>
                        <span className="fw-bold">{formatoPrecio(boleta.total)}</span>
                    </div>
                    <ul className="list-group list-group-flush">
                        {boleta.detalles.map((d) => (
                            <li className="list-group-item d-flex justify-content-between" key={d.id}>
                                <span>{d.producto.producto} × {d.cantidad}</span>
                                <span>{formatoPrecio(d.subtotal)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </main>
    );
}

export default MisCompras;
