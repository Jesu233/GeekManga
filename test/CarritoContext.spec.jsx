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
