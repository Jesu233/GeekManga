// src/pages/Pago.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { crearBoleta } from '../services/boletaService';
import { mensajeDeError } from '../services/api';
import { formatoPrecio, imagenProducto } from '../services/formato';
import { PATHS } from '../routes/paths';

function Pago() {
    const { carrito, precioTotal, vaciarCarrito } = useCarrito();
    const { usuario } = useAuth();
    const navigate = useNavigate();

    // Datos de entrega. Nombre y correo se completan con los datos de la sesión.
    const [formData, setFormData] = useState({
        nombre: usuario?.nombre ?? '',
        apellido: '',
        correo: usuario?.correo ?? '',
        calle: '',
        departamento: '',
        region: 'Región Metropolitana de Santiago',
        comuna: '',
        indicaciones: ''
    });

    const [errores, setErrores] = useState({});
    const [procesando, setProcesando] = useState(false);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errores[name]) {
            setErrores({ ...errores, [name]: null });
        }
    };

    const validar = () => {
        const nuevosErrores = {};
        if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
        if (!formData.apellido.trim()) nuevosErrores.apellido = 'El apellido es obligatorio';
        if (!formData.correo.trim()) nuevosErrores.correo = 'El correo es obligatorio';
        if (!formData.calle.trim()) nuevosErrores.calle = 'La calle es obligatoria';
        if (!formData.comuna.trim()) nuevosErrores.comuna = 'La comuna es obligatoria';
        if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            nuevosErrores.correo = 'Correo inválido';
        }
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Pago: POST /api/v1/boleta con los productos y cantidades del carrito.
    // El backend valida el stock, calcula el total con los precios reales y descuenta el stock.
    const handlePagar = async (e) => {
        e.preventDefault();
        if (!validar()) return;

        setProcesando(true);
        try {
            const boleta = await crearBoleta(carrito);
            vaciarCarrito();
            navigate(PATHS.PAGO_EXITOSO, { state: { boleta, envio: formData } });
        } catch (error) {
            navigate(PATHS.PAGO_ERROR, {
                state: { mensaje: mensajeDeError(error, 'No se pudo procesar el pago.') },
            });
        } finally {
            setProcesando(false);
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
                            Total a pagar: {formatoPrecio(precioTotal)}
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
                                                src={imagenProducto(item)}
                                                alt={item.producto}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                                            />
                                        </td>
                                        <td>{item.producto}</td>
                                        <td>{formatoPrecio(item.precio)}</td>
                                        <td>{item.cantidad}</td>
                                        <td className="fw-bold">{formatoPrecio(item.precio * item.cantidad)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <form onSubmit={handlePagar} noValidate>
                        <h4 className="mb-3">Información del cliente</h4>
                        <p className="text-muted mb-3">Completa la siguiente información</p>

                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label htmlFor="nombre" className="form-label">Nombre*</label>
                                <input
                                    id="nombre"
                                    type="text"
                                    name="nombre"
                                    className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="apellido" className="form-label">Apellidos*</label>
                                <input
                                    id="apellido"
                                    type="text"
                                    name="apellido"
                                    className={`form-control ${errores.apellido ? 'is-invalid' : ''}`}
                                    value={formData.apellido}
                                    onChange={handleChange}
                                />
                                {errores.apellido && <div className="invalid-feedback">{errores.apellido}</div>}
                            </div>
                            <div className="col-12">
                                <label htmlFor="correo" className="form-label">Correo*</label>
                                <input
                                    id="correo"
                                    type="email"
                                    name="correo"
                                    className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                                    value={formData.correo}
                                    onChange={handleChange}
                                />
                                {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                            </div>
                        </div>

                        <h4 className="mb-3">Dirección de entrega de los productos</h4>
                        <p className="text-muted mb-3">Ingresa la dirección de forma detallada</p>

                        <div className="row g-3 mb-4">
                            <div className="col-md-8">
                                <label htmlFor="calle" className="form-label">Calle*</label>
                                <input
                                    id="calle"
                                    type="text"
                                    name="calle"
                                    className={`form-control ${errores.calle ? 'is-invalid' : ''}`}
                                    value={formData.calle}
                                    onChange={handleChange}
                                />
                                {errores.calle && <div className="invalid-feedback">{errores.calle}</div>}
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="departamento" className="form-label">Departamento (opcional)</label>
                                <input
                                    id="departamento"
                                    type="text"
                                    name="departamento"
                                    className="form-control"
                                    value={formData.departamento}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="region" className="form-label">Región*</label>
                                <select
                                    id="region"
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
                                <label htmlFor="comuna" className="form-label">Comuna*</label>
                                <input
                                    id="comuna"
                                    type="text"
                                    name="comuna"
                                    className={`form-control ${errores.comuna ? 'is-invalid' : ''}`}
                                    value={formData.comuna}
                                    onChange={handleChange}
                                />
                                {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
                            </div>
                            <div className="col-12">
                                <label htmlFor="indicaciones" className="form-label">Indicaciones para la entrega (opcional)</label>
                                <textarea
                                    id="indicaciones"
                                    name="indicaciones"
                                    className="form-control"
                                    rows="2"
                                    value={formData.indicaciones}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="text-end">
                            <button type="submit" className="btn btn-success btn-lg" disabled={procesando}>
                                {procesando ? 'Procesando pago...' : `Pagar ahora ${formatoPrecio(precioTotal)}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Pago;
