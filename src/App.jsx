import { BrowserRouter, Routes, Route } from 'react-router';
import Encabezado from './components/Encabezado';
import PiePagina from './components/PiePagina';
import Home from './pages/Home'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto';
import Nosotros from './pages/Nosotros';
import Carrito from './pages/Carrito';
import Blogs from './pages/Blogs'; 



function App() {
    return (
        <BrowserRouter>
            <Encabezado />
            <Routes>
                <Route path= "/" element={<Home/>}/>
                <Route path= "/blogs" element={<Blogs/>} />
                <Route path= "/productos" element={<Productos/>} />
                <Route path= "/productos/:id" element={<DetalleProducto />} />
                <Route path= "/nosotros" element={<Nosotros/>} /> 
                <Route path="/carrito" element={<Carrito/>}/>
            </Routes>
            <PiePagina />
        </BrowserRouter>
    );
}

export default App;