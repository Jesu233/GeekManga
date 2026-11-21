import { renderHook, act } from '@testing-library/react';
import { CarritoProvider, useCarrito } from '../src/context/CarritoContext';

const STORAGE_KEY = 'geekmanga_carrito';

const manga = { id: 'm1', producto: 'One Piece - Tomo 1', precio: 10000, marca: 'Shueisha' };
const figura = { id: 'f1', producto: 'Figura Luffy', precio: 25000, marca: 'Bandai' };

const wrapper = ({ children }) => <CarritoProvider>{children}</CarritoProvider>;

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('CarritoContext - estado del carrito', () => {
    it('inicia con el carrito vacío y totales en cero', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        expect(result.current.carrito).toEqual([]);
        expect(result.current.cantidadTotal).toBe(0);
        expect(result.current.precioTotal).toBe(0);
    });

    it('agrega un producto nuevo con cantidad 1', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        act(() => result.current.agregarAlCarrito(manga));

        expect(result.current.carrito).toHaveLength(1);
        expect(result.current.carrito[0]).toMatchObject({ id: 'm1', cantidad: 1 });
    });

    it('si el producto ya existe, suma la cantidad en vez de duplicarlo', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        act(() => result.current.agregarAlCarrito(manga));
        act(() => result.current.agregarAlCarrito(manga));

        expect(result.current.carrito).toHaveLength(1);
        expect(result.current.carrito[0].cantidad).toBe(2);
    });

    it('calcula la cantidad total y el precio total', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        act(() => result.current.agregarAlCarrito(manga));
        act(() => result.current.agregarAlCarrito(manga));
        act(() => result.current.agregarAlCarrito(figura));

        // 2 mangas (10.000 c/u) + 1 figura (25.000)
        expect(result.current.cantidadTotal).toBe(3);
        expect(result.current.precioTotal).toBe(45000);
    });

    it('quita solo el producto indicado', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        act(() => result.current.agregarAlCarrito(manga));
        act(() => result.current.agregarAlCarrito(figura));
        act(() => result.current.quitarDelCarrito('m1'));

        expect(result.current.carrito).toHaveLength(1);
        expect(result.current.carrito[0].id).toBe('f1');
    });

    it('vacía el carrito completo', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        act(() => result.current.agregarAlCarrito(manga));
        act(() => result.current.agregarAlCarrito(figura));
        act(() => result.current.vaciarCarrito());

        expect(result.current.carrito).toEqual([]);
        expect(result.current.precioTotal).toBe(0);
    });
});

describe('CarritoContext - reglas con datos del backend', () => {
    it('usa el precio de oferta cuando el producto está en oferta', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        act(() => result.current.agregarAlCarrito({ id: 1, producto: 'OP', precio: 15990, oferta: true, precioOferta: 12990, stock: 5 }));

        expect(result.current.carrito[0]).toMatchObject({ precio: 12990, precioNormal: 15990 });
        expect(result.current.precioTotal).toBe(12990);
    });

    it('no deja agregar más unidades que el stock disponible', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });
        const producto = { id: 2, producto: 'Berserk', precio: 18990, stock: 2 };

        act(() => result.current.agregarAlCarrito(producto));
        act(() => result.current.agregarAlCarrito(producto));
        act(() => result.current.agregarAlCarrito(producto));

        expect(result.current.carrito[0].cantidad).toBe(2);
    });

    it('no agrega productos agotados', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        act(() => result.current.agregarAlCarrito({ id: 3, producto: 'Agotado', precio: 1000, stock: 0 }));

        expect(result.current.carrito).toEqual([]);
    });

    it('disminuirCantidad resta una unidad y quita el producto al llegar a 0', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        act(() => result.current.agregarAlCarrito(manga));
        act(() => result.current.agregarAlCarrito(manga));
        act(() => result.current.disminuirCantidad('m1'));
        expect(result.current.carrito[0].cantidad).toBe(1);

        act(() => result.current.disminuirCantidad('m1'));
        expect(result.current.carrito).toEqual([]);
    });

    it('descarta productos de la versión antigua guardados en localStorage', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([
            { id: 'demo-1', producto: 'Viejo', precio: 100, cantidad: 1 },
            { id: 7, producto: 'Nuevo', precio: 200, cantidad: 1 },
        ]));

        const { result } = renderHook(() => useCarrito(), { wrapper });

        expect(result.current.carrito.map((i) => i.id)).toEqual([7]);
    });
});

describe('CarritoContext - persistencia en localStorage', () => {
    it('guarda el carrito en localStorage cuando cambia', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        act(() => result.current.agregarAlCarrito(manga));

        const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY));
        expect(guardado).toHaveLength(1);
        expect(guardado[0]).toMatchObject({ id: 'm1', cantidad: 1 });
    });

    it('usa un mock de setItem para comprobar que se persiste con la clave correcta', () => {
        const setItemMock = vi.spyOn(Storage.prototype, 'setItem');
        const { result } = renderHook(() => useCarrito(), { wrapper });

        act(() => result.current.agregarAlCarrito(figura));

        expect(setItemMock).toHaveBeenCalledWith(STORAGE_KEY, expect.stringContaining('f1'));
    });

    it('recupera el carrito guardado al iniciar', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([{ ...manga, cantidad: 3 }]));

        const { result } = renderHook(() => useCarrito(), { wrapper });

        expect(result.current.carrito).toHaveLength(1);
        expect(result.current.cantidadTotal).toBe(3);
        expect(result.current.precioTotal).toBe(30000);
    });
});

describe('useCarrito - uso fuera del Provider', () => {
    it('lanza un error si se usa sin CarritoProvider', () => {
        // Silenciamos el console.error que React escribe al fallar el render
        vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => renderHook(() => useCarrito())).toThrow(
            'useCarrito debe usarse dentro de CarritoProvider'
        );
    });
});
