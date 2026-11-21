import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { mensajeDeError } from '../services/api';
import { ROLES } from '../services/roles';
import { PATHS } from '../routes/paths';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [alerta, setAlerta] = useState('');
    const [enviando, setEnviando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorEmail('');
        setErrorPassword('');
        setAlerta('');

        let formularioValido = true;

        // 1. Validaciones básicas (antes de llamar al backend)
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

        // 2. Login contra el backend: POST /api/v1/auth/login
        //    AuthContext guarda el JWT y los datos del usuario.
        setEnviando(true);
        try {
            const usuario = await login(email.trim().toLowerCase(), password);

            // 3. Redirección: a la página que se quería visitar o según el rol
            const desde = location.state?.desde;
            if (desde) {
                navigate(desde, { replace: true });
            } else if (usuario.rol === ROLES.ADMIN || usuario.rol === ROLES.VENDEDOR) {
                navigate(PATHS.ADMIN);
            } else {
                navigate(PATHS.HOME);
            }
        } catch (error) {
            setAlerta(error?.response?.status === 401
                ? 'Correo o contraseña incorrectos.'
                : mensajeDeError(error));
        } finally {
            setEnviando(false);
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
                            maxLength="100"
                            className={`form-control bg-dark text-light ${errorPassword ? 'is-invalid' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errorPassword && <div className="invalid-feedback">{errorPassword}</div>}
                    </div>

                    <button type="submit" className="btn btn-warning btn-lg w-100" disabled={enviando}>
                        {enviando ? 'Ingresando...' : 'Iniciar sesión'}
                    </button>

                    <p className="text-light mt-3 mb-0 text-center">
                        ¿No tienes cuenta? <Link to="/registro" className="text-warning">Regístrate aquí</Link>
                    </p>
                </form>
            </div>
        </main>
    );
}

export default Login;
