import { Link, useNavigate } from 'react-router';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { PATHS } from '../routes/paths';
import { NOMBRE_ROL, ROLES } from '../services/roles';

function EncabezadoAdmin() {
    const { usuario, logout, tieneRol } = useAuth();
    const navigate = useNavigate();
    const esAdmin = tieneRol(ROLES.ADMIN);

    const cerrarSesion = () => {
        logout();
        navigate(PATHS.LOGIN);
    };

    return (
        <header>
            <div className="bg-warning text-center py-2">
                <img width="200" height="200" src="/images/logito.png" alt="logo geek&manga" />
            </div>

            <Navbar expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to={PATHS.ADMIN} className="fw-bold">
                        Panel {esAdmin ? 'Admin' : 'Vendedor'}
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="adminMenu" />

                    <Navbar.Collapse id="adminMenu">
                        <Nav className="ms-auto align-items-lg-center">
                            <Nav.Link as={Link} to={PATHS.ADMIN} className="link-pop text-light">Inicio</Nav.Link>
                            {/* Opciones que solo ve el ADMIN (el backend también las bloquea) */}
                            {esAdmin && (
                                <Nav.Link as={Link} to={PATHS.ADMIN_AGREGAR_PRODUCTO} className="link-pop text-light">Productos</Nav.Link>
                            )}
                            <Nav.Link as={Link} to={PATHS.ADMIN_LISTADO} className="link-pop text-light">Listado</Nav.Link>
                            {esAdmin && (
                                <Nav.Link as={Link} to={PATHS.ADMIN_USUARIOS} className="link-pop text-light">Usuarios</Nav.Link>
                            )}
                            <Nav.Link as={Link} to={PATHS.HOME} className="link-pop text-light">Ver tienda</Nav.Link>

                            {usuario && (
                                <span className="navbar-text text-warning small ms-lg-3">
                                    {usuario.nombre} ({NOMBRE_ROL[usuario.rol] || usuario.rol})
                                </span>
                            )}
                            <button type="button" className="btn btn-outline-warning btn-sm ms-lg-3 my-2 my-lg-0" onClick={cerrarSesion}>
                                Cerrar sesión
                            </button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default EncabezadoAdmin;
