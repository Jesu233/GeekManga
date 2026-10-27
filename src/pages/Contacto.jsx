import { useState } from 'react';
import { Link } from 'react-router';
import { PATHS } from '../routes/paths'; // Ajusta la ruta según tus carpetas

function Contacto() {
    // 1. Estados para controlar los campos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        comentario: ''
    });

    // Estado para controlar la alerta (mensaje de éxito o error)
    const [alerta, setAlerta] = useState({
        mostrar: false,
        texto: '',
        tipo: '' // puede ser 'alert-success' o 'alert-danger'
    });

    // 2. Función para actualizar el estado cuando el usuario escribe
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 3. Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // Validación simple (puedes expandirla según lo que te pidan en Duoc)
        if (!formData.nombre.trim() || !formData.comentario.trim()) {
            setAlerta({
                mostrar: true,
                texto: 'Por favor, rellena los campos obligatorios.',
                tipo: 'alert-danger'
            });
            return;
        }

        // Aquí iría tu lógica de envío (ej. llamada a una API o backend)
        console.log('Datos enviados:', formData);

        // Mostrar mensaje de éxito
        setAlerta({
            mostrar: true,
            texto: '¡Mensaje enviado con éxito! Te responderemos a la brevedad.',
            tipo: 'alert-success'
        });

        // Limpiar el formulario
        setFormData({ nombre: '', email: '', comentario: '' });
    };

    return (
        <main className="container my-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {/* Centralizado con PATHS */}
                    <li className="breadcrumb-item"><Link to={PATHS.HOME}>Home</Link></li>
                    <li className="breadcrumb-item active">Contacto</li>
                </ol>
            </nav>

            <h1 className="text-center mb-4">Contáctanos</h1>
            <p className="text-center text-muted mb-5">
                ¿Tienes dudas, sugerencias o algún problema con tu pedido? Escríbenos y te responderemos a la brevedad.
            </p>

            {/* Evento onSubmit conectado a React */}
            <form 
                id="formContacto" 
                onSubmit={handleSubmit}
                className="bg-dark p-4 my-4 rounded shadow-sm mx-auto border border-secondary" 
                style={{ maxWidth: '720px' }}
            >
                {/* Alerta condicional de React reemplazando el d-none de Bootstrap */}
                {alerta.mostrar && (
                    <div className={`alert ${alerta.tipo}`} role="alert">
                        {alerta.texto}
                    </div>
                )}

                <div className="mb-3">
                    {/* 'for' cambiado por 'htmlFor' */}
                    <label htmlFor="nombre" className="form-label text-light">Nombre completo</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        name="nombre" 
                        maxLength="100"
                        className="form-control bg-dark text-light" 
                        value={formData.nombre}
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label text-light">Correo (opcional)</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        maxLength="100"
                        className="form-control bg-dark text-light"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="comentario" className="form-label text-light">Mensaje</label>
                    <textarea 
                        id="comentario" 
                        name="comentario" 
                        maxLength="500" 
                        rows="4"
                        className="form-control bg-dark text-light" 
                        value={formData.comentario}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <button id="btnEnviarContacto" type="submit" className="btn btn-warning btn-lg w-100">
                    Enviar mensaje
                </button>
            </form>
        </main>
    );
}

export default Contacto;
