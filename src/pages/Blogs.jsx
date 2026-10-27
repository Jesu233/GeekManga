
import { Link } from 'react-router';
import { ARTICULOS } from '../data/blogsData'; 

function Blogs() {
    return (
        <main className="container my-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active">Blogs</li>
                </ol>
            </nav>

            <h1 className="text-center mb-5">Blogs</h1>

            <section className="row row-cols-1 row-cols-md-2 g-4">
                
                {ARTICULOS.map((post) => (
                    <div className="col" key={post.id}>
                        <article className="card card-blog h-100">
                            
                            <img src={post.imagen} alt={post.alt} className="card-img-top" />
                            <div className="card-body">
                                <h2 className="h4 card-title">{post.titulo}</h2>
                                <p className="card-text">{post.descripcion}</p>
                                
                                <Link to={post.ruta} className="btn btn-warning">
                                    Ver caso
                                </Link>
                            </div>
                        </article>
                    </div>
                ))}
            </section>
        </main>
    );
}

export default Blogs;
