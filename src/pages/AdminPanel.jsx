import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import EncabezadoAdmin from '../components/EncabezadoAdmin';
import { productDB } from '../data/BaseDeDatos';

function AdminPanel() {
    const navigate = useNavigate();
    
    // Estados para el resumen rápido
    const [totalProductos, setTotalProductos] = useState(0);
    const [totalUsuarios, setTotalUsuarios] = useState(0);

    // Protegemos la ruta y cargamos los datos
    useEffect(() => {
        const usuarioStr = sessionStorage.getItem("usuarioActivo");
        if(!usuarioStr){
            navigate('/login');
            return;
        }
        const usuario = JSON.parse(usuarioStr);
        if(usuario.tipoUsuario !== 'Administrador' && usuario.tipoUsuario !== 'Vendedor'){
            navigate('/');
            return;
        }

        // Cargamos los datos reales para el resumen
        const productos = productDB.getAll() || [];
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        setTotalProductos(productos.length);
        setTotalUsuarios(usuarios.length);
    }, [navigate]);

    return (
        <>
        <EncabezadoAdmin/> 

        <main className="container-fluid bg-dark text-light py-4">
            <div className="container">
                <nav aria-label="breadcrumb" className="mb-1">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/admin" className="text-warning">Home Admin</Link>
                        </li>
                    </ol>
                </nav>
                
                <h1 className="text-light mb-4">Panel de administración</h1>

                {/* FILA 1: TARJETAS PRINCIPALES */}
                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div className="card bg-dark text-light border-warning h-100 p-3">
                            <h5 className="text-warning mb-3">Productos</h5>
                            <p className="text-secondary small flex-grow-1">Agregar y administrar productos del catálogo.</p>
                            <Link to="/admin/agregar-producto" className="btn btn-warning w-100 mt-auto">Ir a productos</Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-dark text-light border-warning h-100 p-3">
                            <h5 className="text-warning mb-3">Listado</h5>
                            <p className="text-secondary small flex-grow-1">Revisa los productos registrados y su información.</p>
                            <Link to="/admin/listado" className="btn btn-warning w-100 mt-auto">Ver listado</Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-dark text-light border-warning h-100 p-3">
                            <h5 className="text-warning mb-3">Usuarios</h5>
                            <p className="text-secondary small flex-grow-1">Consulta y administra usuarios del sitio.</p>
                            <Link to="/admin/usuarios" className="btn btn-warning w-100 mt-auto">Administrar usuarios</Link>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-dark text-light border-warning h-100 p-3">
                            <h5 className="text-warning mb-3">Tienda</h5>
                            <p className="text-secondary small flex-grow-1">Visualiza la vista de usuarios de la tienda.</p>
                            <Link to="/" className="btn btn-warning w-100 mt-auto">Ir a inicio</Link>
                        </div>
                    </div>
                </div>

                {/* FILA 2: RESUMEN Y ACCIONES RÁPIDAS */}
                <div className="row g-4">
                    {/* Bloque de Resumen Rápido */}
                    <div className="col-lg-6">
                        <div className="card bg-dark text-light border-secondary h-100 p-4">
                            <h4 className="text-warning mb-4">Resumen rápido</h4>
                            <ul className="list-group list-group-flush bg-dark">
                                <li className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center py-3">
                                    <span>Productos activos:</span>
                                    <span className="badge bg-secondary fs-6">{totalProductos}</span>
                                </li>
                                <li className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center py-3">
                                    <span>Usuarios registrados:</span>
                                    <span className="badge bg-secondary fs-6">{totalUsuarios}</span>
                                </li>
                                <li className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center py-3">
                                    <span>Pedidos pendientes:</span>
                                    <span className="badge bg-secondary fs-6">0</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bloque de Acciones Rápidas */}
                    <div className="col-lg-6">
                        <div className="card bg-dark text-light border-secondary h-100 p-4">
                            <h4 className="text-warning mb-4">Acciones rápidas</h4>
                            <div className="d-grid gap-3">
                                <Link to="/admin/agregar-producto" className="btn btn-outline-warning py-2 text-start px-3">
                                    Agregar nuevo producto
                                </Link>
                                <Link to="/admin/listado" className="btn btn-outline-warning py-2 text-start px-3">
                                    Ver productos registrados
                                </Link>
                                <Link to="/admin/usuarios" className="btn btn-outline-warning py-2 text-start px-3">
                                    Gestionar usuarios
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
        </>
    );
}

export default AdminPanel;