import { Link } from 'react-router';

function Bienvenida() {
    return (
        <section className="texto-index hero-tienda text-center py-5 px-3">
            <h1>Bienvenido a Geek&amp;Manga</h1>
            <p className="lead">Tu tienda online de mangas, cómics y figuras coleccionables. Encuentra tus ediciones favoritas al mejor precio.</p>
            <Link to="/productos" className="btn btn-warning btn-lg btn-productos">
                Ver productos
            </Link>
        </section>
    );
}

export default Bienvenida;