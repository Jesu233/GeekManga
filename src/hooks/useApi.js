import { useCallback, useEffect, useState } from 'react';
import { mensajeDeError } from '../services/api';

/**
 * Ejecuta una función que llama a la API y entrega { datos, cargando, error, codigoError, recargar }.
 * Ejemplo: const { datos: productos, cargando, error } = useApi(listarProductos);
 *
 * @param {Function} peticion función que devuelve una promesa (por ejemplo listarProductos)
 * @param {Array} dependencias valores que, al cambiar, vuelven a ejecutar la petición
 */
export function useApi(peticion, dependencias = []) {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [codigoError, setCodigoError] = useState(null); // status HTTP del error (404, 403, ...)
    const [intento, setIntento] = useState(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const ejecutar = useCallback(peticion, dependencias);

    useEffect(() => {
        let vigente = true; // evita actualizar el estado si el componente ya se desmontó
        Promise.resolve()
            .then(() => {
                if (!vigente) return null;
                setCargando(true);
                setError('');
                setCodigoError(null);
                return ejecutar();
            })
            .then((resultado) => {
                if (vigente) setDatos(resultado);
            })
            .catch((err) => {
                if (vigente) {
                    setError(mensajeDeError(err, 'No se pudo cargar la información.'));
                    setCodigoError(err?.response?.status ?? null);
                }
            })
            .finally(() => {
                if (vigente) setCargando(false);
            });
        return () => {
            vigente = false;
        };
    }, [ejecutar, intento]);

    const recargar = useCallback(() => setIntento((n) => n + 1), []);

    return { datos, cargando, error, codigoError, recargar, setDatos };
}
