
export const initialProducts = [
    {
        id: 'demo-1',
        codigo: 'M001',
        producto: 'One Piece - Tomo 1',
        precio: 15990,
        marca: 'Shueisha',
        stock: 12,
        stockCritico: 5,
        categoria: 'Manga',
        oferta: true,
        precioOferta: 1100990,
        descripcion: 'Primera edición del clásico manga de Eiichiro Oda.',
        foto: '/images/onepiece.jpg' 
    },
    {
        id: 'demo-2',
        codigo: 'F001',
        producto: 'Figura Naruto',
        precio: 24990,
        marca: 'Banpresto',
        stock: 8,
        stockCritico: 3,
        categoria: 'Figura',
        oferta: false,
        precioOferta: 200990,
        descripcion: 'Figura coleccionable del personaje Naruto Uzumaki.',
        foto: '/images/naruto.jpg'
    },
    {
        id: 'demo-3',
        codigo: 'C001',
        producto: 'Comic Marvel - Spider-Man',
        precio: 12990,
        marca: 'Marvel',
        stock: 10,
        stockCritico: 4,
        categoria: 'Comic',
        oferta: true,
        precioOferta: 50990,
        descripcion: 'Edición especial de Spider-Man para coleccionistas.',
        foto: '/images/spiderman.jpg' 
    },
    {
        id: 'demo-4',
        codigo: 'M002',
        producto: 'Berserk - Tomo 1',
        precio: 18990,
        marca: 'Panini',
        stock: 3, 
        stockCritico: 5,
        categoria: 'Manga',
        oferta: false,
        precioOferta: 122990,
        descripcion: 'Obra maestra de Kentaro Miura.',
        foto: '/images/berserk.jpg' 
    }
];

export const initialCategories = [
    { id: 1, nombre: 'Manga' },
    { id: 2, nombre: 'Figura' },
    { id: 3, nombre: 'Comic' }
];