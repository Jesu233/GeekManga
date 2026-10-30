import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { productDB } from '../src/data/BaseDeDatos';
// OJO: import por defecto (sin llaves). Si en tu archivo TarjetaProducto
// aparece "export const TarjetaProducto", vuelve a usar { TarjetaProducto }.
import TarjetaProducto from '../src/components/TarjetaProducto';
import { CarritoProvider } from '../src/context/CarritoContext';
import { MemoryRouter } from 'react-router';

beforeEach(() => {
    localStorage.clear();
});

// Helper para renderizar con el Provider del carrito
const renderConCarrito = (componente) =>
    render(
        <MemoryRouter>
            <CarritoProvider>{componente}</CarritoProvider>
        </MemoryRouter>
    );
const crearProducto = (extra = {}) => ({
    id: 'test-1',
    producto: 'Producto Test',
    precio: 1000,
    stock: 5,
    categoria: 'Test',
    marca: 'Test',
    foto: '/images/test.jpg',
    ...extra,
});

describe('Base de Datos de Productos', () => {
    it('debe devolver todos los productos iniciales', () => {
        const productos = productDB.getAll();
        expect(productos.length).toBeGreaterThan(0);
    });

    it('debe crear un producto nuevo y asignarle un ID', () => {
        const creado = productDB.create({
            producto: 'Halo Infinite',
            precio: 39999,
            marca: 'Microsoft',
            stock: 5,
            categoria: 'Shooter',
            foto: '/images/halo.jpg',
        });

        expect(creado.id).toBeDefined();
        expect(creado.producto).toBe('Halo Infinite');
        expect(productDB.getAll().length).toBeGreaterThan(4);
    });

    it('debe encontrar un producto por su ID', () => {
        const producto = productDB.getById('demo-1');
        expect(producto).toBeDefined();
        expect(producto.producto).toBe('One Piece - Tomo 1');
    });

    it('debe devolver undefined si el ID no existe', () => {
        expect(productDB.getById('id-inexistente')).toBeUndefined();
    });

    it('debe actualizar el stock de un producto', () => {
        const actualizado = productDB.update('demo-1', { stock: 99 });
        expect(actualizado.stock).toBe(99);
        expect(productDB.getById('demo-1').stock).toBe(99);
    });

    it('debe eliminar un producto', () => {
        const antes = productDB.getAll().length;
        productDB.delete('demo-1');

        expect(productDB.getAll().length).toBe(antes - 1);
        expect(productDB.getById('demo-1')).toBeUndefined();
    });
});

// TEST 1: RENDERIZADO CONDICIONAL
describe('Renderizado Condicional', () => {
    it('no debe mostrar el mensaje de "Agotado" si hay stock', () => {
        renderConCarrito(<TarjetaProducto producto={crearProducto({ stock: 5 })} />);

        expect(screen.queryByText(/agotado/i)).not.toBeInTheDocument();
    });

    it('debe mostrar "Agotado" si el stock es 0', () => {
        // Este test solo pasa si TarjetaProducto muestra "Agotado" cuando
        // stock === 0, por ejemplo: {producto.stock === 0 && <span>Agotado</span>}
        renderConCarrito(
            <TarjetaProducto producto={crearProducto({ id: 'test-2', stock: 0 })} />
        );

        expect(screen.getByText(/agotado/i)).toBeInTheDocument();
    });
});

// TEST 2: PROPIEDADES RECIBIDAS
describe('Propiedades Recibidas', () => {
    it('debe mostrar el nombre del producto que recibe por props', () => {
        renderConCarrito(
            <TarjetaProducto
                producto={crearProducto({
                    id: 'test-3',
                    producto: 'One Piece - Tomo 1',
                    precio: 15990,
                })}
            />
        );

        expect(screen.getByText(/One Piece - Tomo 1/)).toBeInTheDocument();
    });

    it('debe mostrar el precio formateado en el DOM', () => {
        renderConCarrito(
            <TarjetaProducto producto={crearProducto({ id: 'test-4', precio: 15990 })} />
        );

        // Separador de miles con punto (formato chileno)
        expect(screen.getByText(/15\.990/)).toBeInTheDocument();
    });
});

// TEST 3: GESTIÓN DEL ESTADO
describe('Gestión del Estado', () => {
    it('debe cambiar el valor de un input cuando el usuario escribe', async () => {
        const FormularioTest = () => {
            const [valor, setValor] = useState('');
            return (
                <>
                    <input
                        data-testid="input-test"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                    />
                    <p data-testid="eco">{valor}</p>
                </>
            );
        };

        const user = userEvent.setup();
        render(<FormularioTest />);

        const input = screen.getByTestId('input-test');
        expect(input).toHaveValue('');

        await user.type(input, 'Hola');

        // Se comprueba el input y también el texto que depende del estado
        expect(input).toHaveValue('Hola');
        expect(screen.getByTestId('eco')).toHaveTextContent('Hola');
    });
});

// TEST 4: SIMULACIÓN DE EVENTOS
describe('Simulación de Eventos', () => {
    it('debe llamar a onClick cuando se hace clic en el botón', async () => {
        const onClick = vi.fn();
        const BotonTest = ({ onClick }) => <button onClick={onClick}>Click me</button>;

        const user = userEvent.setup();
        render(<BotonTest onClick={onClick} />);

        const boton = screen.getByRole('button', { name: 'Click me' });
        await user.click(boton);

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('debe agregar un producto al carrito al hacer clic en "Agregar"', async () => {
        const user = userEvent.setup();
        renderConCarrito(
            <TarjetaProducto
                producto={crearProducto({
                    id: 'test-carrito',
                    producto: 'Producto Carrito',
                    precio: 5000,
                    stock: 3,
                })}
            />
        );

        await user.click(screen.getByRole('button', { name: /agregar/i }));

        // El carrito se persiste en localStorage
        await waitFor(() => {
            expect(localStorage.getItem('geekmanga_carrito')).toContain('test-carrito');
        });
    });
});
