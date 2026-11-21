import { useState } from 'react';
import { crearCategoria, eliminarCategoria } from '../services/categoriaService';
import { mensajeDeError } from '../services/api';

/** CRUD rápido de categorías (solo ADMIN). onCambio recarga la lista en la página. */
function GestionCategorias({ categorias, onCambio }) {
    const [nombre, setNombre] = useState('');
    const [mensaje, setMensaje] = useState(null);

    const agregar = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;
        try {
            await crearCategoria(nombre.trim());
            setNombre('');
            setMensaje({ tipo: 'success', texto: 'Categoría creada.' });
            onCambio();
        } catch (error) {
            setMensaje({ tipo: 'danger', texto: mensajeDeError(error) });
        }
    };

    const eliminar = async (categoria) => {
        if (!window.confirm(`¿Eliminar la categoría "${categoria.nombreCategoria}"?`)) return;
        try {
            await eliminarCategoria(categoria.categoriaId);
            setMensaje({ tipo: 'success', texto: 'Categoría eliminada.' });
            onCambio();
        } catch (error) {
            // 409 si la categoría tiene productos
            setMensaje({ tipo: 'danger', texto: mensajeDeError(error) });
        }
    };

    return (
        <section className="bg-dark text-light p-4 rounded border border-secondary mb-5 mx-auto" style={{ maxWidth: '800px' }}>
            <h4 className="text-warning mb-3">Categorías</h4>
            {mensaje && <div className={`alert alert-${mensaje.tipo} py-2`} role={mensaje.tipo === 'danger' ? 'alert' : 'status'}>{mensaje.texto}</div>}

            <form onSubmit={agregar} className="d-flex gap-2 mb-3">
                <label htmlFor="nueva-categoria" className="visually-hidden">Nueva categoría</label>
                <input
                    id="nueva-categoria"
                    className="form-control"
                    placeholder="Nueva categoría"
                    maxLength={50}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <button type="submit" className="btn btn-warning text-nowrap">Agregar categoría</button>
            </form>

            <div className="d-flex flex-wrap gap-2">
                {categorias.map((c) => (
                    <span key={c.categoriaId} className="badge bg-secondary fs-6 d-flex align-items-center gap-2">
                        {c.nombreCategoria}
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            style={{ fontSize: '0.6rem' }}
                            aria-label={`Eliminar categoría ${c.nombreCategoria}`}
                            onClick={() => eliminar(c)}
                        />
                    </span>
                ))}
            </div>
        </section>
    );
}

export default GestionCategorias;
