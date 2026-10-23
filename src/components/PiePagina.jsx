import { Link } from 'react-router';

function PiePagina() {
    return (
        <footer className="bg-dark text-light text-center py-4 mt-5">
            <p className="mb-1">Geek&amp;Manga &copy; 2026</p>
            <Link to="/contacto" className="text-light text-decoration-none">
                Contacto
            </Link>
        </footer>
    );
}

export default PiePagina;