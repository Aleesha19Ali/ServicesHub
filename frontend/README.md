# ServiceHub Frontend

Beginner-friendly React + Tailwind CSS frontend for a service booking platform.

## Stack

- React
- Vite
- Tailwind CSS v4
- React Router
- Redux Toolkit
- Axios
- Lucide React

## 1. Install

Open terminal inside this folder:

```bash
npm install
```

## 2. Start frontend

```bash
npm run dev
```

Open the URL shown by Vite, usually:

```text
http://localhost:5173
```

## 3. Pages

- `/` - Home
- `/services` - Services list
- `/services/1` - Service details
- `/booking/1` - Booking form
- `/login` - Login
- `/register` - Register
- `/my-bookings` - Customer bookings
- `/admin` - Admin dashboard

## 4. What is static right now?

The service and booking data are hard-coded so that you can first understand the frontend.

Later you will replace:

```text
src/data/services.js
```

with Axios API calls.

## 5. What will become dynamic?

### Services

Static:

```js
import { services } from "../data/services";
```

Later:

```js
const response = await api.get("/services");
```

### Login

Static demo login is inside:

```text
src/pages/Login.jsx
```

Later it becomes:

```js
const response = await api.post("/auth/login", formData);
```

Then save the returned user/token in Redux.

### Bookings

Static booking cards are inside:

```text
src/pages/MyBookings.jsx
```

Later:

```js
const response = await api.get("/bookings/my-bookings");
```

### Admin dashboard

Static numbers are inside:

```text
src/pages/AdminDashboard.jsx
```

Later they come from your dashboard API.

## Recommended next step

Do NOT start backend immediately.

First:

1. Run this frontend.
2. Open every page.
3. Read `App.jsx`.
4. Understand `Navbar.jsx`.
5. Understand `ServiceCard.jsx`.
6. Understand `Services.jsx`.
7. Understand how `useParams()` opens a specific service.
8. Understand how React Router changes pages.
9. Understand Redux `authSlice.js`.
10. Then build your Node/Express backend.
11. Finally replace static data with Axios API calls.

Keep the first version small. Add extra features only after the complete frontend + backend workflow works.
