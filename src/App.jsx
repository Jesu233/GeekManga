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
import { PATHS } from './routes/paths';



function App() {
    return (
        <BrowserRouter>
            <Encabezado />
            <Routes>
                <Route path={PATHS.HOME} element={<Home/>}/>
                <Route path={PATHS.BLOGS} element={<Blogs/>} />
                <Route path={PATHS.PRODUCTOS} element={<Productos/>} />
                <Route path={PATHS.CONTACTO} element={<Contacto/>} />
                <Route path="/productos/:id" element={<DetalleProducto />} />
                <Route path={PATHS.OFERTAS} element={<Ofertas/>} />
                <Route path={PATHS.CATEGORIAS} element={<Categorias/>} />
                <Route path="/categorias/:nombre" element={<CategoriaDetalle/>} />
                <Route path={PATHS.NOSOTROS} element={<Nosotros/>} /> 
                <Route path={PATHS.CARRITO} element={<Carrito/>}/>

                
            </Routes>
            <PiePagina />
        </BrowserRouter>
    );
}

export default App;