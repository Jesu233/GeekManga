import { useState } from 'react';
import { Link } from 'react-router';
import EncabezadoAdmin from '../components/EncabezadoAdmin';
import FormularioProducto from '../components/FormularioProducto';
import GestionCategorias from '../components/GestionCategorias';
import EstadoCarga from '../components/EstadoCarga';
import { useApi } from '../hooks/useApi';
import { listarProductos, crearProducto, eliminarProducto } from '../services/productoService';
import { listarCategorias } from '../services/categoriaService';
import { mensajeDeError } from '../services/api';
import { formatoPrecio, imagenProducto } from '../services/formato';
import { PATHS } from '../routes/paths';

const cargarDatos = () => Promise.all([listarProductos(), listarCategorias()])
    .then(([productos, categorias]) => ({ productos, categorias }));

// Solo ADMIN (protegida en App.jsx y en el backend)
function AdminAgregarProducto() {
    const { datos, cargando, error, recargar } = useApi(cargarDatos);
    const [mensaje, setMensaje] = useState(null);

    // POST /api/v1/producto
    const guardar = async (producto) => {
        const creado = await crearProducto(producto);
        setMensaje({ tipo: 'success', texto: `¡Producto "${creado.producto}" agregado con éxito!` });
        recargar();
    };

    // DELETE /api/v1/producto/eliminar/{id}
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
                            <li className="breadcrumb-item"><Link to={PATHS.ADMIN} className="text-warning text-decoration-none">Home Admin</Link></li>
                            <li className="breadcrumb-item active text-light">Productos</li>
                        </ol>
                    </nav>

                    <h1 className="mb-4 text-light">Productos</h1>

                    {mensaje && (
                        <div className={`alert alert-${mensaje.tipo} mx-auto`} style={{ maxWidth: '800px' }} role={mensaje.tipo === 'danger' ? 'alert' : 'status'}>
                            {mensaje.texto}
                        </div>
                    )}

                    <EstadoCarga cargando={cargando && !datos} error={error} onReintentar={recargar} />

                    {datos && (
                        <>
                            <section className="bg-dark text-light p-4 rounded border border-secondary mb-4 mx-auto" style={{ maxWidth: '800px' }}>
                                <h4 className="text-warning mb-3">Nuevo producto</h4>
                                <FormularioProducto
                                    categorias={datos.categorias}
                                    textoBoton="Subir producto"
                                    onGuardar={guardar}
                                />
                            </section>

                            <GestionCategorias categorias={datos.categorias} onCambio={recargar} />

                            <h2 className="text-light mb-4">Productos Registrados</h2>
                            <div className="row g-4">
                                {datos.productos.map((prod) => (
                                    <div className="col-md-4" key={prod.id}>
                                        <div className="card bg-secondary text-light border-0 h-100 shadow-sm">
                                            <img src={imagenProducto(prod)} className="card-img-top" alt={prod.producto} style={{ height: '250px', objectFit: 'cover' }} />
                                            <div className="card-body bg-dark">
                                                <h5 className="card-title">{prod.producto}</h5>
                                                <p className="small mb-1">Código: {prod.codigo}</p>
                                                <p className="small mb-1">Precio: {formatoPrecio(prod.precio)}</p>
                                                <p className="small mb-1">Stock: {prod.stock}</p>

                                                <div className="d-flex gap-2 mt-3">
                                                    <Link to={PATHS.ADMIN_EDITAR_PRODUCTO(prod.id)} className="btn btn-warning btn-sm w-50">Editar</Link>
                                                    <button onClick={() => handleEliminar(prod)} className="btn btn-danger btn-sm w-50">Eliminar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </>
    );
}

export default AdminAgregarProducto;
