# GeekManga – Frontend

Tienda online **Geek&Manga** hecha con React 19, Vite, React Router, Bootstrap y **axios**.
Se conecta a la API REST del backend Spring Boot ([GeekMangaBackend](https://github.com/Jesu233/GeekMangaBackend)).

## Cómo levantarlo

1. Levantar primero el backend (queda en `http://localhost:8081`).
2. En esta carpeta:
   ```bash
   npm install
   npm run dev
   ```
3. Abrir `http://localhost:5173`.

La URL de la API se puede cambiar copiando `.env.example` como `.env` y editando `VITE_API_URL`.

### Usuarios de prueba (los crea el backend)

| Rol      | Correo             | Contraseña  |
|----------|--------------------|-------------|
| ADMIN    | admin@gmail.com    | admin123    |
| VENDEDOR | vendedor@gmail.com | vendedor123 |
| USER     | cliente@gmail.com  | cliente123  |

## Tests

```bash
npm test                 # modo watch
npx vitest run           # una vez
npx vitest run --coverage
```

## Integración con el backend

```
Componente React ──> servicio (productoService, boletaService, ...) ──> api.js (axios) ──> API REST Spring Boot
                                                                            │
                        agrega "Authorization: Bearer <token>" ─────────────┘
                        si responde 401, renueva el token con /auth/refresh y reintenta
```

- **`src/services/api.js`**: cliente axios único. Agrega el JWT a cada petición y, si el token expiró (401),
  pide uno nuevo con el refresh token y repite la petición automáticamente. Si la renovación falla, cierra la sesión.
- **`src/services/*Service.js`**: una función por endpoint (`listarProductos`, `crearBoleta`, `actualizarUsuario`, ...).
- **`src/hooks/useApi.js`**: ejecuta una petición y entrega `datos`, `cargando` y `error` para mostrar el estado en pantalla.

| Pantalla | Endpoint |
|---|---|
| Productos / Detalle / Ofertas | `GET /producto`, `GET /producto/buscar/{id}`, `GET /producto/ofertas` |
| Categorías | `GET /categoria`, `GET /producto/categoria/{id}` |
| Login / Registro | `POST /auth/login`, `POST /auth/registro` |
| Pago | `POST /boleta` (solo se envía `productoId` y `cantidad`; el backend calcula precios y stock) |
| Mis compras | `GET /boleta/mis-boletas` |
| Admin – productos | `POST /producto`, `PUT /producto/actualizar/{id}`, `DELETE /producto/eliminar/{id}` |
| Admin – categorías | `POST /categoria`, `DELETE /categoria/eliminar/{id}` |
| Admin – usuarios | `GET/POST /usuario`, `PUT /usuario/actualizar/{id}`, `DELETE /usuario/eliminar/{id}` |
| Admin – boletas | `GET /boleta` |

## Sesión (`src/context/AuthContext.jsx`)

- Al iniciar sesión se guardan el **access token**, el **refresh token** y los datos básicos del usuario
  (nombre, correo, rol) en `localStorage`. Nunca se guarda la contraseña.
- Al recargar la página la sesión se recupera y se **valida contra el backend** con `GET /auth/me`:
  si el token ya no sirve, la sesión se cierra.
- El access token dura 1 hora; cuando vence, `api.js` lo renueva sin que el usuario lo note.
- "Cerrar sesión" borra los tokens.

## Restricciones por rol

`src/components/RutaProtegida.jsx` envuelve las rutas en `App.jsx`:

| Ruta | Quién entra |
|---|---|
| `/pago`, `/pago-exitoso`, `/mis-compras` | cualquier usuario con sesión |
| `/admin`, `/admin/listado`, `/admin/boletas` | ADMIN y VENDEDOR |
| `/admin/agregar-producto`, `/admin/editar-producto/:id`, `/admin/usuarios` | solo ADMIN |

- Sin sesión → redirige a `/login` y, después de iniciar sesión, vuelve a la página que se quería ver.
- Con un rol sin permiso → muestra "Acceso denegado".
- Los menús y botones también se ocultan según el rol (por ejemplo el VENDEDOR ve el listado de productos pero sin Editar/Eliminar).
- La seguridad real está en el backend: aunque alguien modifique el frontend, la API responde 401/403.
