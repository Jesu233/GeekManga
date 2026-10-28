// src/pages/PagoExitoso.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

function PagoExitoso() {
    const [orden, setOrden] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('geekmanga_ultima_orden');
        if (data) setOrden(JSON.parse(data));
    }, []);

    return (
        <main className="container my-5 text-center">
            <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
                <div className="card-body p-5">
                    <div className="display-1 text-success mb-3">✅</div>
                    <h1 className="text-success mb-3">¡Pago realizado con éxito!</h1>
                    <p className="lead">Gracias por tu compra.</p>

                    {orden && (
                        <div className="alert alert-light border text-start mt-4">
                            <p className="mb-1"><strong>N° de orden:</strong> {orden.id}</p>
                            <p className="mb-1"><strong>Cliente:</strong> {orden.cliente.nombre} {orden.cliente.apellido}</p>
                            <p className="mb-1"><strong>Correo:</strong> {orden.cliente.correo}</p>
                            <p className="mb-1"><strong>Dirección:</strong> {orden.cliente.calle}, {orden.cliente.comuna}</p>
                            <p className="mb-0 fs-5"><strong>Total pagado:</strong> ${orden.total.toLocaleString('es-CL')}</p>
                        </div>
                    )}

                    <div className="mt-4">
                        <Link to="/productos" className="btn btn-warning btn-lg">
                            Seguir comprando
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default PagoExitoso;