import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import EncabezadoAdmin from '../components/EncabezadoAdmin';
import EstadoCarga from '../components/EstadoCarga';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { listarProductos, eliminarProducto } from '../services/productoService';
import { mensajeDeError } from '../services/api';
import { formatoPrecio, imagenProducto, nombreCategoria, precioVigente } from '../services/formato';
import { ROLES } from '../services/roles';
import { PATHS } from '../routes/paths';

// ADMIN y VENDEDOR pueden ver el listado; solo ADMIN ve los botones para editar y eliminar
function AdminListadoProductos() {
    const { tieneRol } = useAuth();
    const esAdmin = tieneRol(ROLES.ADMIN);
    const location = useLocation();

    const { datos: productos, cargando, error, recargar } = useApi(listarProductos);
    const [mensaje, setMensaje] = useState(location.state?.mensaje ? { tipo: 'success', texto: location.state.mensaje } : null);

    const handleEliminar = async (prod) => {
        if (!window.confirm(`¿Seguro que quieres eliminar "${prod.producto}"?`)) return;
        try {
            await eliminarProducto(prod.id);
            setMensaje({ tipo: 'success', texto: 'Producto eliminado.' });
            recargar();
        } catch (err) {
            setMensaje({ tipo: 'danger', texto: mensajeDeError(err, 'No se pudo eliminar el producto.') });
        }
    };

    return (
        <>
            <EncabezadoAdmin />

            <main className="container-fluid bg-dark text-light py-4">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-3">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link to={PATHS.ADMIN} className="text-warning text-decoration-none">Home Admin</Link>
                            </li>
                            <li className="breadcrumb-item active text-light" aria-current="page">Listado</li>
                        </ol>
                    </nav>

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <h1 className="mb-0">Lista de productos</h1>
                        {esAdmin && (
                            <Link to={PATHS.ADMIN_AGREGAR_PRODUCTO} className="btn btn-warning fw-bold">
                                Agregar un producto
                            </Link>
                        )}
                    </div>

                    {mensaje && <div className={`alert alert-${mensaje.tipo}`} role={mensaje.tipo === 'danger' ? 'alert' : 'status'}>{mensaje.texto}</div>}

                    <EstadoCarga cargando={cargando && !productos} error={error} onReintentar={recargar} texto="Cargando productos..." />

                    {productos && (
                        <div className="table-responsive rounded border border-secondary">
                            <table className="table table-dark table-striped align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Código</th>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        {esAdmin && <th>Acciones</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map((prod) => {
                                        const stockBajo = prod.stock <= prod.stockCritico;
                                        return (
                                            <tr key={prod.id}>
                                                <td>
                                                    <img src={imagenProducto(prod)} alt={prod.producto} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />
                                                </td>
                                                <td>{prod.codigo}</td>
                                                <td>
                                                    {prod.producto}
                                                    <div className="small text-secondary">{prod.marca}</div>
                                                </td>
                                                <td>{nombreCategoria(prod)}</td>
                                                <td>
                                                    {formatoPrecio(precioVigente(prod))}
                                                    {prod.oferta && <span className="badge bg-danger ms-1">Oferta</span>}
                                                </td>
                                                <td>
                                                    <span className={stockBajo ? 'badge bg-warning text-dark' : ''} title={stockBajo ? `Stock crítico: ${prod.stockCritico}` : undefined}>
                                                        {prod.stock}
                                                    </span>
                                                </td>
                                                {esAdmin && (
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Link to={PATHS.ADMIN_EDITAR_PRODUCTO(prod.id)} className="btn btn-warning btn-sm">Editar</Link>
                                                            <button onClick={() => handleEliminar(prod)} className="btn btn-danger btn-sm">Eliminar</button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {productos && (
                        <p className="small text-secondary mt-2">
                            <span className="badge bg-warning text-dark">n</span> = stock igual o bajo el stock crítico.
                        </p>
                    )}
                </div>
            </main>
        </>
    );
}

export default AdminListadoProductos;
