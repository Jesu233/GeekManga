import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { erroresDeCampos, mensajeDeError } from '../services/api';

const RUN_REGEX = /^\d{7,8}-[\dkK]$/;

function Registro() {
    const navigate = useNavigate();
    const { registrar } = useAuth();

    // Estado para los campos
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        run: '',
        correo: '',
        password: '',
        confirmarPassword: ''
    });

    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');

        // 1. Validaciones básicas (las mismas reglas que valida el backend)
        if (!formData.nombre.trim() || !formData.run.trim() || !formData.correo.trim() || !formData.password) {
            setError('El nombre, RUN, correo y contraseña son obligatorios.');
            return;
        }
        if (!RUN_REGEX.test(formData.run.trim())) {
            setError('El RUN debe ir sin puntos y con guion, por ejemplo 12345678-9.');
            return;
        }
        if (formData.password.length < 4) {
            setError('La contraseña debe tener al menos 4 caracteres.');
            return;
        }
        if (formData.password !== formData.confirmarPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        // 2. Registro en el backend: POST /api/v1/auth/registro
        //    El backend crea el usuario con rol USER y devuelve sus tokens (queda logueado).
        setEnviando(true);
        try {
            await registrar({
                nombre: formData.nombre.trim(),
                apellidos: formData.apellidos.trim(),
                run: formData.run.trim(),
                correo: formData.correo.trim().toLowerCase(),
                password: formData.password,
            });

            setExito('¡Cuenta creada con éxito! Redirigiendo a la tienda...');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            const campos = erroresDeCampos(err);
            setError(Object.keys(campos).length
                ? Object.values(campos).join('. ')
                : mensajeDeError(err, 'No se pudo crear la cuenta.'));
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main className="container my-4">
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Registrarse</li>
                </ol>
            </nav>

            <div className="container-registrarse">
                <h2 className="text-center mb-4">Crear una cuenta</h2>

                <form onSubmit={handleSubmit} noValidate className="bg-dark p-4 rounded shadow-sm mx-auto border border-secondary" style={{ maxWidth: '600px' }}>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    {exito && <div className="alert alert-success" role="status">{exito}</div>}

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="nombre" className="form-label text-light">Nombre</label>
                            <input id="nombre" type="text" name="nombre" maxLength="25" className="form-control bg-dark text-light" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="apellidos" className="form-label text-light">Apellidos</label>
                            <input id="apellidos" type="text" name="apellidos" maxLength="30" className="form-control bg-dark text-light" value={formData.apellidos} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="run" className="form-label text-light">RUN</label>
                        <input id="run" type="text" name="run" maxLength="10" placeholder="12345678-9" className="form-control bg-dark text-light" value={formData.run} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="correo" className="form-label text-light">Correo Electrónico</label>
                        <input id="correo" type="email" name="correo" maxLength="100" className="form-control bg-dark text-light" value={formData.correo} onChange={handleChange} required />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="password" className="form-label text-light">Contraseña</label>
                            <input id="password" type="password" name="password" className="form-control bg-dark text-light" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="confirmarPassword" className="form-label text-light">Confirmar Contraseña</label>
                            <input id="confirmarPassword" type="password" name="confirmarPassword" className="form-control bg-dark text-light" value={formData.confirmarPassword} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-warning btn-lg w-100 mt-3" disabled={enviando}>
                        {enviando ? 'Creando cuenta...' : 'Registrarse'}
                    </button>

                    <p className="text-light mt-3 mb-0 text-center">
                        ¿Ya tienes cuenta? <Link to="/login" className="text-warning">Inicia sesión aquí</Link>
                    </p>
                </form>
            </div>
        </main>
    );
}

export default Registro;
