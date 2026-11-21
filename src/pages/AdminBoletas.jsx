import { Fragment, useState } from 'react';
import { Link } from 'react-router';
import EncabezadoAdmin from '../components/EncabezadoAdmin';
import EstadoCarga from '../components/EstadoCarga';
import { useApi } from '../hooks/useApi';
import { listarBoletas } from '../services/boletaService';
import { formatoFecha, formatoPrecio } from '../services/formato';
import { PATHS } from '../routes/paths';

// ADMIN y VENDEDOR: todas las ventas de la tienda (GET /api/v1/boleta)
function AdminBoletas() {
    const { datos: boletas, cargando, error, recargar } = useApi(listarBoletas);
    const [abierta, setAbierta] = useState(null);

    return (
        <>
            <EncabezadoAdmin />

            <main className="container-fluid bg-dark text-light py-4">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-3">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to={PATHS.ADMIN} className="text-warning text-decoration-none">Home Admin</Link></li>
                            <li className="breadcrumb-item active text-light">Boletas</li>
                        </ol>
                    </nav>

                    <h1 className="mb-4">Boletas (ventas)</h1>

                    <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} texto="Cargando boletas..." />

                    {!cargando && !error && boletas?.length === 0 && (
                        <div className="alert alert-info">Todavía no hay ventas registradas.</div>
                    )}

                    {!cargando && !error && boletas?.length > 0 && (
                        <div className="table-responsive rounded border border-secondary">
                            <table className="table table-dark table-striped align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>N°</th>
                                        <th>Fecha</th>
                                        <th>Cliente</th>
                                        <th>Productos</th>
                                        <th className="text-end">Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boletas.map((b) => (
                                        <Fragment key={b.id}>
                                            <tr>
                                                <td>{b.id}</td>
                                                <td>{formatoFecha(b.fechaEmision)}</td>
                                                <td>{b.usuario?.nombre} <div className="small text-secondary">{b.usuario?.correo}</div></td>
                                                <td>{b.detalles.reduce((s, d) => s + d.cantidad, 0)}</td>
                                                <td className="text-end fw-bold">{formatoPrecio(b.total)}</td>
                                                <td>
                                                    <button className="btn btn-outline-warning btn-sm" onClick={() => setAbierta(abierta === b.id ? null : b.id)}>
                                                        {abierta === b.id ? 'Ocultar' : 'Ver detalle'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {abierta === b.id && (
                                                <tr>
                                                    <td colSpan={6}>
                                                        <ul className="mb-0">
                                                            {b.detalles.map((d) => (
                                                                <li key={d.id}>
                                                                    {d.producto.producto}: {d.cantidad} × {formatoPrecio(d.precioUnitario)} = {formatoPrecio(d.subtotal)}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default AdminBoletas;
