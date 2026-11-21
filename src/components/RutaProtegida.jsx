import { Link, Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { PATHS } from '../routes/paths';

/**
 * Protege una ruta según la sesión y el rol.
 *  - Sin sesión          -> redirige a /login (y después del login vuelve a la página pedida).
 *  - Con rol no permitido -> muestra "Acceso denegado".
 *
 * Uso: <RutaProtegida roles={[ROLES.ADMIN]}><MiPagina/></RutaProtegida>
 * Si no se pasan roles, basta con haber iniciado sesión.
 *
 * Importante: esto es para la experiencia de usuario. La seguridad real la hace el
 * backend, que valida el JWT y el rol en cada petición (responde 401/403).
 */
function RutaProtegida({ roles, children }) {
    const { usuario, cargando } = useAuth();
    const location = useLocation();

    if (cargando) {
        return (
            <div className="container my-5 text-center" role="status">
                <div className="spinner-border text-warning" />
                <p className="mt-2">Verificando sesión...</p>
            </div>
        );
    }

    if (!usuario) {
        return <Navigate to={PATHS.LOGIN} replace state={{ desde: location.pathname }} />;
    }

    if (roles && !roles.includes(usuario.rol)) {
        return (
            <main className="container my-5 text-center">
                <h2>Acceso denegado</h2>
                <p>Tu cuenta no tiene permisos para ver esta página.</p>
                <Link to={PATHS.HOME} className="btn btn-warning">Volver a la tienda</Link>
            </main>
        );
    }

    return children;
}

export default RutaProtegida;
