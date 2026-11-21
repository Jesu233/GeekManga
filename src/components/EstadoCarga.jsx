/**
 * Muestra el estado de una petición a la API: cargando o error (con botón para reintentar).
 * Si no está cargando ni hay error, no muestra nada.
 */
function EstadoCarga({ cargando, error, onReintentar, texto = 'Cargando...' }) {
    if (cargando) {
        return (
            <div className="text-center my-5" role="status">
                <div className="spinner-border text-warning" />
                <p className="mt-2 text-muted">{texto}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center my-4" role="alert">
                <p className="mb-2">{error}</p>
                {onReintentar && (
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={onReintentar}>
                        Reintentar
                    </button>
                )}
            </div>
        );
    }

    return null;
}

export default EstadoCarga;
