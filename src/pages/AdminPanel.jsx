import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function AdminPanel() {
    const navigate = useNavigate();

    // Protegemos la ruta: si no es admin, lo mandamos al login
    useEffect(() => {
        const usuarioStr = sessionStorage.getItem("usuarioActivo");
        if(!usuarioStr){
            navigate('/login');
            return
        }
        const usuario = JSON.parse(usuarioStr);

        if(usuario.tipoUsuario !== 'Administrador' && usuario.tipoUsuario !== 'Vendedor'){
            navigate('/');
        }
    }, [navigate]);

    return (
        <>
        <EncabezadoAdmin/> 

        <main className="container-fluid bg-dark text-light min-vh-100 py-5">
            <div className="container">
                <p className="text-muted mb-1">Home Admin</p>
                <h1 className="text-light display-5 fw-bold">Panel de administración</h1>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="card bg-dark text-light border-warning h-100 p-3">
                        <h5 className="text-warning">Productos</h5>
                        <p className="text-muted small flex-grow-1">Agregar y administrar productos del catálogo.</p>
                        <Link to="/admin/agregar-producto" className="btn btn-warning w-100">Ir a productos</Link>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-dark text-light border-warning h-100 p-3">
                        <h5 className="text-warning">Listado</h5>
                        <p className="text-muted small flex-grow-1">Revisa los productos registrados y su información.</p>
                        <button className="btn btn-warning w-100">Ver listado</button>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-dark text-light border-warning h-100 p-3">
                        <h5 className="text-warning">Usuarios</h5>
                        <p className="text-muted small flex-grow-1">Consulta y administra usuarios del sitio.</p>
                        <button className="btn btn-warning w-100">Administrar usuarios</button>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-dark text-light border-warning h-100 p-3">
                        <h5 className="text-warning">Tienda</h5>
                        <p className="text-muted small flex-grow-1">Visualiza la vista de usuarios de la tienda.</p>
                        <Link to="/" className="btn btn-warning w-100">Ir a inicio</Link>
                    </div>
                </div>
            </div>
        </main>
        </>
    );
}

export default AdminPanel;