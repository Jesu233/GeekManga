import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function AdminUsuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    
    // Estado para el formulario
    const [formData, setFormData] = useState({
        id: null,
        nombre: '',
        apellidos: '',
        run: '',
        correo: '',
        password: '',
        tipoUsuario: 'Cliente'
    });

    // 1. Proteger ruta y cargar usuarios
    useEffect(() => {
        const usuarioStr = sessionStorage.getItem("usuarioActivo");
        if (!usuarioStr) {
            navigate('/login');
            return;
        }
        
        let usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        // Aseguramos que el admin exista
        const adminPorDefecto = {
            id: 'admin-1',
            nombre: 'Administrador',
            correo: 'admin@gmail.com',
            password: 'admin123',
            tipoUsuario: 'Administrador'
        };
        if (!usuariosGuardados.some(u => u.correo === adminPorDefecto.correo)) {
            usuariosGuardados.push(adminPorDefecto);
            localStorage.setItem('usuarios', JSON.stringify(usuariosGuardados));
        }
        setUsuarios(usuariosGuardados);
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 2. Guardar o Actualizar Usuario
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.nombre || !formData.correo || !formData.password) {
            alert("El nombre, correo y contraseña son obligatorios.");
            return;
        }

        let nuevosUsuarios;

        if (formData.id) {
            // MODO EDICIÓN
            nuevosUsuarios = usuarios.map(u => 
                u.id === formData.id ? { ...u, ...formData } : u
            );
            alert("Usuario actualizado con éxito");
        } else {
            // MODO CREACIÓN
            if (usuarios.some(u => u.correo === formData.correo.toLowerCase())) {
                alert("Este correo ya está registrado.");
                return;
            }
            const nuevoUsuario = {
                ...formData,
                id: `user-${Date.now()}`,
                correo: formData.correo.toLowerCase()
            };
            nuevosUsuarios = [...usuarios, nuevoUsuario];
            alert("¡Usuario guardado con éxito!");
        }

        localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
        setUsuarios(nuevosUsuarios);
        limpiarFormulario();
    };

    // 3. Eliminar Usuario
    const handleEliminar = (id, correo) => {
        if (correo === 'admin@gmail.com') {
            alert("No puedes eliminar al Administrador principal.");
            return;
        }

        if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
            const filtrados = usuarios.filter(u => u.id !== id);
            localStorage.setItem('usuarios', JSON.stringify(filtrados));
            setUsuarios(filtrados);
        }
    };

    // 4. Editar Usuario
    const handleEditar = (usuario) => {
        setFormData(usuario);
    };

    const limpiarFormulario = () => {
        setFormData({
            id: null, nombre: '', apellidos: '', run: '', correo: '', password: '', tipoUsuario: 'Cliente'
        });
    };

    return (
        <>
            <EncabezadoAdmin />

            <main className="container-fluid bg-dark text-light py-4">
                <div className="container">
                    
                    <nav aria-label="breadcrumb" className="mb-3">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/admin" className="text-warning text-decoration-none">Home Admin</Link></li>
                            <li className="breadcrumb-item active text-light">Usuarios</li>
                        </ol>
                    </nav>

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <div>
                            <h1 className="mb-1">Administración de usuarios</h1>
                            <p className="text-secondary mb-0">Crear, editar y gestionar usuarios del sistema.</p>
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* FORMULARIO */}
                        <div className="col-lg-5">
                            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow-sm border border-secondary">
                                <div className="mb-3">
                                    <label className="form-label text-light">Nombre</label>
                                    <input type="text" name="nombre" className="form-control bg-dark text-light" value={formData.nombre} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-light">Apellidos</label>
                                    <input type="text" name="apellidos" className="form-control bg-dark text-light" value={formData.apellidos} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-light">RUN</label>
                                    <input type="text" name="run" className="form-control bg-dark text-light" value={formData.run} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-light">Correo</label>
                                    <input type="email" name="correo" className="form-control bg-dark text-light" value={formData.correo} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-light">Contraseña</label>
                                    <input type="password" name="password" className="form-control bg-dark text-light" value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-light">Tipo de usuario</label>
                                    <select name="tipoUsuario" className="form-select bg-dark text-light" value={formData.tipoUsuario} onChange={handleChange} required>
                                        <option value="Cliente">Cliente</option>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Vendedor">Vendedor</option>
                                    </select>
                                </div>

                                <div className="d-flex gap-2 flex-wrap">
                                    <button type="submit" className="btn btn-warning">
                                        {formData.id ? 'Actualizar usuario' : 'Guardar usuario'}
                                    </button>
                                    {formData.id && (
                                        <button type="button" onClick={limpiarFormulario} className="btn btn-outline-light">
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* TABLA */}
                        <div className="col-lg-7">
                            <div className="table-responsive bg-dark rounded border border-secondary shadow-sm">
                                <table className="table table-dark table-striped align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Correo</th>
                                            <th>Tipo</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.nombre} {user.apellidos || ''}</td>
                                                <td>{user.correo}</td>
                                                <td>
                                                    <span className="badge bg-secondary">{user.tipoUsuario}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button onClick={() => handleEditar(user)} className="btn btn-warning btn-sm">Editar</button>
                                                        <button onClick={() => handleEliminar(user.id, user.correo)} className="btn btn-danger btn-sm">Eliminar</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}

export default AdminUsuarios;