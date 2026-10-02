# CRM — React + Spring Boot + MySQL

A full-stack CRM for small businesses.

```
React (Vite, TypeScript, Tailwind)  →  REST API  →  Spring Boot  →  Service  →  Repository  →  JPA/Hibernate  →  MySQL
```

**Current status: Phase 1 (project foundation).** The React shell, the Spring Boot API skeleton, the MySQL connection and `GET /api/health` are working. Login, dashboard data and the CRM modules are added in later phases.

## 1. Requirements

| Tool    | Version                          | Check with       |
|---------|----------------------------------|------------------|
| Java JDK| 17 or newer (21 works)           | `java -version`  |
| Maven   | 3.9 or newer                     | `mvn -version`   |
| Node.js | 20.19+ or 22 LTS (Vite 8 needs this) | `node -v`    |
| MySQL   | 8.0 or newer                     | `mysql --version`|
| Postman | any recent version               |                  |

Maven note: the VS Code Java extensions bring their own Maven for the editor, but `mvn` in the terminal needs a separate install. Easiest on Windows: `winget install Apache.Maven`, then open a **new** terminal.

## 2. Create the database

Open a terminal in the project folder (Windows: PowerShell) and run:

```powershell
mysql -u root -p < database/schema.sql
```

PowerShell does not support `<` redirection. If you get an error, use this instead:

```powershell
mysql -u root -p -e "source database/schema.sql"
```

(Or open `database/schema.sql` in MySQL Workbench and run it.)

## 3. Configure environment variables

```powershell
copy .env.example .env
```

Open `.env` and set at least `DB_PASSWORD` (and `DB_USERNAME` if you don't use `root`). The backend reads this file automatically. `.env` is git-ignored, so your password is never committed.

Frontend (optional, only if the API is not on port 8080):

```powershell
copy frontend\.env.example frontend\.env.local
```

## 4. Start the backend (Spring Boot)

```powershell
cd backend
mvn spring-boot:run
```

Wait for `Started CrmApplication`. Then open <http://localhost:8080/api/health>. You should see:

```json
{ "status": "UP", "application": "crm-backend", "database": "UP", "timestamp": "..." }
```

## 5. Start the frontend (React)

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. The Dashboard shows a **Backend connection** card with live API and MySQL status.

## 6. Test the API with Postman

1. Import `postman/CRM.postman_collection.json`.
2. Run **System → Health check**. Its test script checks for HTTP 200 and `UP` status.
3. From Phase 2 on: run **Auth → Login**. The token is saved to the `{{token}}` variable and every protected request sends it as `Authorization: Bearer <token>` automatically.

## 7. Build for production

```powershell
cd backend
mvn clean package          # produces backend\target\crm-backend-0.1.0.jar
java -jar target\crm-backend-0.1.0.jar

cd ..\frontend
npm run build              # produces frontend\dist
```

## 8. Project layout

```
CRM/
├── frontend/            React + Vite + TypeScript + Tailwind
│   └── src/
│       ├── components/  reusable UI pieces
│       ├── pages/       one file per screen
│       ├── layouts/     app shell (sidebar + top bar)
│       ├── services/    Axios client + API calls
│       ├── hooks/       data-fetching hooks
│       ├── context/     React contexts (toasts now, auth in Phase 2)
│       ├── config/      navigation definition
│       ├── types/       TypeScript types matching API responses
│       └── styles/      legacy.css (original prototype styles) + tokens.css (colour palette)
├── backend/             Spring Boot (Maven)
│   └── src/main/java/com/crm/
│       ├── controller/  HTTP endpoints only
│       ├── service/     business logic
│       ├── repository/  database access (from Phase 2)
│       ├── entity/      JPA entities (from Phase 2)
│       ├── dto/         request/response objects
│       ├── security/    JWT + Spring Security (Phase 2)
│       ├── config/      CORS, beans
│       └── exception/   global error handling
├── database/schema.sql
├── postman/CRM.postman_collection.json
├── .env.example
└── README.md
```

## 9. Common errors

| Symptom | Cause / fix |
|---------|-------------|
| `'mvn' is not recognized` | Maven not installed or terminal opened before install. Install it and open a new terminal. |
| Backend fails at startup with `Communications link failure` or `Access denied for user` | MySQL is not running, or `DB_USERNAME`/`DB_PASSWORD` in `.env` is wrong. Check the MySQL service in Windows Services. |
| `Unknown database 'crm_db'` | Step 2 was skipped. Run `database/schema.sql`. |
| `Port 8080 was already in use` | Set `SERVER_PORT=8081` in `.env` and set `VITE_API_BASE_URL=http://localhost:8081/api` in `frontend/.env.local`. |
| Dashboard says "Cannot reach the server" | Backend not running, wrong port, or `CORS_ALLOWED_ORIGINS` does not include the URL your frontend runs on. |
| Browser console shows a CORS error | Frontend is on a different port than `http://localhost:5173`. Add it to `CORS_ALLOWED_ORIGINS` and restart the backend. |
| `npm run dev` fails with a Node version error | Upgrade Node.js to 20.19+ or 22 LTS. |
| Health shows `"database": "DOWN"` | The API is running but MySQL is not answering. Same fixes as the connection errors above. |

## 10. Roadmap

1. **Phase 1 (this version):** foundation, health check
2. Authentication (register/login/JWT/roles)
3. Dashboard
4. Customers
5. Leads
6. Accounts
7. Deals + Kanban
8. Activities and follow-ups
9. Reports
10. Admin (users, login history)
11. Optimization
12. Final testing
