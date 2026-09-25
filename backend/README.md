# ServiceHub Backend

Node.js + Express + MongoDB backend for the ServiceHub React frontend.

## Setup

1. Open this folder in VS Code.
2. Run:
   `npm install`
3. Create `.env` from `.env.example`.
4. Add your MongoDB URI and JWT secret.
5. Run:
   `npm run dev`

Server: http://localhost:5000

## API

Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

Services:
- GET /api/services
- GET /api/services/:id
- POST /api/services (admin)
- PUT /api/services/:id (admin)
- DELETE /api/services/:id (admin)

Bookings:
- POST /api/bookings
- GET /api/bookings/my-bookings
- PUT /api/bookings/:id/cancel
- GET /api/bookings (admin)
- PUT /api/bookings/:id/status (admin)
