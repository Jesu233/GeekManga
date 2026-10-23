import { Link, NavLink } from 'react-router';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useCarrito } from '../context/CarritoContext';

function Encabezado() {
    const { cantidadTotal } = useCarrito();

    return (
        <header>
            {/* El logo va aquí. Tu CSS "header" le pondrá el fondo amarillo automáticamente */}
            <div className="text-center pt-3">
                <img
                    width="250"
                    height="250"
                    src="/images/logito.png" 
                    alt="logo geek&manga"
                />
            </div>

            {/* El Navbar de Bootstrap oscuro */}
            <Navbar expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold">
                        Home
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="home" />

                    <Navbar.Collapse id="home">
                        <Nav className="ms-auto align-items-lg-center">
                            {/* OJO: La clase 'link-pop' de tu CSS los pone naranjas */}
                            <Nav.Link as={NavLink} to="/productos" className="link-pop">
                                Productos
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/nosotros" className="link-pop">
                                Nosotros
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/blogs" className="link-pop">
                                Blogs
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/contacto" className="link-pop">
                                Contacto
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/usuarios" className="link-pop">
                                Registrarse
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/login" className="link-pop">
                                Iniciar sesión
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/carrito" className="link-pop">
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