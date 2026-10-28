// src/pages/PagoError.jsx
import { Link, useNavigate } from 'react-router';
import { PATHS } from '../routes/paths';

function PagoError() {
    const navigate = useNavigate();

    return (
        <main className="container my-5 text-center">
            <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
                <div className="card-body p-5">
                    <div className="display-1 text-danger mb-3">❌</div>
                    <h1 className="text-danger mb-3">No se pudo realizar el pago</h1>
                    <p className="lead">Hubo un problema al procesar tu pago.</p>
                    <p className="text-muted">
                        Por favor, verifica tus datos e inténtalo nuevamente.
                    </p>

                    <div className="d-flex gap-2 justify-content-center mt-4">
                        <button
                            className="btn btn-warning btn-lg"
                            onClick={() => navigate(PATHS.PAGO)}
                        >
                            Volver a realizar el pago
                        </button>
                        <Link to="/carrito" className="btn btn-outline-dark btn-lg">
                            Ver carrito
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default PagoError;