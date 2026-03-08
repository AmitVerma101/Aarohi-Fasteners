# Backend API

Minimal Node.js HTTP API with a file-based JSON database.

## Run

From `backend/`:

- `npm start` to start backend on `http://localhost:4000`
- `npm run dev` to start backend with auto-reload (nodemon)

`npm run dev` (or `nodemon` in `backend/`) uses `nodemon.json`, which ignores `data/db.json` changes so create/delete operations do not restart the API server.

## Env vars

- `API_PORT` (default `4000`)
- `ADMIN_TOKEN` (default `change-me`)

## Endpoints

- `GET /api/health`
- `GET /api/products`
- `GET /api/products?featured=true`
- `GET /api/categories`
- `POST /api/categories` (requires `x-admin-token`)
- `PUT /api/categories/:id` (requires `x-admin-token`)
- `DELETE /api/categories/:id` (requires `x-admin-token`, also deletes products in that category)
- `POST /api/products` (requires `x-admin-token`)
- `PUT /api/products/:id` (requires `x-admin-token`)
- `DELETE /api/products/:id` (requires `x-admin-token`)

Notes:
- Product payload supports `imageData` (base64 data URL), `imageName`, `isBestChoice`, and `description`.
- Uploaded product images are stored under `backend/assets/products/<category-slug>/...`.
