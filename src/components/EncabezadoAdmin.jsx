import { Link } from 'react-router';

function EncabezadoAdmin() {
    return (
        <header>
            {/* Logo sobre fondo amarillo */}
            <div className="bg-warning text-center py-2">
                <img
                    width="200"
                    height="200"
                    src="/images/logito.png"
                    alt="logo geek&manga"
                />
            </div>

            {/* Navbar oscuro de Admin */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand fw-bold" to="/admin">
                        Panel Admin
                    </Link>

                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#adminMenu"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="adminMenu">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link active link-pop" to="/admin">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active link-pop" to="/admin/agregar-producto">Productos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active link-pop" to="/admin/listado">Listado</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active link-pop" to="/admin/usuarios">Usuarios</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active link-pop" to="/">Ver tienda</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default EncabezadoAdmin;