import { useState } from 'react';
import { Link } from 'react-router';
import EncabezadoAdmin from '../components/EncabezadoAdmin';
import EstadoCarga from '../components/EstadoCarga';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { listarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../services/usuarioService';
import { erroresDeCampos, mensajeDeError } from '../services/api';
import { NOMBRE_ROL, ROLES } from '../services/roles';
import { PATHS } from '../routes/paths';

const FORM_VACIO = {
    usuarioId: null,
    nombre: '',
    apellidos: '',
    run: '',
    correo: '',
    password: '',
    tipoUsuario: ROLES.USER,
};

const COLOR_ROL = { ADMIN: 'bg-danger', VENDEDOR: 'bg-info text-dark', USER: 'bg-secondary' };

// Solo ADMIN (protegida en App.jsx y en el backend)
function AdminUsuarios() {
    const { usuario: actual } = useAuth();
    const { datos: usuarios, cargando, error, recargar } = useApi(listarUsuarios);

    const [formData, setFormData] = useState(FORM_VACIO);
    const [errores, setErrores] = useState({});
    const [mensaje, setMensaje] = useState(null);
    const [guardando, setGuardando] = useState(false);

    const editando = formData.usuarioId !== null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errores[name]) setErrores({ ...errores, [name]: null });
    };

    const validar = () => {
        const e = {};
        if (!formData.nombre.trim()) e.nombre = 'El nombre es obligatorio';
        if (!/^\d{7,8}-[\dkK]$/.test(formData.run.trim())) e.run = 'RUN sin puntos y con guion (12345678-9)';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo.trim())) e.correo = 'Correo inválido';
        if (!editando && formData.password.length < 4) e.password = 'Mínimo 4 caracteres';
        if (editando && formData.password && formData.password.length < 4) e.password = 'Mínimo 4 caracteres';
        setErrores(e);
        return Object.keys(e).length === 0;
    };

    const limpiarFormulario = () => {
        setFormData(FORM_VACIO);
        setErrores({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);
        if (!validar()) return;

        const datos = {
            nombre: formData.nombre.trim(),
            apellidos: formData.apellidos.trim(),
            run: formData.run.trim(),
            correo: formData.correo.trim().toLowerCase(),
            password: formData.password || null,
            tipoUsuario: formData.tipoUsuario,
        };

        setGuardando(true);
        try {
            if (editando) {
                await actualizarUsuario(formData.usuarioId, datos);   // PUT /usuario/actualizar/{id}
                setMensaje({ tipo: 'success', texto: 'Usuario actualizado.' });
            } else {
                await crearUsuario(datos);                            // POST /usuario
                setMensaje({ tipo: 'success', texto: 'Usuario creado.' });
            }
            limpiarFormulario();
            recargar();
        } catch (err) {
            setErrores(erroresDeCampos(err));
            setMensaje({ tipo: 'danger', texto: mensajeDeError(err, 'No se pudo guardar el usuario.') });
        } finally {
            setGuardando(false);
        }
    };

    const handleEditar = (u) => {
        setFormData({
            usuarioId: u.usuarioId,
            nombre: u.nombre ?? '',
            apellidos: u.apellidos ?? '',
            run: u.run ?? '',
            correo: u.correo ?? '',
            password: '',
            tipoUsuario: u.tipoUsuario ?? ROLES.USER,
        });
        setErrores({});
        setMensaje(null);
    };

    const handleEliminar = async (u) => {
        if (!window.confirm(`¿Seguro que quieres eliminar a ${u.correo}?`)) return;
        try {
            await eliminarUsuario(u.usuarioId);                         // DELETE /usuario/eliminar/{id}
            setMensaje({ tipo: 'success', texto: 'Usuario eliminado.' });
            recargar();
        } catch (err) {
            setMensaje({ tipo: 'danger', texto: mensajeDeError(err, 'No se pudo eliminar el usuario.') });
        }
    };

    const input = (name, label, type = 'text', extra = {}) => (
        <div className="mb-3">
            <label htmlFor={`usuario-${name}`} className="form-label text-light">{label}</label>
            <input
                id={`usuario-${name}`}
                type={type}
                name={name}
                className={`form-control bg-dark text-light ${errores[name] ? 'is-invalid' : ''}`}
                value={formData[name]}
                onChange={handleChange}
                {...extra}
            />
            {errores[name] && <div className="invalid-feedback">{errores[name]}</div>}
        </div>
    );

    return (
        <>
            <EncabezadoAdmin />

            <main className="container-fluid bg-dark text-light py-4">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-3">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to={PATHS.ADMIN} className="text-warning text-decoration-none">Home Admin</Link></li>
                            <li className="breadcrumb-item active text-light">Usuarios</li>
                        </ol>
                    </nav>

                    <div className="mb-4">
                        <h1 className="mb-1">Administración de usuarios</h1>
                        <p className="text-secondary mb-0">Crear, editar y gestionar usuarios del sistema.</p>
                    </div>

                    {mensaje && <div className={`alert alert-${mensaje.tipo}`} role={mensaje.tipo === 'danger' ? 'alert' : 'status'}>{mensaje.texto}</div>}

                    <div className="row g-4">
                        {/* FORMULARIO */}
                        <div className="col-lg-5">
                            <form onSubmit={handleSubmit} noValidate className="bg-dark p-4 rounded shadow-sm border border-secondary">
                                <h5 className="text-warning mb-3">{editando ? 'Editar usuario' : 'Nuevo usuario'}</h5>
                                {input('nombre', 'Nombre', 'text', { maxLength: 25 })}
                                {input('apellidos', 'Apellidos', 'text', { maxLength: 30 })}
                                {input('run', 'RUN', 'text', { maxLength: 10, placeholder: '12345678-9' })}
                                {input('correo', 'Correo', 'email', { maxLength: 100 })}
                                {input('password', editando ? 'Contraseña (dejar vacía para no cambiarla)' : 'Contraseña', 'password')}

                                <div className="mb-3">
                                    <label htmlFor="usuario-tipoUsuario" className="form-label text-light">Tipo de usuario</label>
                                    <select
                                        id="usuario-tipoUsuario"
                                        name="tipoUsuario"
                                        className="form-select bg-dark text-light"
                                        value={formData.tipoUsuario}
                                        onChange={handleChange}
                                        disabled={editando && formData.usuarioId === actual?.usuarioId}
                                    >
                                        <option value={ROLES.USER}>{NOMBRE_ROL.USER}</option>
                                        <option value={ROLES.VENDEDOR}>{NOMBRE_ROL.VENDEDOR}</option>
                                        <option value={ROLES.ADMIN}>{NOMBRE_ROL.ADMIN}</option>
                                    </select>
                                </div>

                                <div className="d-flex gap-2 flex-wrap">
                                    <button type="submit" className="btn btn-warning" disabled={guardando}>
                                        {guardando ? 'Guardando...' : editando ? 'Actualizar usuario' : 'Guardar usuario'}
                                    </button>
                                    {editando && (
                                        <button type="button" onClick={limpiarFormulario} className="btn btn-outline-light">
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* TABLA */}
                        <div className="col-lg-7">
                            <EstadoCarga cargando={cargando && !usuarios} error={error} onReintentar={recargar} texto="Cargando usuarios..." />

                            {usuarios && (
                                <div className="table-responsive bg-dark rounded border border-secondary shadow-sm">
                                    <table className="table table-dark table-striped align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Correo</th>
                                                <th>RUN</th>
                                                <th>Tipo</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usuarios.map((u) => {
                                                const esYo = u.usuarioId === actual?.usuarioId;
                                                return (
                                                    <tr key={u.usuarioId}>
                                                        <td>{u.nombre} {u.apellidos || ''} {esYo && <span className="badge bg-warning text-dark">Tú</span>}</td>
                                                        <td>{u.correo}</td>
                                                        <td>{u.run}</td>
                                                        <td>
                                                            <span className={`badge ${COLOR_ROL[u.tipoUsuario] || 'bg-secondary'}`}>
                                                                {NOMBRE_ROL[u.tipoUsuario] || u.tipoUsuario}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button onClick={() => handleEditar(u)} className="btn btn-warning btn-sm">Editar</button>
                                                                {!esYo && (
                                                                    <button onClick={() => handleEliminar(u)} className="btn btn-danger btn-sm">Eliminar</button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default AdminUsuarios;
