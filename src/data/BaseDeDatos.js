
import { initialProducts, initialCategories } from './DatosIniciales';

const KEYS = {
    PRODUCTS: 'geekmanga_products',
    CATEGORIES: 'geekmanga_categories'
};

// Utilidades de Storage
const getStorageData = (key, defaultValue) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
};

const setStorageData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Fábrica de CRUD Genérico
const createCRUD = (key, initialData) => {
  // Inicializar si no existe en localStorage
    if (!localStorage.getItem(key)) {
        setStorageData(key, initialData);
    }

return {
    // READ (Todos)
    getAll: () => getStorageData(key, initialData),
    
    // READ (Uno)
    getById: (id) => {
        const items = getStorageData(key, initialData);
        return items.find(item => item.id === id);
    },
    
    // CREATE
    create: (newItem) => {
        const items = getStorageData(key, initialData);
      // Generamos un ID único (para mezclar con tus string 'demo-1')
        const newId = `new-${Date.now()}`;
        const itemToSave = { ...newItem, id: newId };
        const updatedItems = [...items, itemToSave];
        setStorageData(key, updatedItems);
        return itemToSave;
    },
    
    // UPDATE
    update: (id, updatedFields) => {
        const items = getStorageData(key, initialData);
        const updatedItems = items.map(item => 
            item.id === id ? { ...item, ...updatedFields } : item
    );
        setStorageData(key, updatedItems);
        return updatedItems.find(item => item.id === id);
    },
    
    // DELETE
    delete: (id) => {
        const items = getStorageData(key, initialData);
        const filteredItems = items.filter(item => item.id !== id);
        setStorageData(key, filteredItems);
        return true;
    }
    };
};

// Exportamos nuestras "Tablas"
export const productDB = createCRUD(KEYS.PRODUCTS, initialProducts);
export const categoryDB = createCRUD(KEYS.CATEGORIES, initialCategories);