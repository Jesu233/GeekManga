import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import RutaProtegida from '../src/components/RutaProtegida';
import { useAuth } from '../src/context/AuthContext';

vi.mock('../src/context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

const renderRuta = (roles) =>
    render(
        <MemoryRouter initialEntries={['/admin']}>
            <Routes>
                <Route path="/admin" element={<RutaProtegida roles={roles}><p>Contenido privado</p></RutaProtegida>} />
                <Route path="/login" element={<p>Página de login</p>} />
            </Routes>
        </MemoryRouter>
    );

describe('RutaProtegida', () => {
    it('muestra un indicador mientras se verifica la sesión', () => {
        useAuth.mockReturnValue({ usuario: null, cargando: true });
        renderRuta();
        expect(screen.getByText('Verificando sesión...')).toBeInTheDocument();
    });

    it('redirige al login si no hay sesión', () => {
        useAuth.mockReturnValue({ usuario: null, cargando: false });
        renderRuta(['ADMIN']);
        expect(screen.getByText('Página de login')).toBeInTheDocument();
        expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument();
    });

    it('muestra "Acceso denegado" si el rol no está permitido', () => {
        useAuth.mockReturnValue({ usuario: { rol: 'USER' }, cargando: false });
        renderRuta(['ADMIN', 'VENDEDOR']);
        expect(screen.getByText('Acceso denegado')).toBeInTheDocument();
        expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument();
    });

    it('muestra el contenido si el rol está permitido', () => {
        useAuth.mockReturnValue({ usuario: { rol: 'VENDEDOR' }, cargando: false });
        renderRuta(['ADMIN', 'VENDEDOR']);
        expect(screen.getByText('Contenido privado')).toBeInTheDocument();
    });

    it('sin roles basta con tener sesión', () => {
        useAuth.mockReturnValue({ usuario: { rol: 'USER' }, cargando: false });
        renderRuta();
        expect(screen.getByText('Contenido privado')).toBeInTheDocument();
    });
});
