# Zapatos

Proyecto e-commerce de calzado con dos aplicaciones separadas:

- `backend`: API NestJS + Prisma + PostgreSQL.
- `frontend`: interfaz React + Vite.

El repositorio está organizado como monorepo: un solo Git en la raíz y dos apps desplegables por separado.

## Inicio Rápido desde la Raíz (Monorepo)

```bash
# Instalar todas las dependencias (raíz, backend y frontend)
npm install
npm run install:all

# Iniciar Backend y Frontend en paralelo
npm run dev

# Compilar ambas aplicaciones
npm run build
```

## Backend

```bash
cd backend
npm install
```

Crea `backend/.env` usando `backend/.env.example` como base:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/zapatos_ecommerce"
JWT_SECRET="replace_with_a_long_random_secret"
PORT=3000
```

Comandos:

```bash
npm run build
npm run start:dev
```

Para producción:

```bash
npm run build
npm run start:prod
```

## Frontend

```bash
cd frontend
npm install
```

Crea `frontend/.env` usando `frontend/.env.example` como base:

```env
VITE_API_URL="http://localhost:3000"
```

Comandos:

```bash
npm run dev
npm run build
```

## Despliegue recomendado

Backend:

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm run start:prod`
- Variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`

Frontend:

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Variable: `VITE_API_URL` con la URL pública del backend

## Notas

- No subir archivos `.env`.
- No subir `node_modules` ni `dist`.
- El backend y frontend se despliegan por separado, pero viven juntos en este repositorio.
