// Pruebas básicas de las páginas estáticas y del armado general de la app
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import App from '../src/App';
import Home from '../src/pages/Home';
import Nosotros from '../src/pages/Nosotros';
import Blogs from '../src/pages/Blogs';
import DetalleBlog from '../src/pages/DetalleBlog';
import Contacto from '../src/pages/Contacto';
import PagoError from '../src/pages/PagoError';
import EncabezadoAdmin from '../src/components/EncabezadoAdmin';
import { AuthProvider } from '../src/context/AuthContext';
import { CarritoProvider } from '../src/context/CarritoContext';
import * as productoService from '../src/services/productoService';

vi.mock('../src/services/productoService');

const conRouter = (ui, ruta = '/') => render(<MemoryRouter initialEntries={[ruta]}>{ui}</MemoryRouter>);

beforeEach(() => {
    localStorage.clear();
});

describe('Páginas estáticas', () => {
    it('Home muestra la bienvenida', () => {
        conRouter(<Home />);
        expect(screen.getByRole('heading', { name: /bienvenido a geek&manga/i })).toBeInTheDocument();
    });

    it('Nosotros se renderiza', () => {
        const { container } = conRouter(<Nosotros />);
        expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('Blogs y su detalle se renderizan', () => {
        conRouter(<Blogs />);
        expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
    });

    it('DetalleBlog muestra el artículo o un aviso si no existe', () => {
        render(
            <MemoryRouter initialEntries={['/blog/999']}>
                <Routes><Route path="/blog/:id" element={<DetalleBlog />} /></Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Artículo no encontrado 😢')).toBeInTheDocument();
    });

    it('Contacto muestra su formulario', () => {
        const { container } = conRouter(<Contacto />);
        expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('PagoError muestra el mensaje recibido', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter initialEntries={[{ pathname: '/pago-error', state: { mensaje: 'Sin stock' } }]}>
                <Routes>
                    <Route path="/pago-error" element={<PagoError />} />
                    <Route path="/pago" element={<p>Página de pago</p>} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Sin stock')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Volver a realizar el pago' }));
        expect(screen.getByText('Página de pago')).toBeInTheDocument();
    });
});

describe('App completa', () => {
    it('carga la tienda y protege el panel de administración', async () => {
        productoService.listarProductos.mockResolvedValue([]);
        window.history.pushState({}, '', '/productos');

        render(<AuthProvider><CarritoProvider><App /></CarritoProvider></AuthProvider>);

        expect(await screen.findByText('Todavía no hay productos en la tienda.')).toBeInTheDocument();
        expect(screen.getByText(/Geek&Manga/i, { selector: 'footer *' })).toBeInTheDocument();
    });

    it('un usuario anónimo que entra a /admin es enviado al login', async () => {
        window.history.pushState({}, '', '/admin');

        render(<AuthProvider><CarritoProvider><App /></CarritoProvider></AuthProvider>);

        expect(await screen.findByRole('heading', { name: 'Inicio de sesión' })).toBeInTheDocument();
    });
});

describe('EncabezadoAdmin', () => {
    it('cierra la sesión y vuelve al login', async () => {
        const user = userEvent.setup();
        localStorage.setItem('geekmanga_usuario', JSON.stringify({ usuarioId: 1, nombre: 'Vale', rol: 'VENDEDOR' }));

        render(
            <AuthProvider>
                <MemoryRouter initialEntries={['/admin']}>
                    <Routes>
                        <Route path="/admin" element={<EncabezadoAdmin />} />
                        <Route path="/login" element={<p>Login</p>} />
                    </Routes>
                </MemoryRouter>
            </AuthProvider>
        );

        expect(screen.getByText('Vale (Vendedor)')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(localStorage.getItem('geekmanga_usuario')).toBeNull();
    });
});
