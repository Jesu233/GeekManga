import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import Pago from '../src/pages/Pago';
import PagoExitoso from '../src/pages/PagoExitoso';
import PagoError from '../src/pages/PagoError';
import MisCompras from '../src/pages/MisCompras';
import * as boletaService from '../src/services/boletaService';
import { useCarrito } from '../src/context/CarritoContext';
import { useAuth } from '../src/context/AuthContext';

vi.mock('../src/services/boletaService');
vi.mock('../src/context/CarritoContext', () => ({ useCarrito: vi.fn() }));
vi.mock('../src/context/AuthContext', () => ({ useAuth: vi.fn() }));

const carrito = [{ id: 1, producto: 'One Piece - Tomo 1', marca: 'Shueisha', precio: 12990, cantidad: 2, stock: 12 }];
const boleta = {
    id: 15, fechaEmision: '2026-11-21T16:40:00', total: 25980,
    detalles: [{ id: 1, cantidad: 2, precioUnitario: 12990, subtotal: 25980, producto: { id: 1, producto: 'One Piece - Tomo 1' } }],
};
const vaciarMock = vi.fn();

const renderPago = () =>
    render(
        <MemoryRouter initialEntries={['/pago']}>
            <Routes>
                <Route path="/pago" element={<Pago />} />
                <Route path="/pago-exitoso" element={<PagoExitoso />} />
                <Route path="/pago-error" element={<PagoError />} />
            </Routes>
        </MemoryRouter>
    );

const completarEnvio = async (user) => {
    await user.type(screen.getByLabelText('Apellidos*'), 'Pérez');
    await user.type(screen.getByLabelText('Calle*'), 'Av. Siempre Viva 742');
    await user.type(screen.getByLabelText('Comuna*'), 'Santiago');
    await user.click(screen.getByRole('button', { name: /pagar ahora/i }));
};

beforeEach(() => {
    vi.clearAllMocks();
    useCarrito.mockReturnValue({ carrito, precioTotal: 25980, vaciarCarrito: vaciarMock });
    useAuth.mockReturnValue({ usuario: { nombre: 'Ana', correo: 'ana@gmail.com', rol: 'USER' } });
});

describe('Pago', () => {
    it('completa nombre y correo con los datos de la sesión', () => {
        renderPago();
        expect(screen.getByLabelText('Nombre*')).toHaveValue('Ana');
        expect(screen.getByLabelText('Correo*')).toHaveValue('ana@gmail.com');
    });

    it('valida los campos de entrega antes de llamar al backend', async () => {
        const user = userEvent.setup();
        renderPago();

        await user.click(screen.getByRole('button', { name: /pagar ahora/i }));

        expect(screen.getByText('La calle es obligatoria')).toBeInTheDocument();
        expect(boletaService.crearBoleta).not.toHaveBeenCalled();
    });

    it('crea la boleta en el backend, vacía el carrito y muestra el detalle real', async () => {
        const user = userEvent.setup();
        boletaService.crearBoleta.mockResolvedValue(boleta);
        renderPago();

        await completarEnvio(user);

        expect(boletaService.crearBoleta).toHaveBeenCalledWith(carrito);
        expect(vaciarMock).toHaveBeenCalled();
        expect(await screen.findByText('¡Pago realizado con éxito!')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();
        expect(screen.getAllByText('$25.980').length).toBeGreaterThan(0);
    });

    it('si no hay stock muestra el mensaje del backend y no vacía el carrito', async () => {
        const user = userEvent.setup();
        boletaService.crearBoleta.mockRejectedValue({
            response: { status: 409, data: { mensaje: 'No hay suficiente stock para el producto: One Piece - Tomo 1' } },
        });
        renderPago();

        await completarEnvio(user);

        expect(await screen.findByText('No hay suficiente stock para el producto: One Piece - Tomo 1')).toBeInTheDocument();
        expect(vaciarMock).not.toHaveBeenCalled();
    });

    it('con el carrito vacío no permite pagar', () => {
        useCarrito.mockReturnValue({ carrito: [], precioTotal: 0, vaciarCarrito: vaciarMock });
        renderPago();
        expect(screen.getByText('Tu carrito está vacío 😢')).toBeInTheDocument();
    });
});

describe('MisCompras', () => {
    it('lista las boletas del usuario', async () => {
        boletaService.misBoletas.mockResolvedValue([boleta]);

        render(<MemoryRouter><MisCompras /></MemoryRouter>);

        expect(await screen.findByText('Boleta N° 15')).toBeInTheDocument();
        expect(screen.getByText('One Piece - Tomo 1 × 2')).toBeInTheDocument();
    });

    it('avisa si todavía no hay compras', async () => {
        boletaService.misBoletas.mockResolvedValue([]);

        render(<MemoryRouter><MisCompras /></MemoryRouter>);

        expect(await screen.findByText(/Todavía no tienes compras/)).toBeInTheDocument();
    });
});
