# StockSense Authentication

A standalone React and Express authentication module. The React client is at the repository root; the independent API and MongoDB model live in `server/`. No inventory workflows are included.

## Requirements

- Node.js 20.19+ (Vite 8 requirement) and npm
- A MongoDB database, local or hosted
- SMTP email credentials to deliver password-reset codes

## Setup

1. Copy `.env.example` to `.env` in the project root.
2. Set `MONGODB_URI` to your MongoDB connection string. For local MongoDB, a typical value is `mongodb://127.0.0.1:27017/stocksense`.
3. Replace `JWT_SECRET` with a unique random secret of at least 32 characters. Keep `.env` private.
4. Configure `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASSWORD`. For Gmail, enable 2-Step Verification and create an App Password; use that App Password, not your normal Gmail password. Mailtrap can be used for development instead. The email implementation is isolated in `server/utils/emailService.js` so another provider can replace it.
5. Keep `CLIENT_URL` aligned with the frontend origin and `VITE_API_URL` aligned with the backend API base URL.
6. Install frontend dependencies with `npm install`, then backend dependencies with `npm install --prefix server`.

## Run

Start MongoDB, then run the API in one terminal:

```sh
npm run server:dev
```

Run the React frontend in a second terminal:

```sh
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). For a production API process, use `npm run server:start`.

## Test the Authentication Flow

1. Open `/signup`, create an account with a name, valid email, and a password of at least 8 characters containing a letter and a number. A duplicate email is rejected.
2. Sign in at `/login`. The API sets an HttpOnly JWT cookie and the client navigates to `/dashboard`.
3. Open `/profile` and refresh `/dashboard`. The app calls `/api/auth/me` to restore the session. In a private window, directly opening either route redirects to `/login`.
4. Use **Log out**, then try `/dashboard` again. Logout clears the cookie and increments the user's token version, invalidating the old JWT.
5. Choose **Forgot password?**, submit a registered email, and check the mailbox configured for SMTP. The response does not reveal the OTP or whether an account exists.
6. Enter the emailed six-digit code on `/verify-otp` before its 10-minute expiry. Resend requests a new code; five incorrect code attempts consume the code.
7. Set and confirm a new password on `/reset-password`. The reset requires a recently verified OTP, then returns you to `/login`.
8. Sign in with the new password to confirm the reset.

If the API cannot connect to MongoDB, verify the URI, network access, and database service. If reset email does not arrive, check the API terminal for the provider error and verify SMTP host, port, username, and app password. OTPs are never included in API responses.

## Architecture

- `src/App.jsx` defines the public auth pages and protected dashboard/profile routes.
- `src/context/AuthContext.jsx` owns user state, startup session restoration, login, signup, and logout.
- `src/components/ProtectedRoute.jsx` gates protected pages and preserves the requested destination.
- `src/pages/` contains each focused authentication screen plus the dashboard placeholder and profile.
- `src/services/api.js` configures the single Axios client, including the API base URL and cookie credentials.
- `src/services/authService.js` contains all auth API calls, keeping URLs out of page components.
- `server/server.js` configures Express security middleware, CORS, request parsing, routing, database startup, and errors.
- `server/config/db.js` opens the MongoDB connection.
- `server/models/User.js` defines account data, role options, password hashing, and password comparison.
- `server/routes/authRoutes.js` defines endpoints, validation, and rate limits.
- `server/controllers/authController.js` contains registration, login, session, and OTP reset behavior.
- `server/middleware/` contains JWT checks, validation/error handling, async route handling, and origin checks.
- `server/utils/emailService.js` sends branded reset email through SMTP and can be swapped for another provider.

## API Summary

All endpoints are under `/api/auth`: `POST /register`, `POST /login`, `GET /me`, `POST /logout`, `POST /forgot-password`, `POST /resend-otp`, `POST /verify-otp`, and `POST /reset-password`. Responses use `{ success, message, ... }`; user responses never include password hashes. Browser authentication uses a SameSite, HttpOnly cookie; API clients may also send a bearer token to protected endpoints.

## Integrating into a Teammate's MERN App

Copy the relevant files from `server/` (model, routes, controllers, middleware, email utility, DB connection) and the frontend `src/context`, `src/components/ProtectedRoute.jsx`, `src/services`, and auth `src/pages`. Merge `server/server.js` middleware and route mounting into the existing Express entry point instead of running a second server. Add the frontend routes and wrap the existing app in `AuthProvider`; set `VITE_API_URL` to the integrated API base. Align the existing User schema/model, role names, cookie/CORS origins, and secret configuration before deployment. Do not copy environment credentials into source control.# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
