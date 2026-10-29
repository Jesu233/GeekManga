import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { productDB } from '../data/BaseDeDatos';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function AdminEditarProducto() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [cargando, setCargando] = useState(true);
    const [productos, setProductos] = useState([]);

    const [formData, setFormData] = useState({
        codigo: '',
        producto: '',
        precio: '',
        marca: '',
        stock: '',
        stockCritico: '',
        categoria: '',
        descripcion: '',
        foto: ''
    });

    // 1. Cargar los datos del producto y la lista completa
    useEffect(() => {
        const todos = productDB.getAll() || [];
        setProductos(todos);

        const producto = productDB.getById(id);
        if (producto) {
            setFormData(producto);
        } else {
            alert("Producto no encontrado");
            navigate('/admin/listado');
        }
        setCargando(false);
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 2. Lógica para subir y previsualizar la imagen (Base64)
    const handleFotoChange = (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            const reader = new FileReader();
            reader.onload = function (evento) {
                setFormData({ ...formData, foto: evento.target.result });
            };
            reader.readAsDataURL(archivo);
        }
    };

    // 3. Guardar cambios con validaciones
    const handleSubmit = (e) => {
        e.preventDefault();

        const codigoNuevo = formData.codigo.trim();
        if (!codigoNuevo || codigoNuevo.length < 3) {
            alert('El código del producto debe tener al menos 3 caracteres.');
            return;
        }

        // Validar que el código no esté duplicado (excluyendo el producto actual)
        const codigoDuplicado = productos.some(
            (item) => item.id !== id && String(item.codigo).toLowerCase() === codigoNuevo.toLowerCase()
        );

        if (codigoDuplicado) {
            alert('Ya existe otro producto con ese código.');
            return;
        }

        // Actualizar en la Base de Datos
        productDB.update(id, {
            ...formData,
            precio: Number(formData.precio),
            stock: Number(formData.stock),
            stockCritico: formData.stockCritico !== '' ? Number(formData.stockCritico) : null
        });

        alert('¡Producto actualizado con éxito!');
        navigate('/admin/listado'); 
    };

    if (cargando) return <p className="text-center mt-5 text-light">Cargando...</p>;

    return (
        <>
            <EncabezadoAdmin />

            <main className="container-fluid bg-dark text-light py-4">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-3">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/admin" className="text-warning text-decoration-none">Home Admin</Link></li>
                            <li className="breadcrumb-item"><Link to="/admin/listado" className="text-warning text-decoration-none">Listado</Link></li>
                            <li className="breadcrumb-item active text-light">Editar Producto</li>
                        </ol>
                    </nav>

                    <h1 className="text-light mb-4">Editar Producto</h1>

                    <section className="bg-dark p-4 rounded shadow-sm mx-auto border border-secondary" style={{ maxWidth: '800px' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-light">Código</label>
                                    <input type="text" name="codigo" className="form-control bg-dark text-light" value={formData.codigo} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-light">Nombre del Producto</label>
                                    <input type="text" name="producto" className="form-control bg-dark text-light" value={formData.producto} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-light">Precio</label>
                                    <input type="number" step="0.01" min="0" name="precio" className="form-control bg-dark text-light" value={formData.precio} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-light">Marca</label>
                                    <input type="text" name="marca" className="form-control bg-dark text-light" value={formData.marca} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-light">Stock</label>
                                    <input type="number" min="0" name="stock" className="form-control bg-dark text-light" value={formData.stock} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-light">Stock Crítico</label>
                                    <input type="number" min="0" name="stockCritico" className="form-control bg-dark text-light" value={formData.stockCritico || ''} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-light">Categoría</label>
                                    <select name="categoria" className="form-select bg-dark text-light" value={formData.categoria} onChange={handleChange} required>
                                        <option value="">Selecciona</option>
                                        <option value="Manga">Manga</option>
                                        <option value="Comic">Comic</option>
                                        <option value="Figura">Figura</option>
                                        <option value="Accesorio">Accesorio</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-light">Descripción</label>
                                <textarea name="descripcion" rows="3" className="form-control bg-dark text-light" value={formData.descripcion} onChange={handleChange} required></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-light">Cambiar foto (Opcional)</label>
                                <input type="file" accept="image/*" className="form-control bg-dark text-light" onChange={handleFotoChange} />
                                
                                <div className="mt-3">
                                    <p className="text-light mb-1">Imagen actual / Vista previa:</p>
                                    {formData.foto && (
                                        <img src={formData.foto} alt="Vista previa" className="img-fluid rounded" style={{ maxHeight: '200px' }} />
                                    )}
                                </div>
                            </div>
                            
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-warning btn-lg fw-bold">Guardar Cambios</button>
                                <Link to="/admin/listado" className="btn btn-secondary btn-lg">Cancelar</Link>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
}

export default AdminEditarProducto;