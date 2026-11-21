import { useState } from 'react';
import { erroresDeCampos, mensajeDeError } from '../services/api';
import { IMAGEN_POR_DEFECTO } from '../services/formato';
import {
    IMAGENES_DISPONIBLES,
    PRODUCTO_VACIO,
    formularioAProducto,
    validarProducto,
} from '../services/productoFormulario';


/**
 * Formulario de producto (crear y editar).
 * onGuardar recibe el producto listo para el backend y debe devolver una promesa.
 */
function FormularioProducto({ valoresIniciales = PRODUCTO_VACIO, categorias = [], textoBoton, onGuardar, onCancelar }) {
    const [form, setForm] = useState(valoresIniciales);
    const [errores, setErrores] = useState({});
    const [alerta, setAlerta] = useState('');
    const [guardando, setGuardando] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
        if (errores[name]) setErrores({ ...errores, [name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlerta('');
        const nuevosErrores = validarProducto(form);
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length) return;

        setGuardando(true);
        try {
            await onGuardar(formularioAProducto(form));
            if (!onCancelar) setForm(valoresIniciales); // al crear, se limpia el formulario
        } catch (error) {
            setErrores(erroresDeCampos(error));
            setAlerta(mensajeDeError(error, 'No se pudo guardar el producto.'));
        } finally {
            setGuardando(false);
        }
    };

    const campo = (name, label, props = {}) => (
        <div className={props.col ?? 'col-md-6 mb-3'}>
            <label htmlFor={`producto-${name}`} className="form-label">{label}</label>
            <input
                id={`producto-${name}`}
                name={name}
                className={`form-control ${errores[name] ? 'is-invalid' : ''}`}
                value={form[name]}
                onChange={handleChange}
                type={props.type ?? 'text'}
                min={props.type === 'number' ? 0 : undefined}
                maxLength={props.maxLength}
            />
            {errores[name] && <div className="invalid-feedback">{errores[name]}</div>}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} noValidate>
            {alerta && <div className="alert alert-danger" role="alert">{alerta}</div>}

            <div className="row">
                {campo('codigo', 'Código', { maxLength: 50 })}
                {campo('producto', 'Nombre del Producto', { maxLength: 50 })}
                {campo('precio', 'Precio del Producto', { type: 'number' })}
                {campo('marca', 'Marca del producto')}
                {campo('stock', 'Stock', { type: 'number' })}
                {campo('stockCritico', 'Stock crítico', { type: 'number' })}

                <div className="col-md-12 mb-3">
                    <label htmlFor="producto-categoriaId" className="form-label">Categoría</label>
                    <select
                        id="producto-categoriaId"
                        name="categoriaId"
                        className={`form-select ${errores.categoria ? 'is-invalid' : ''}`}
                        value={form.categoriaId}
                        onChange={handleChange}
                    >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((c) => (
                            <option key={c.categoriaId} value={c.categoriaId}>{c.nombreCategoria}</option>
                        ))}
                    </select>
                    {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
                </div>

                <div className="col-md-6 mb-3 d-flex align-items-end">
                    <div className="form-check">
                        <input id="producto-oferta" type="checkbox" name="oferta" className="form-check-input" checked={form.oferta} onChange={handleChange} />
                        <label htmlFor="producto-oferta" className="form-check-label">Producto en oferta</label>
                    </div>
                </div>
                {form.oferta && campo('precioOferta', 'Precio de oferta', { type: 'number' })}

                <div className="col-md-12 mb-3">
                    <label htmlFor="producto-descripcion" className="form-label">Descripción</label>
                    <textarea
                        id="producto-descripcion"
                        name="descripcion"
                        className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                        rows="2"
                        maxLength={300}
                        value={form.descripcion}
                        onChange={handleChange}
                    />
                    {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
                </div>

                <div className="col-md-8 mb-4">
                    <label htmlFor="producto-urlFoto" className="form-label">Imagen del producto</label>
                    <input
                        id="producto-urlFoto"
                        name="urlFoto"
                        list="imagenes-disponibles"
                        className={`form-control ${errores.urlFoto ? 'is-invalid' : ''}`}
                        value={form.urlFoto}
                        onChange={handleChange}
                        placeholder="/images/archivo.jpg o una URL https://..."
                    />
                    <datalist id="imagenes-disponibles">
                        {IMAGENES_DISPONIBLES.map((img) => <option key={img} value={img} />)}
                    </datalist>
                    <small className="text-secondary">Elige una imagen de la tienda o pega la URL de una imagen.</small>
                    {errores.urlFoto && <div className="invalid-feedback">{errores.urlFoto}</div>}
                </div>
                <div className="col-md-4 mb-4 text-center">
                    <img src={form.urlFoto || IMAGEN_POR_DEFECTO} alt="Vista previa" className="img-thumbnail" style={{ maxHeight: '120px' }} />
                </div>
            </div>

            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={guardando}>
                    {guardando ? 'Guardando...' : textoBoton}
                </button>
                {onCancelar && (
                    <button type="button" className="btn btn-outline-light" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default FormularioProducto;
