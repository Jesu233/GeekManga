// src/pages/PagoExitoso.jsx
import { Link, useLocation } from 'react-router';
import { formatoFecha, formatoPrecio } from '../services/formato';
import { PATHS } from '../routes/paths';

function PagoExitoso() {
    // La boleta llega desde Pago.jsx (es la respuesta real del backend al POST /boleta)
    const { state } = useLocation();
    const boleta = state?.boleta;
    const envio = state?.envio;

    return (
        <main className="container my-5 text-center">
            <div className="card shadow-sm mx-auto" style={{ maxWidth: '650px' }}>
                <div className="card-body p-5">
                    <div className="display-1 text-success mb-3">✅</div>
                    <h1 className="text-success mb-3">¡Pago realizado con éxito!</h1>
                    <p className="lead">Gracias por tu compra.</p>

                    {boleta && (
                        <div className="alert alert-light border text-start mt-4">
                            <p className="mb-1"><strong>N° de boleta:</strong> {boleta.id}</p>
                            <p className="mb-1"><strong>Fecha:</strong> {formatoFecha(boleta.fechaEmision)}</p>
                            {envio && (
                                <>
                                    <p className="mb-1"><strong>Cliente:</strong> {envio.nombre} {envio.apellido}</p>
                                    <p className="mb-1"><strong>Dirección:</strong> {envio.calle}, {envio.comuna}</p>
                                </>
                            )}

                            <table className="table table-sm mt-3 mb-2">
                                <thead>
                                    <tr><th>Producto</th><th>Cant.</th><th className="text-end">Subtotal</th></tr>
                                </thead>
                                <tbody>
                                    {boleta.detalles.map((d) => (
                                        <tr key={d.id}>
                                            <td>{d.producto.producto}</td>
                                            <td>{d.cantidad} x {formatoPrecio(d.precioUnitario)}</td>
                                            <td className="text-end">{formatoPrecio(d.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="mb-0 fs-5 text-end"><strong>Total pagado:</strong> {formatoPrecio(boleta.total)}</p>
                        </div>
                    )}

                    <div className="mt-4 d-flex gap-2 justify-content-center">
                        <Link to="/productos" className="btn btn-warning btn-lg">
                            Seguir comprando
                        </Link>
                        <Link to={PATHS.MIS_COMPRAS} className="btn btn-outline-dark btn-lg">
                            Ver mis compras
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default PagoExitoso;
