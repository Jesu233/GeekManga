// src/pages/Categorias.jsx
import { Link } from 'react-router';
import EstadoCarga from '../components/EstadoCarga';
import { useApi } from '../hooks/useApi';
import { listarCategorias } from '../services/categoriaService';
import { listarProductos } from '../services/productoService';
import { PATHS } from '../routes/paths';

// Se piden categorías y productos en paralelo para mostrar cuántos productos tiene cada una
const cargarDatos = () => Promise.all([listarCategorias(), listarProductos()])
    .then(([categorias, productos]) => ({ categorias, productos }));

function Categorias() {
    const { datos, cargando, error, recargar } = useApi(cargarDatos);

    const contarProductos = (categoriaId) =>
        datos.productos.filter((p) => p.categoria?.categoriaId === categoriaId).length;

    return (
        <main className="container my-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active">Categorías</li>
                </ol>
            </nav>

            <h1 className="text-center mb-5">Categorías</h1>

            <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} texto="Cargando categorías..." />

            {!cargando && !error && (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {datos.categorias.map((cat) => (
                        <div className="col" key={cat.categoriaId}>
                            <div className="card h-100 shadow-sm text-center">
                                <div className="card-body">
                                    <h3 className="card-title">{cat.nombreCategoria}</h3>
                                    <p className="text-muted">
                                        {contarProductos(cat.categoriaId)} producto(s)
                                    </p>
                                    <Link to={PATHS.CATEGORIA_DETALLE(cat.categoriaId)} className="btn btn-warning">
                                        Ver productos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Categorias;
