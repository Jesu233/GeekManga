import { Link } from 'react-router';
import TarjetaProducto from '../components/TarjetaProducto';
import EstadoCarga from '../components/EstadoCarga';
import { useApi } from '../hooks/useApi';
import { listarProductos } from '../services/productoService';

function Productos() {
    // GET /api/v1/producto (público)
    const { datos: productos, cargando, error, recargar } = useApi(listarProductos);

    return (
        <main className="container my-4">
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Productos
                    </li>
                </ol>
            </nav>

            <section className="container my-5">
                <h1 className="text-center mb-4">Productos</h1>

                <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} texto="Cargando productos..." />

                {!cargando && !error && productos?.length === 0 && (
                    <div className="alert alert-info text-center">Todavía no hay productos en la tienda.</div>
                )}

                {!cargando && !error && productos?.length > 0 && (
                    <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                        {productos.map((prod) => (
                            <TarjetaProducto key={prod.id} producto={prod} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Productos;
