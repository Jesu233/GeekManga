import { BrowserRouter, Routes, Route } from 'react-router';
import Encabezado from './components/Encabezado';
import PiePagina from './components/PiePagina';
import Home from './pages/Home'
import Productos from './pages/Productos'
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
import Login from './pages/Login';
import AdminAgregarProducto from './pages/AdminAgregarProducto';
import AdminPanel from './pages/AdminPanel';
import AdminListadoProductos from './pages/AdminListadoProductos';
import Registro from './pages/Registro';


function App() {
    return (
        <BrowserRouter>
            <Encabezado />
            <Routes>
                
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
                <Route path={PATHS.PAGO} element={<Pago />} />
                <Route path={PATHS.PAGO_EXITOSO} element={<PagoExitoso />} />
                <Route path={PATHS.PAGO_ERROR} element={<PagoError />} />
                <Route path={PATHS.LOGIN} element={<Login/>}/>
                <Route path="/admin/agregar-producto" element={<AdminAgregarProducto/>}/>
                <Route path="/admin" element={<AdminPanel/>}/>
                <Route path="/admin/listado" element={<AdminListadoProductos/>}/>
                <Route path={PATHS.REGISTRARSE} element={<Registro/>}/>

            </Routes>
            <PiePagina />
        </BrowserRouter>
    );
}

export default App;