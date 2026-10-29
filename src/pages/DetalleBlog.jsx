import { useParams, Link } from 'react-router';
import { ARTICULOS } from '../data/blogsData';

function DetalleBlog() {
    // 1. Capturamos el ID de la URL (ej: "2")
    const { id } = useParams(); 

    // 2. Buscamos el artículo comparando el ID numérico
    const articulo = ARTICULOS.find(post => post.id === Number(id));

    if (!articulo) {
        return (
            <main className="container my-5 text-center">
                <h2>Artículo no encontrado 😢</h2>
                <Link to="/blogs" className="btn btn-warning mt-3">Volver a los blogs</Link>
            </main>
        );
    }

    return (
        <main className="container my-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/blogs">Blogs</Link></li>
                    <li className="breadcrumb-item active">{articulo.titulo}</li>
                </ol>
            </nav>

            <article className="blog-article">
                <img 
                    src={articulo.imagen} 
                    alt={articulo.alt} 
                />

                <h1 className="mb-3">{articulo.titulo}</h1>
                <p className="text-muted">Publicado por el equipo de Geek&amp;Manga</p>

                {/* Recorremos el arreglo de párrafos */}
                {articulo.contenido && articulo.contenido.map((parrafo, index) => (
                    <p key={index}>{parrafo}</p>
                ))}

                <Link to="/blogs" className="btn btn-secondary mt-3">
                    &larr; Volver a Blogs
                </Link>
            </article>
        </main>
    );
}

export default DetalleBlog;