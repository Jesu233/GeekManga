import { Link } from 'react-router';
import { Navbar, Nav, Container } from 'react-bootstrap'; // 👈 Importas los componentes

function EncabezadoAdmin() {
    return (
        <header>
            <div className="bg-warning text-center py-2">
                <img width="200" height="200" src="/images/logito.png" alt="logo geek&manga" />
            </div>

            {/* 👇 Usamos Navbar de react-bootstrap (igual que en la tienda) */}
            <Navbar expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/admin" className="fw-bold">
                        Panel Admin
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="adminMenu" />

                    <Navbar.Collapse id="adminMenu">
                        <Nav className="ms-auto align-items-lg-center">
                            <Nav.Link as={Link} to="/admin" className="link-pop text-light">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/admin/agregar-producto" className="link-pop text-light">Productos</Nav.Link>
                            <Nav.Link as={Link} to="/admin/listado" className="link-pop text-light">Listado</Nav.Link>
                            <Nav.Link as={Link} to="/admin/usuarios" className="link-pop text-light">Usuarios</Nav.Link>
                            <Nav.Link as={Link} to="/" className="link-pop text-light">Ver tienda</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default EncabezadoAdmin;