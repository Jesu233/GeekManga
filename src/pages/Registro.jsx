import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

function Registro() {
    const navigate = useNavigate();
    
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setExito('');

        // 1. Validaciones básicas
        if (!formData.nombre || !formData.correo || !formData.password) {
            setError('El nombre, correo y contraseña son obligatorios.');
            return;
        }

        if (formData.password !== formData.confirmarPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        // 2. Leer usuarios existentes del localStorage
        let usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];

        // 3. Verificar que el correo no esté registrado
        const correoNormalizado = formData.correo.trim().toLowerCase();
        if (usuariosGuardados.some(u => u.correo === correoNormalizado)) {
            setError('Este correo ya está registrado. Intenta iniciar sesión.');
            return;
        }

        // 4. Crear el nuevo usuario Cliente
        const nuevoUsuario = {
            id: `user-${Date.now()}`,
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            run: formData.run,
            correo: correoNormalizado,
            password: formData.password,
            tipoUsuario: 'Cliente' // Por defecto, todos los que se registran aquí son clientes
        };

        // 5. Guardar en la "base de datos"
        usuariosGuardados.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuariosGuardados));

        // 6. Mostrar éxito y redirigir al login
        setExito('¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...');
        
        setTimeout(() => {
            navigate('/login');
        }, 2000);
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

                <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow-sm mx-auto border border-secondary" style={{ maxWidth: '600px' }}>
                    
                    {error && <div className="alert alert-danger">{error}</div>}
                    {exito && <div className="alert alert-success">{exito}</div>}

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-light">Nombre</label>
                            <input type="text" name="nombre" className="form-control bg-dark text-light" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-light">Apellidos</label>
                            <input type="text" name="apellidos" className="form-control bg-dark text-light" value={formData.apellidos} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-light">RUN</label>
                        <input type="text" name="run" className="form-control bg-dark text-light" value={formData.run} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-light">Correo Electrónico</label>
                        <input type="email" name="correo" className="form-control bg-dark text-light" value={formData.correo} onChange={handleChange} required />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-light">Contraseña</label>
                            <input type="password" name="password" className="form-control bg-dark text-light" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-light">Confirmar Contraseña</label>
                            <input type="password" name="confirmarPassword" className="form-control bg-dark text-light" value={formData.confirmarPassword} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-warning btn-lg w-100 mt-3">Registrarse</button>
                    
                    <p className="text-light mt-3 mb-0 text-center">
                        ¿Ya tienes cuenta? <Link to="/login" className="text-warning">Inicia sesión aquí</Link>
                    </p>
                </form>
            </div>
        </main>
    );
}

export default Registro;