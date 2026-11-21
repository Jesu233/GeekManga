import { BrowserRouter, Routes, Route } from 'react-router';
import Encabezado from './components/Encabezado';
import PiePagina from './components/PiePagina';
import RutaProtegida from './components/RutaProtegida';
import Home from './pages/Home';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import Nosotros from './pages/Nosotros';
import Carrito from './pages/Carrito';
import Blogs from './pages/Blogs';
import Contacto from './pages/Contacto';
import CategoriaDetalle from './pages/CategoriaDetalle';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Pago from './pages/Pago';
import PagoExitoso from './pages/PagoExitoso';
import PagoError from './pages/PagoError';
import { PATHS } from './routes/paths';
import { ROLES } from './services/roles';
import Login from './pages/Login';
import AdminAgregarProducto from './pages/AdminAgregarProducto';
import AdminPanel from './pages/AdminPanel';
import AdminListadoProductos from './pages/AdminListadoProductos';
import Registro from './pages/Registro';
import DetalleBlog from './pages/DetalleBlog';
import AdminUsuarios from './pages/AdministrarUsuarios';
import AdminEditarProducto from './pages/AdminEditarProducto';

// Quién puede entrar a cada sección del panel
const STAFF = [ROLES.ADMIN, ROLES.VENDEDOR];
const SOLO_ADMIN = [ROLES.ADMIN];

function App() {
    return (
        <BrowserRouter>
            {/* 👇 1. Este div envuelve la tienda. Tiene "bg-white" para que se vea blanca */}
            <div className="bg-white d-flex flex-column flex-grow-1">
                <Encabezado />

                {/* 👇 2. Este div hace que el contenido empuje al footer hacia abajo */}
                <div className="flex-grow-1">
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path={PATHS.HOME} element={<Home/>}/>
                        <Route path={PATHS.BLOGS} element={<Blogs/>} />
                        <Route path={PATHS.PRODUCTOS} element={<Productos/>} />
                        <Route path={PATHS.CONTACTO} element={<Contacto/>} />
                        <Route path={PATHS.PRODUCTOS_ROUTE} element={<DetalleProducto/>} />
                        <Route path={PATHS.OFERTAS} element={<Ofertas/>} />
                        <Route path={PATHS.CATEGORIAS} element={<Categorias/>} />
                        <Route path="/categorias/:nombre" element={<CategoriaDetalle/>} />
                        <Route path={PATHS.NOSOTROS} element={<Nosotros/>} />
                        <Route path={PATHS.CARRITO} element={<Carrito/>}/>
                        <Route path={PATHS.LOGIN} element={<Login/>}/>
                        <Route path={PATHS.REGISTRARSE} element={<Registro/>}/>
                        <Route path="/blog/:id" element={<DetalleBlog/>}/>

                        {/* Requieren sesión iniciada (cualquier rol) */}
                        <Route path={PATHS.PAGO} element={<RutaProtegida><Pago /></RutaProtegida>} />
                        <Route path={PATHS.PAGO_EXITOSO} element={<RutaProtegida><PagoExitoso /></RutaProtegida>} />
                        <Route path={PATHS.PAGO_ERROR} element={<PagoError />} />

                        {/* Panel de administración: ADMIN y VENDEDOR */}
                        <Route path={PATHS.ADMIN} element={<RutaProtegida roles={STAFF}><AdminPanel/></RutaProtegida>}/>
                        <Route path={PATHS.ADMIN_LISTADO} element={<RutaProtegida roles={STAFF}><AdminListadoProductos/></RutaProtegida>}/>

                        {/* Solo ADMIN */}
                        <Route path={PATHS.ADMIN_AGREGAR_PRODUCTO} element={<RutaProtegida roles={SOLO_ADMIN}><AdminAgregarProducto/></RutaProtegida>}/>
                        <Route path={PATHS.ADMIN_EDITAR_PRODUCTO_ROUTE} element={<RutaProtegida roles={SOLO_ADMIN}><AdminEditarProducto/></RutaProtegida>}/>
                        <Route path={PATHS.ADMIN_USUARIOS} element={<RutaProtegida roles={SOLO_ADMIN}><AdminUsuarios/></RutaProtegida>}/>
                    </Routes>
                </div>
            </div>

            {/* 👇 3. El Footer va afuera del div blanco, para que se vea oscuro */}
            <PiePagina />
        </BrowserRouter>
    );
}

export default App;
