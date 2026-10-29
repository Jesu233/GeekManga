import { Link, NavLink } from 'react-router';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useCarrito } from '../context/CarritoContext';
import { PATHS } from '../routes/paths';
import { useLocation } from 'react-router';

function Encabezado() {
    //para reconocer si estamos en admin o nelpastel de esta forma se ve que encabezado usar si el normalito osea este o el de admin
    const location = useLocation();

    if(location.pathname.startsWith('/admin')){
        return null;
    }



    const { cantidadTotal } = useCarrito();

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
                            <Nav.Link as={NavLink} to={PATHS.REGISTRARSE} className="link-pop">
                                Registrarse
                            </Nav.Link>
                            <Nav.Link as={NavLink} to={PATHS.LOGIN} className="link-pop">
                                Iniciar sesión
                            </Nav.Link>
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