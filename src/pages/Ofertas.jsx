import { Link } from 'react-router';
import TarjetaProducto from '../components/TarjetaProducto';
import EstadoCarga from '../components/EstadoCarga';
import { useApi } from '../hooks/useApi';
import { listarOfertas } from '../services/productoService';

function Ofertas() {
    // GET /api/v1/producto/ofertas (público): el backend filtra los productos con oferta activa
    const { datos: ofertas, cargando, error, recargar } = useApi(listarOfertas);

    return (
        <main className="container my-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active">Ofertas</li>
                </ol>
            </nav>

            <h1 className="text-center mb-2">🔥 Ofertas</h1>
            <p className="text-center text-muted mb-5">
                Aprovecha estos precios especiales por tiempo limitado.
            </p>

            <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} texto="Cargando ofertas..." />

            {!cargando && !error && (ofertas?.length === 0 ? (
                <div className="alert alert-info text-center">
                    No hay ofertas disponibles en este momento.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                    {ofertas.map((prod) => (
                        <TarjetaProducto key={prod.id} producto={prod} />
                    ))}
                </div>
            ))}
        </main>
    );
}

export default Ofertas;
