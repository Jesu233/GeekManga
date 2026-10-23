import { useState } from 'react';
import { Link } from 'react-router';
import TarjetaProducto from '../components/TarjetaProducto';
// 👇 Importamos los datos desde la nueva carpeta
import { productosDemo } from '../data/productosDemo'; 

function Productos() {
    // Usamos los datos importados
    const [productos] = useState(productosDemo);

    return (
        <main className="container my-4">
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Productos
                    </li>
                </ol>
            </nav>

            <section className="container my-5">
                <h1 className="text-center mb-4">Productos</h1>
                
                <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                    {productos.map((prod) => (
                        <TarjetaProducto key={prod.id} producto={prod} />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Productos;