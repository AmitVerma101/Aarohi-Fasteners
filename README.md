# Project Structure

- `frontend/` Next.js client app
- `backend/` Node.js API with file-based JSON DB

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

## Run backend

```bash
cd backend
npm install
npm run dev
```

Set `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Set `backend/.env` (optional if defaults are okay):

```bash
API_PORT=4000
ADMIN_TOKEN=change-me
```
