// src/pages/Categorias.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { categoryDB, productDB } from '../data/BaseDeDatos';


function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        setCategorias(categoryDB.getAll());
        setProductos(productDB.getAll());
    }, []);

    
    const contarProductos = (nombreCategoria) => {
        return productos.filter(p => p.categoria === nombreCategoria).length;
    };

    return (
        <main className="container my-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active">Categorías</li>
                </ol>
            </nav>

            <h1 className="text-center mb-5">Categorías</h1>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {categorias.map((cat) => (
                    <div className="col" key={cat.id}>
                        <div className="card h-100 shadow-sm text-center">
                            <div className="card-body">
                                <h3 className="card-title">{cat.nombre}</h3>
                                <p className="text-muted">
                                    {contarProductos(cat.nombre)} producto(s)
                                </p>
                                <Link 
                                    to={`/categorias/${cat.nombre}`} className="btn btn-warning">
                                        Ver productos
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default Categorias;