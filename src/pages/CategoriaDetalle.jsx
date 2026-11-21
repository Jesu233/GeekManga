// src/pages/CategoriaDetalle.jsx
import { useParams, Link } from 'react-router';
import TarjetaProducto from '../components/TarjetaProducto';
import EstadoCarga from '../components/EstadoCarga';
import { useApi } from '../hooks/useApi';
import { buscarCategoria } from '../services/categoriaService';
import { listarPorCategoria } from '../services/productoService';
import { PATHS } from '../routes/paths';

function CategoriaDetalle() {
    const { id } = useParams();

    // GET /categoria/buscar/{id} y GET /producto/categoria/{id} en paralelo
    const { datos, cargando, error, codigoError, recargar } = useApi(
        () => Promise.all([buscarCategoria(id), listarPorCategoria(id)])
            .then(([categoria, productos]) => ({ categoria, productos })),
        [id]
    );

    const noExiste = codigoError === 404 || codigoError === 400;

    return (
        <main className="container my-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to={PATHS.CATEGORIAS}>Categorías</Link></li>
                    {datos && <li className="breadcrumb-item active">{datos.categoria.nombreCategoria}</li>}
                </ol>
            </nav>

            {noExiste ? (
                <div className="alert alert-warning">La categoría no existe.</div>
            ) : (
                <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
            )}

            {!cargando && !error && datos && (
                <>
                    <h1 className="mb-4">Categoría: {datos.categoria.nombreCategoria}</h1>

                    {datos.productos.length === 0 ? (
                        <div className="alert alert-info">
                            No hay productos en esta categoría todavía.
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                            {datos.productos.map((prod) => (
                                <TarjetaProducto key={prod.id} producto={prod} />
                            ))}
                        </div>
                    )}
                </>
            )}

            <div className="mt-4">
                <Link to={PATHS.CATEGORIAS} className="btn btn-outline-dark">
                    ← Volver a categorías
                </Link>
            </div>
        </main>
    );
}

export default CategoriaDetalle;
