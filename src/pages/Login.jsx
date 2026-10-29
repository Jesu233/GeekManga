import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [alerta, setAlerta] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorEmail('');
        setErrorPassword('');
        setAlerta('');

        let formularioValido = true;

        // 1. Validaciones básicas
        if (!email.trim()) {
            setErrorEmail('El correo es obligatorio.');
            formularioValido = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorEmail('El formato del correo no es válido.');
            formularioValido = false;
        }

        if (!password.trim()) {
            setErrorPassword('La contraseña es obligatoria.');
            formularioValido = false;
        }

        if (!formularioValido) return;

        // 2. Lógica extraída de tu login.js original
        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        } catch (error) {
            usuarios = [];
        }

        const correoNormalizado = email.trim().toLowerCase();
        const passwordIngresada = password;

        // Creamos el admin por defecto si no existe
        const adminPorDefecto = {
            id: 'admin-1',
            nombre: 'Administrador',
            correo: 'admin@gmail.com',
            password: 'admin123',
            tipoUsuario: 'Administrador'
        };

        const existeAdmin = usuarios.some((u) => u.correo === adminPorDefecto.correo);
        if (!existeAdmin) {
            usuarios.push(adminPorDefecto);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }

        // Buscamos al usuario
        const usuario = usuarios.find(
            (u) => u.correo === correoNormalizado && u.password === passwordIngresada
        );

        if (!usuario) {
            setAlerta('Correo o contraseña incorrectos.');
            return;
        }

        // 3. Guardamos la sesión (como en tu JS original, en sessionStorage)
        sessionStorage.setItem(
            'usuarioActivo',
            JSON.stringify({
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                tipoUsuario: usuario.tipoUsuario
            })
        );

        // 4. Redirección según el tipo de usuario
        if (usuario.tipoUsuario === 'Administrador' || usuario.tipoUsuario === 'Vendedor') {
            navigate('/admin'); // En React lo mandamos a nuestra ruta de Admin
        } else {
            navigate('/'); // En React lo mandamos al Home de la tienda
        }
    };

    return (
        <main className="container my-4">
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Iniciar sesión</li>
                </ol>
            </nav>

            <div className="container-login">
                <h2 className="text-center">Inicio de sesión</h2>

                <form 
                    onSubmit={handleSubmit} 
                    noValidate 
                    className="bg-dark p-4 my-4 rounded shadow-sm mx-auto border border-secondary"
                >
                    {alerta && (
                        <div className="alert alert-danger" role="alert">
                            {alerta}
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-light">Correo</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            maxLength="100"
                            className={`form-control bg-dark text-light ${errorEmail ? 'is-invalid' : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        {errorEmail && <div className="invalid-feedback">{errorEmail}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label text-light">Contraseña</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            maxLength="10"
                            className={`form-control bg-dark text-light ${errorPassword ? 'is-invalid' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        {errorPassword && <div className="invalid-feedback">{errorPassword}</div>}
                    </div>

                    <button type="submit" className="btn btn-warning btn-lg w-100">Iniciar sesión</button>
                    
                    <p className="text-light mt-3 mb-0 text-center">
                        ¿No tienes cuenta? <Link to="/registro" className="text-warning">Regístrate aquí</Link>
                    </p>
                </form>
            </div>
        </main>
    );
}

export default Login;