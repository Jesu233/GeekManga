import { BrowserRouter, Routes, Route } from 'react-router';
import Encabezado from './components/Encabezado';
import PiePagina from './components/PiePagina';
import Home from './pages/Home'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
// ... imports de páginas


function App() {
    return (
        <BrowserRouter>
            <Encabezado />
            <Routes>
                <Route path= "/" element={<Home/>}/>

                <Route path= "/productos" element={<Productos/>} />
                <Route path= "/productos/:id" element={<DetalleProducto />} />


                <Route path="/carrito" element={<Carrito/>}/>
            </Routes>
            <PiePagina />
        </BrowserRouter>
    );
}

export default App;