import { useNavigate, useParams, Link } from 'react-router';
import EncabezadoAdmin from '../components/EncabezadoAdmin';
import FormularioProducto from '../components/FormularioProducto';
import { productoAFormulario } from '../services/productoFormulario';
import EstadoCarga from '../components/EstadoCarga';
import { useApi } from '../hooks/useApi';
import { buscarProducto, actualizarProducto } from '../services/productoService';
import { listarCategorias } from '../services/categoriaService';
import { PATHS } from '../routes/paths';

// Solo ADMIN (protegida en App.jsx y en el backend)
function AdminEditarProducto() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { datos, cargando, error, codigoError, recargar } = useApi(
        () => Promise.all([buscarProducto(id), listarCategorias()])
            .then(([producto, categorias]) => ({ producto, categorias })),
        [id]
    );

    // PUT /api/v1/producto/actualizar/{id}
    const guardar = async (producto) => {
        await actualizarProducto(id, producto);
        navigate(PATHS.ADMIN_LISTADO, { state: { mensaje: 'Producto actualizado correctamente.' } });
    };

    return (
        <>
            <EncabezadoAdmin />

            <main className="container-fluid bg-dark text-light py-4">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-3">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to={PATHS.ADMIN} className="text-warning text-decoration-none">Home Admin</Link></li>
                            <li className="breadcrumb-item"><Link to={PATHS.ADMIN_LISTADO} className="text-warning text-decoration-none">Listado</Link></li>
                            <li className="breadcrumb-item active text-light">Editar</li>
                        </ol>
                    </nav>

                    <h1 className="mb-4">Editar producto</h1>

                    {codigoError === 404 || codigoError === 400 ? (
                        <div className="alert alert-warning">
                            Producto no encontrado. <Link to={PATHS.ADMIN_LISTADO}>Volver al listado</Link>
                        </div>
                    ) : (
                        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} texto="Cargando producto..." />
                    )}

                    {!cargando && datos && (
                        <section className="bg-dark text-light p-4 rounded border border-secondary mx-auto" style={{ maxWidth: '800px' }}>
                            <FormularioProducto
                                key={datos.producto.id}
                                valoresIniciales={productoAFormulario(datos.producto)}
                                categorias={datos.categorias}
                                textoBoton="Guardar cambios"
                                onGuardar={guardar}
                                onCancelar={() => navigate(PATHS.ADMIN_LISTADO)}
                            />
                        </section>
                    )}
                </div>
            </main>
        </>
    );
}

export default AdminEditarProducto;
