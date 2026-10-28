// src/pages/CategoriaDetalle.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { productDB } from '../data/BaseDeDatos';
import TarjetaProducto from '../components/TarjetaProducto';
import { PATHS } from '../routes/paths';

function CategoriaDetalle() {
    const { nombre } = useParams();
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const todos = productDB.getAll();
        const filtrados = todos.filter(p => p.categoria === nombre);
        setProductos(filtrados);
        setCargando(false);
    }, [nombre]);

    if (cargando) {
        return (
            <main className="container my-5 text-center">
                <p>Cargando...</p>
            </main>
        );
    }

    return (
        <main className="container my-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/categorias">Categorías</Link></li>
                    <li className="breadcrumb-item active">{nombre}</li>
                </ol>
            </nav>

            <h1 className="mb-4">Categoría: {nombre}</h1>

            {productos.length === 0 ? (
                <div className="alert alert-info">
                    No hay productos en esta categoría todavía.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                    {productos.map((prod) => (
                        <TarjetaProducto key={prod.id} producto={prod} />
                    ))}
                </div>
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