import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { productDB } from '../data/BaseDeDatos';
import EncabezadoAdmin from '../components/EncabezadoAdmin'; // 👈 Importamos el encabezado

function AdminListadoProductos() {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();

    // 1. Protegemos la ruta (por si alguien entra sin loguearse)
    useEffect(() => {
        const usuarioStr = sessionStorage.getItem("usuarioActivo");
        if (!usuarioStr) {
            navigate('/login');
            return;
        }
        const usuario = JSON.parse(usuarioStr);
        if (usuario.tipoUsuario !== 'Administrador' && usuario.tipoUsuario !== 'Vendedor') {
            navigate('/');
        }
    }, [navigate]);

    // 2. Cargamos los productos
    useEffect(() => {
        setProductos(productDB.getAll());
    }, []);

    const handleEliminar = (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
            productDB.delete(id);
            setProductos(productDB.getAll());
        }
    };

    return (
        <>
            {/* 👇 AQUÍ ESTÁ LA MAGIA: Llamamos al encabezado de admin */}
            <EncabezadoAdmin /> 

            {/* container-fluid para que el fondo oscuro ocupe toda la pantalla */}
            <main className="container-fluid bg-dark text-light min-vh-100 py-4">
                <div className="container"> {/* container normal para que el contenido no se estire */}
                    
                    <nav aria-label="breadcrumb" className="mb-3">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link to="/admin" className="text-warning text-decoration-none">Home Admin</Link>
                            </li>
                            <li className="breadcrumb-item active text-light" aria-current="page">Listado</li>
                        </ol>
                    </nav>

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <h1 className="mb-0">Lista de productos</h1>
                        <div className="d-flex gap-2 flex-wrap">
                            <Link to="/admin/agregar-producto" className="btn btn-warning fw-bold">
                                Agregar un producto
                            </Link>
                        </div>
                    </div>

                    <section className="my-5">
                        <h2 className="text-light mb-4">Productos Registrados</h2>
                        
                        <div className="row row-cols-1 row-cols-md-3 g-4">
                            {productos.map((prod) => (
                                <div className="col" key={prod.id}>
                                    <div className="card h-100 border-0 shadow-sm">
                                        <img 
                                            src={prod.foto} 
                                            className="card-img-top" 
                                            alt={prod.producto} 
                                            style={{ height: '250px', objectFit: 'cover' }} 
                                        />
                                        <div className="card-body bg-secondary text-light">
                                            <h5 className="card-title">{prod.producto}</h5>
                                            <p className="small mb-1">Código: {prod.codigo}</p>
                                            <p className="small mb-1">Precio: ${prod.precio?.toLocaleString('es-CL')}</p>
                                            <p className="small mb-1">Stock: {prod.stock}</p>
                                            <p className="small mb-1">Categoría: {prod.categoria}</p>
                                            <p className="small mb-1">Marca: {prod.marca}</p>
                                            <p className="small mt-2 text-light" style={{ opacity: 0.8 }}>
                                                {prod.descripcion}
                                            </p>
                                            
                                            <div className="d-flex gap-2 mt-3">
                                                <button className="btn btn-warning btn-sm w-50">Editar</button>
                                                <button 
                                                    onClick={() => handleEliminar(prod.id)} 
                                                    className="btn btn-danger btn-sm w-50"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

export default AdminListadoProductos;