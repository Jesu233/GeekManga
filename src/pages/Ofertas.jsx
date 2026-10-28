
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { productDB } from '../data/BaseDeDatos';
import { PATHS } from '../routes/paths';

function Ofertas() {
    const [ofertas, setOfertas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const todos = productDB.getAll();
    
        const enOferta = todos.filter(p => p.oferta === true);
        setOfertas(enOferta);
        setCargando(false);
    }, []);

    if (cargando) {
        return (
            <main className="container my-5 text-center">
                <p>Cargando ofertas...</p>
            </main>
        );
    }

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

            {ofertas.length === 0 ? (
                <div className="alert alert-info text-center">
                    No hay ofertas disponibles en este momento.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                    {ofertas.map((prod) => (
                        <div className="col" key={prod.id}>
                            <div className="card h-100 shadow-sm position-relative">
                                {/* Badge de descuento */}
                                <span 
                                    className="badge bg-danger position-absolute top-0 end-0 m-2"
                                    style={{ zIndex: 1 }}
                                >
                                    OFERTA
                                </span>

                                <img
                                    src={prod.foto}
                                    className="card-img-top"
                                    alt={prod.producto}
                                    style={{ objectFit: 'cover', height: '250px' }}
                                />

                                <div className="card-body d-flex flex-column">
                                    <span className="badge bg-secondary mb-2 align-self-start">
                                        {prod.categoria}
                                    </span>
                                    <h5 className="card-title">{prod.producto}</h5>
                                    <p className="card-text text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                                        {prod.marca}
                                    </p>

                                    {/* Precio original tachado + precio oferta */}
                                    <div className="mb-3">
                                        <small className="text-muted text-decoration-line-through d-block">
                                            ${prod.precio.toLocaleString('es-CL')}
                                        </small>
                                        <h6 className="fw-bold text-danger mb-0">
                                            ${(prod.precioOferta ?? prod.precio).toLocaleString('es-CL')}
                                        </h6>
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            to={PATHS.PRODUCTO_DETALLE(prod.id)}
                                            className="btn btn-warning w-100"
                                        >
                                            Ver oferta
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Ofertas;