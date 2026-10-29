import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { productDB } from '../data/BaseDeDatos';
import EncabezadoAdmin from '../components/EncabezadoAdmin'; // 👈 Importamos el menú de admin

function AdminAgregarProducto() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    
    // Estado para el formulario
    const [formData, setFormData] = useState({
        codigo: '',
        producto: '',
        precio: '',
        marca: '',
        stock: '',
        stockCritico: '',
        categoria: 'Manga',
        descripcion: '',
        foto: '/images/onepiece.jpg' // Imagen por defecto
    });

    // 1. Protegemos la ruta y cargamos productos
    useEffect(() => {
        const usuarioStr = sessionStorage.getItem("usuarioActivo");
        if (!usuarioStr) {
            navigate('/login');
            return;
        }
        setProductos(productDB.getAll());
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.producto || !formData.precio) {
            alert("El nombre y el precio son obligatorios");
            return;
        }

        // Usamos tu base de datos
        productDB.create({
            ...formData,
            precio: Number(formData.precio),
            stock: Number(formData.stock),
            stockCritico: Number(formData.stockCritico)
        });

        alert("¡Producto agregado con éxito!");
        
        setProductos(productDB.getAll());
        setFormData({
            codigo: '', producto: '', precio: '', marca: '',
            stock: '', stockCritico: '', categoria: 'Manga',
            descripcion: '', foto: '/images/onepiece.jpg'
        });
    };

    const handleEliminar = (id) => {
        if(window.confirm("¿Seguro que quieres eliminar este producto?")) {
            productDB.delete(id); 
            setProductos(productDB.getAll()); 
        }
    };

    return (
        <>
            <EncabezadoAdmin /> {/* 👈 Agregamos el menú de admin aquí */}

            {/* Fondo oscuro que cubre toda la pantalla */}
            <main className="container-fluid bg-dark text-light min-vh-100 py-4">
                <div className="container">
                    
                    <nav aria-label="breadcrumb" className="mb-3">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/admin" className="text-warning text-decoration-none">Home Admin</Link></li>
                            <li className="breadcrumb-item active text-light">Productos</li>
                        </ol>
                    </nav>

                    <h1 className="mb-4 text-light">Productos</h1>

                    {/* FORMULARIO ESTILO OSCURO */}
                    <section className="bg-dark text-light p-4 rounded border border-secondary mb-5 mx-auto" style={{ maxWidth: '800px' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Código</label>
                                    <input type="text" name="codigo" className="form-control" value={formData.codigo} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nombre del Producto</label>
                                    <input type="text" name="producto" className="form-control" value={formData.producto} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Precio del Producto</label>
                                    <input type="number" name="precio" className="form-control" value={formData.precio} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Marca del producto</label>
                                    <input type="text" name="marca" className="form-control" value={formData.marca} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Stock</label>
                                    <input type="number" name="stock" className="form-control" value={formData.stock} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Stock crítico</label>
                                    <input type="number" name="stockCritico" className="form-control" value={formData.stockCritico} onChange={handleChange} />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label className="form-label">Categoría</label>
                                    <select name="categoria" className="form-select" value={formData.categoria} onChange={handleChange}>
                                        <option value="Manga">Manga</option>
                                        <option value="Comic">Cómic</option>
                                        <option value="Figura">Figura</option>
                                    </select>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label className="form-label">Descripción</label>
                                    <textarea name="descripcion" className="form-control" rows="2" value={formData.descripcion} onChange={handleChange}></textarea>
                                </div>
                                <div className="col-md-12 mb-4">
                                    <label className="form-label">Foto del producto</label>
                                    <input type="file" className="form-control" disabled />
                                    <small className="text-muted">Para esta demo usaremos imágenes por defecto.</small>
                                </div>
                            </div>
                            {/* Botón azul igual al de tu captura */}
                            <button type="submit" className="btn btn-primary">Subir producto</button>
                        </form>
                    </section>

                    {/* LISTA DE PRODUCTOS REGISTRADOS */}
                    <h2 className="text-light mb-4">Productos Registrados</h2>
                    <div className="row g-4">
                        {productos.map((prod) => (
                            <div className="col-md-4" key={prod.id}>
                                <div className="card bg-secondary text-light border-0 h-100 shadow-sm">
                                    <img src={prod.foto} className="card-img-top" alt={prod.producto} style={{ height: '250px', objectFit: 'cover' }} />
                                    <div className="card-body bg-dark">
                                        <h5 className="card-title">{prod.producto}</h5>
                                        <p className="small mb-1">Código: {prod.codigo}</p>
                                        <p className="small mb-1">Precio: ${prod.precio?.toLocaleString('es-CL')}</p>
                                        <p className="small mb-1">Stock: {prod.stock}</p>
                                        
                                        <div className="d-flex gap-2 mt-3">
                                            <button className="btn btn-warning btn-sm w-50">Editar</button>
                                            <button onClick={() => handleEliminar(prod.id)} className="btn btn-danger btn-sm w-50">Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}

export default AdminAgregarProducto;