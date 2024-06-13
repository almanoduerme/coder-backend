# Entregas - CoderHouse

## Instrucciones

1. Clonar el repositorio con `git clone`.
2. Instalar las dependencias con `pnpm install`.
3. Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables de entorno:

```typescript
PORT=8080
```

### Ejecutar el servidor con `pnpm dev`

## Endpoints for Products

- **GET /api/products:** Obtiene todos los productos.
- **GET /api/products/:id:** Obtiene un producto por su ID.
- **POST /api/products:** Crea un nuevo producto.
- **PUT /api/products/:id:** Actualiza un producto por su ID.
- **DELETE /api/products/:id:** Elimina un producto por su ID.

## Endpoints for Carts

- **POST /api/cart:** Crea un nuevo carrito.
- **GET /api/cart/:cid:** Obtiene un carrito por su ID.
- **POST /api/cart/:cid/product/:pid:** Agrega un producto a un carrito.

## Endpoints for Handlebars and Socket.io

- **GET /api/products:** Renderiza los productos.
- **GET /realtimeproducts:** Renderiza los productos en tiempo real utilizando Socket.io.
