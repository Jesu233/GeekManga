import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { PATHS } from '../routes/paths';
import { NOMBRE_ROL, ROLES } from '../services/roles';

function Encabezado() {
    // Los hooks siempre se llaman primero (React no permite llamarlos después de un return)
    const location = useLocation();
    const navigate = useNavigate();
    const { cantidadTotal } = useCarrito();
    const { usuario, logout, tieneRol } = useAuth();

    // En las rutas /admin se usa EncabezadoAdmin, así que este no se muestra
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    const cerrarSesion = () => {
        logout();
        navigate(PATHS.HOME);
    };

    return (
        <header>
            <div className="text-center pt-3">
                <img
                    width="250"
                    height="250"
                    src="/images/logito.png"
                    alt="logo geek&manga"
                />
            </div>

            <Navbar expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to={PATHS.HOME} className="fw-bold">
                        Home
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="home" />

                    <Navbar.Collapse id="home">
                        <Nav className="ms-auto align-items-lg-center">
                            <Nav.Link as={NavLink} to={PATHS.PRODUCTOS} className="link-pop">
                                Productos
                            </Nav.Link>
                            <Nav.Link as={NavLink} to={PATHS.CATEGORIAS} className="link-pop">
                                Categorías
                            </Nav.Link>
                            <Nav.Link as={NavLink} to={PATHS.OFERTAS} className="link-pop">
                                OFERTAS
                            </Nav.Link>
                            <Nav.Link as={NavLink} to={PATHS.NOSOTROS} className="link-pop">
                                Nosotros
                            </Nav.Link>
                            <Nav.Link as={NavLink} to={PATHS.BLOGS} className="link-pop">
                                Blogs
                            </Nav.Link>
                            <Nav.Link as={NavLink} to={PATHS.CONTACTO} className="link-pop">
                                Contacto
                            </Nav.Link>

                            {usuario ? (
                                <>
                                    {/* Solo ADMIN y VENDEDOR ven el acceso al panel */}
                                    {tieneRol(ROLES.ADMIN, ROLES.VENDEDOR) && (
                                        <Nav.Link as={NavLink} to={PATHS.ADMIN} className="link-pop">
                                            Panel
                                        </Nav.Link>
                                    )}
                                    <NavDropdown
                                        title={`👤 ${usuario.nombre}`}
                                        id="menu-usuario"
                                        align="end"
                                        menuVariant="dark"
                                    >
                                        <NavDropdown.ItemText className="small text-secondary">
                                            {usuario.correo} · {NOMBRE_ROL[usuario.rol] || usuario.rol}
                                        </NavDropdown.ItemText>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to={PATHS.MIS_COMPRAS}>
                                            Mis compras
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as="button" onClick={cerrarSesion}>
                                            Cerrar sesión
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={NavLink} to={PATHS.REGISTRARSE} className="link-pop">
                                        Registrarse
                                    </Nav.Link>
                                    <Nav.Link as={NavLink} to={PATHS.LOGIN} className="link-pop">
                                        Iniciar sesión
                                    </Nav.Link>
                                </>
                            )}

                            <Nav.Link as={NavLink} to={PATHS.CARRITO} className="link-pop">
                                🛒 Carrito ({cantidadTotal})
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Encabezado;
