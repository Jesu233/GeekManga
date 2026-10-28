// src/pages/Checkout.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCarrito } from '../context/CarritoContext';
import { PATHS } from '../routes/paths';

function Checkout() {
    const { carrito, precioTotal, vaciarCarrito } = useCarrito();
    const navigate = useNavigate();

    // Datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        calle: '',
        departamento: '',
        region: 'Región Metropolitana de Santiago',
        comuna: '',
        indicaciones: ''
    });

    // Manejo de errores visuales
    const [errores, setErrores] = useState({});

    // Si el carrito está vacío, no permitimos comprar
    if (carrito.length === 0) {
        return (
            <main className="container my-5 text-center">
                <h2>Tu carrito está vacío 😢</h2>
                <Link to="/productos" className="btn btn-warning mt-3">
                    Ir a la tienda
                </Link>
            </main>
        );
    }

    // Actualizar campos
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Limpiar error del campo que se está editando
        if (errores[name]) {
            setErrores({ ...errores, [name]: null });
        }
    };

    // Validar formulario
    const validar = () => {
        const nuevosErrores = {};
        if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
        if (!formData.apellido.trim()) nuevosErrores.apellido = 'El apellido es obligatorio';
        if (!formData.correo.trim()) nuevosErrores.correo = 'El correo es obligatorio';
        if (!formData.calle.trim()) nuevosErrores.calle = 'La calle es obligatoria';
        if (!formData.comuna.trim()) nuevosErrores.comuna = 'La comuna es obligatoria';
        
        // Validación simple de email
        if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            nuevosErrores.correo = 'Correo inválido';
        }
        
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Simular pago
    const handlePagar = (e) => {
        e.preventDefault();

        if (!validar()) return;

        // Simulamos un pago: si el correo contiene "error", falla
        const pagoExitoso = !formData.correo.toLowerCase().includes('error');

        if (pagoExitoso) {
            // Guardar orden de compra (simulada)
            const orden = {
                id: `ORD-${Date.now()}`,
                fecha: new Date().toISOString(),
                cliente: formData,
                items: carrito,
                total: precioTotal
            };
            localStorage.setItem('geekmanga_ultima_orden', JSON.stringify(orden));
            
            vaciarCarrito();
            navigate(PATHS.PAGO_EXITOSO);
        } else {
            navigate(PATHS.PAGO_ERROR);
        }
    };

    return (
        <main className="container my-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/carrito">Carrito</Link></li>
                    <li className="breadcrumb-item active">Checkout</li>
                </ol>
            </nav>

            <div className="card shadow-sm">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">Carrito de compra</h2>
                        <span className="badge bg-primary fs-6">
                            Total a pagar: ${precioTotal.toLocaleString('es-CL')}
                        </span>
                    </div>

                    {/* Resumen de productos */}
                    <div className="table-responsive mb-4">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <img
                                                src={item.foto}
                                                alt={item.producto}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                                            />
                                        </td>
                                        <td>{item.producto}</td>
                                        <td>${item.precio.toLocaleString('es-CL')}</td>
                                        <td>{item.cantidad}</td>
                                        <td className="fw-bold">
                                            ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <form onSubmit={handlePagar}>
                        <h4 className="mb-3">Información del cliente</h4>
                        <p className="text-muted mb-3">Completa la siguiente información</p>

                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label className="form-label">Nombre*</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Apellidos*</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    className={`form-control ${errores.apellido ? 'is-invalid' : ''}`}
                                    value={formData.apellido}
                                    onChange={handleChange}
                                />
                                {errores.apellido && <div className="invalid-feedback">{errores.apellido}</div>}
                            </div>
                            <div className="col-12">
                                <label className="form-label">Correo*</label>
                                <input
                                    type="email"
                                    name="correo"
                                    className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                                    value={formData.correo}
                                    onChange={handleChange}
                                />
                                {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                                <small className="text-muted">
                                    Tip para probar: si el correo contiene la palabra "error", el pago fallará.
                                </small>
                            </div>
                        </div>

                        <h4 className="mb-3">Dirección de entrega de los productos</h4>
                        <p className="text-muted mb-3">Ingresa la dirección de forma detallada</p>

                        <div className="row g-3 mb-4">
                            <div className="col-md-8">
                                <label className="form-label">Calle*</label>
                                <input
                                    type="text"
                                    name="calle"
                                    className={`form-control ${errores.calle ? 'is-invalid' : ''}`}
                                    value={formData.calle}
                                    onChange={handleChange}
                                />
                                {errores.calle && <div className="invalid-feedback">{errores.calle}</div>}
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Departamento (opcional)</label>
                                <input
                                    type="text"
                                    name="departamento"
                                    className="form-control"
                                    value={formData.departamento}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Región*</label>
                                <select
                                    name="region"
                                    className="form-select"
                                    value={formData.region}
                                    onChange={handleChange}
                                >
                                    <option>Región Metropolitana de Santiago</option>
                                    <option>Región de Valparaíso</option>
                                    <option>Región del Biobío</option>
                                    <option>Región de La Araucanía</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Comuna*</label>
                                <input
                                    type="text"
                                    name="comuna"
                                    className={`form-control ${errores.comuna ? 'is-invalid' : ''}`}
                                    value={formData.comuna}
                                    onChange={handleChange}
                                />
                                {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
                            </div>
                            <div className="col-12">
                                <label className="form-label">Indicaciones para la entrega (opcional)</label>
                                <textarea
                                    name="indicaciones"
                                    className="form-control"
                                    rows="2"
                                    value={formData.indicaciones}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="text-end">
                            <button type="submit" className="btn btn-success btn-lg">
                                Pagar ahora ${precioTotal.toLocaleString('es-CL')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Checkout;