
import { Link } from 'react-router'; 

function Nosotros() {
    return (
        <main className="container my-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active">Nosotros</li>
                </ol>
            </nav>

            <section className="text-center mb-5">
                <h1>¿Quiénes somos?</h1>
                
                <p className="lead mx-auto" style={{ maxWidth: '720px' }}>
                    Geek&Manga nace de la pasión por el manga, los cómics y la cultura geek.
                    Somos una tienda online pensada para coleccionistas y fanáticos que buscan
                    ediciones de calidad, figuras coleccionables y artículos originales, con
                    despacho a todo Chile y una comunidad que comparte el mismo amor por estas historias.
                </p>
            </section>

            <section className="row g-4 mb-5">
                <div className="col-md-4">
                    <h3>Nuestra misión</h3>
                    <p>Acercar el mundo del manga y la cultura geek a Chile, ofreciendo productos
                        originales, atención cercana y una experiencia de compra simple y confiable.</p>
                </div>
                <div className="col-md-4">
                    <h3>Nuestra visión</h3>
                    <p>Ser la tienda online de referencia para la comunidad geek y otaku
                        de Latinoamérica, ampliando constantemente nuestro catálogo y servicios.</p>
                </div>
                <div className="col-md-4">
                    <h3>Nuestros valores</h3>
                    <ul>
                        <li>Pasión por la cultura geek y el manga</li>
                        <li>Honestidad con nuestros clientes</li>
                        <li>Cercanía con la comunidad</li>
                        <li>Mejora continua de la plataforma</li>
                    </ul>
                </div>
            </section>

            <section>
                <h2 className="text-center mb-4">El equipo de desarrollo</h2>
                <p className="text-center text-muted mb-4">
                    Geek&Manga es un proyecto desarrollado por estudiantes de Duoc UC
                    para el ramo de Desarrollo Full Stack.
                </p>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col">
                        <div className="card-equipo">
                            <div className="img-placeholder">Foto</div>
                            <h5 className="mb-0">Nombre Apellido</h5>
                            <p className="text-muted">Desarrollador/a Full Stack</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card-equipo">
                            <div className="img-placeholder">Foto</div>
                            <h5 className="mb-0">Nombre Apellido</h5>
                            <p className="text-muted">Desarrollador/a Full Stack</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card-equipo">
                            <div className="img-placeholder">Foto</div>
                            <h5 className="mb-0">Nombre Apellido</h5>
                            <p className="text-muted">Desarrollador/a Full Stack</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Nosotros;
