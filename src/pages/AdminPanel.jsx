import { Link } from 'react-router';
import EncabezadoAdmin from '../components/EncabezadoAdmin';
import EstadoCarga from '../components/EstadoCarga';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { listarProductos } from '../services/productoService';
import { listarUsuarios } from '../services/usuarioService';
import { listarBoletas } from '../services/boletaService';
import { formatoFecha, formatoPrecio } from '../services/formato';
import { ROLES } from '../services/roles';
import { PATHS } from '../routes/paths';

// Resumen del panel. Los usuarios solo se consultan si es ADMIN (el VENDEDOR recibiría 403).
const cargarResumen = (esAdmin) => Promise.all([
    listarProductos(),
    listarBoletas(),
    esAdmin ? listarUsuarios() : Promise.resolve(null),
]).then(([productos, boletas, usuarios]) => ({ productos, boletas, usuarios }));

function Tarjeta({ titulo, texto, enlace, boton }) {
    return (
        <div className="col-md-3">
            <div className="card bg-dark text-light border-warning h-100 p-3">
                <h5 className="text-warning mb-3">{titulo}</h5>
                <p className="text-secondary small flex-grow-1">{texto}</p>
                <Link to={enlace} className="btn btn-warning w-100 mt-auto">{boton}</Link>
            </div>
        </div>
    );
}

function AdminPanel() {
    const { usuario, tieneRol } = useAuth();
    const esAdmin = tieneRol(ROLES.ADMIN);

    const { datos, cargando, error, recargar } = useApi(() => cargarResumen(esAdmin), [esAdmin]);

    const stockCritico = datos?.productos.filter((p) => p.stock <= p.stockCritico) ?? [];
    const totalVentas = datos?.boletas.reduce((s, b) => s + b.total, 0) ?? 0;

    return (
        <>
            <EncabezadoAdmin />

            <main className="container-fluid bg-dark text-light py-4">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-1">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to={PATHS.ADMIN} className="text-warning">Home Admin</Link></li>
                        </ol>
                    </nav>

                    <h1 className="text-light mb-1">Panel de administración</h1>
                    <p className="text-secondary mb-4">Hola {usuario?.nombre}, estás como {esAdmin ? 'Administrador' : 'Vendedor'}.</p>

                    {/* FILA 1: accesos según rol */}
                    <div className="row g-4 mb-4">
                        {esAdmin && (
                            <Tarjeta titulo="Productos" texto="Agregar y administrar productos y categorías." enlace={PATHS.ADMIN_AGREGAR_PRODUCTO} boton="Ir a productos" />
                        )}
                        <Tarjeta titulo="Listado" texto="Revisa los productos registrados y su stock." enlace={PATHS.ADMIN_LISTADO} boton="Ver listado" />
                        <Tarjeta titulo="Boletas" texto="Revisa todas las ventas de la tienda." enlace={PATHS.ADMIN_BOLETAS} boton="Ver boletas" />
                        {esAdmin && (
                            <Tarjeta titulo="Usuarios" texto="Consulta y administra usuarios y roles." enlace={PATHS.ADMIN_USUARIOS} boton="Administrar usuarios" />
                        )}
                        {!esAdmin && (
                            <Tarjeta titulo="Tienda" texto="Visualiza la tienda como la ven los clientes." enlace={PATHS.HOME} boton="Ir a inicio" />
                        )}
                    </div>

                    <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} texto="Cargando resumen..." />

                    {!cargando && datos && (
                        <div className="row g-4">
                            {/* Resumen rápido con datos reales del backend */}
                            <div className="col-lg-5">
                                <div className="card bg-dark text-light border-secondary h-100 p-4">
                                    <h4 className="text-warning mb-4">Resumen rápido</h4>
                                    <ul className="list-group list-group-flush bg-dark">
                                        <li className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center py-3">
                                            <span>Productos en catálogo:</span>
                                            <span className="badge bg-secondary fs-6">{datos.productos.length}</span>
                                        </li>
                                        <li className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center py-3">
                                            <span>Productos con stock crítico:</span>
                                            <span className={`badge fs-6 ${stockCritico.length ? 'bg-warning text-dark' : 'bg-secondary'}`}>{stockCritico.length}</span>
                                        </li>
                                        {esAdmin && (
                                            <li className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center py-3">
                                                <span>Usuarios registrados:</span>
                                                <span className="badge bg-secondary fs-6">{datos.usuarios.length}</span>
                                            </li>
                                        )}
                                        <li className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center py-3">
                                            <span>Boletas emitidas:</span>
                                            <span className="badge bg-secondary fs-6">{datos.boletas.length}</span>
                                        </li>
                                        <li className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center py-3">
                                            <span>Total vendido:</span>
                                            <span className="badge bg-success fs-6">{formatoPrecio(totalVentas)}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Últimas ventas */}
                            <div className="col-lg-7">
                                <div className="card bg-dark text-light border-secondary h-100 p-4">
                                    <h4 className="text-warning mb-4">Últimas ventas</h4>
                                    {datos.boletas.length === 0 ? (
                                        <p className="text-secondary">Todavía no hay ventas.</p>
                                    ) : (
                                        <table className="table table-dark table-sm align-middle mb-3">
                                            <thead>
                                                <tr><th>N°</th><th>Fecha</th><th>Cliente</th><th className="text-end">Total</th></tr>
                                            </thead>
                                            <tbody>
                                                {datos.boletas.slice(0, 5).map((b) => (
                                                    <tr key={b.id}>
                                                        <td>{b.id}</td>
                                                        <td>{formatoFecha(b.fechaEmision)}</td>
                                                        <td>{b.usuario?.nombre}</td>
                                                        <td className="text-end">{formatoPrecio(b.total)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                    <Link to={PATHS.ADMIN_BOLETAS} className="btn btn-outline-warning mt-auto">Ver todas las boletas</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default AdminPanel;
