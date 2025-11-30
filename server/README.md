# Server (Phase 2) - Node + MySQL

This folder contains a minimal Node.js backend used to import the CSV dataset into MySQL and expose a simple data endpoint.

Quick steps:

1. Copy `.env.example` to `.env` and set MySQL credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).
2. Ensure MySQL server is running and run the SQL init script to create DB and tables:

   ```powershell
   mysql -u root -p < "server/sql/init.sql"
   ```

   (Adjust user/host as necessary.)

3. Install server dependencies:

   ```powershell
   cd "server"
   npm install
   ```

4. Create sample users (this will hash passwords with bcrypt):

   ```powershell
   npm run create-users
   ```

5. Import the CSV into MySQL:

   ```powershell
   npm run load-data
   ```

6. Start the server:

   ```powershell
   npm start
   ```

API endpoints:

- `GET /api/health` - returns `{ status: 'ok' }`
- `GET /api/data?limit=100` - returns up to `limit` rows from `traffic` table (default 100)

- `POST /api/auth/login` - accepts JSON `{ username, password }`, returns `{ token }` on success. The token is a JWT and is used by the front-end as `Authorization: Bearer <token>`.

Logs are stored in `server/logs/activity.log` and include ISO timestamp, username (or IP) and activity.
