# Hospital Management System (HMS)

A full-stack HMS built with Next.js (App Router) and MongoDB. It includes:
- Roles: Admin, Doctor, User (JWT in HttpOnly cookies)
- Admin-only creation (protected by ADMIN_CREATION_SECRET)
- Doctor approval workflow
- Appointments with conflict prevention
- Prescriptions, reminders (email stub), and virtual doctor (mock predictions)
- Responsive UI, SWR, react-hook-form + Zod validation
- Basic analytics and pagination

## Environment Variables

Set the following in the Vars sidebar:
- MONGODB_URI
- JWT_SECRET
- JWT_REFRESH_SECRET
- ADMIN_CREATION_SECRET
- SENDGRID_API_KEY (optional for email stub)
- FRONTEND_URL (e.g., http://localhost:3000)

## Running

- Publish from v0 or open preview. The backend is implemented via Next.js route handlers.
- Hit POST /api/admin/create with body: { providedSecret, email, password } to create the first admin.
- Optionally seed with: POST /api/admin/seed?secret=ADMIN_CREATION_SECRET

## Notes

- Auth tokens are stored as HttpOnly cookies.
- SWR is used for data fetching on the client.
- Reminder sending is simulated via POST /api/webhook/send-reminders.
- Virtual doctor predictions are mocked with a pluggable adapter (services/ml/llamaAdapter.ts).

## Tests

See scripts folder for simple test scripts (can be executed in v0 scripts runner).
