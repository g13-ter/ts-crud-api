# TypeScript CRUD API

A RESTful CRUD API built with **Node.js**, **TypeScript**, **Express**, **Sequelize**, and **MySQL**.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + TypeScript | Runtime & language |
| Express.js | Web framework |
| Sequelize | ORM |
| MySQL | Database |
| bcryptjs | Password hashing |
| Joi | Request validation |

---

## Project Structure

```
src/
├── server.ts                  # Entry point
├── _helpers/
│   ├── db.ts                  # Sequelize DB connection, model sync & associations
│   └── role.ts                # Role enum (Admin, User)
├── _middleware/
│   ├── errorHandler.ts        # Global error handler
│   └── validateRequest.ts     # Joi validation middleware
├── accounts/
│   ├── account.model.ts       # accounts table
│   ├── account.service.ts
│   └── accounts.controller.ts
├── departments/
│   ├── department.model.ts    # departments table
│   ├── department.service.ts
│   └── departments.controller.ts
├── employees/
│   ├── employee.model.ts      # employees table (FK → accounts, departments)
│   ├── employee.service.ts
│   └── employees.controller.ts
└── requests/
    ├── request.model.ts       # requests table (FK → employees)
    ├── request.service.ts
    └── requests.controller.ts
```

---

## Database Relationships

```
accounts ──(1)──< employees >──(many)── departments
                     │
                     └──(1)──< requests
```

| Table | Foreign Key | References |
|---|---|---|
| `employees` | `accountId` | `accounts.id` |
| `employees` | `departmentId` | `departments.id` |
| `requests` | `employeeId` | `employees.employeeId` |

> `departments` (Engineering, Marketing) are auto-seeded on first run.

---

## Prerequisites

- Node.js v18+
- MySQL server running locally
- npm

---

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd typescript-crud-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the database**

   Edit `config.json` with your MySQL credentials:
   ```json
   {
     "database": {
       "host": "localhost",
       "port": 3306,
       "user": "your_mysql_user",
       "password": "your_mysql_password",
       "database": "typescript_crud_api"
     },
     "jwtSecret": "your-secret-key"
   }
   ```

4. **Run the server**

   Development mode (with auto-reload):
   ```bash
   npm run start:dev
   ```

   Production build:
   ```bash
   npm run build
   npm start
   ```

   > The database and tables are **auto-created** by Sequelize on startup.

   The server runs on **http://localhost:4000**

---

## API Endpoints

### Accounts — `/accounts`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/accounts` | Get all accounts |
| GET | `/accounts/:id` | Get account by ID |
| POST | `/accounts` | Create a new account |
| PUT | `/accounts/:id` | Update account by ID |
| DELETE | `/accounts/:id` | Delete account by ID |

**POST body:**
```json
{
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "email": "juan@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "User",
  "status": "Active"
}
```

---

### Departments — `/departments`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/departments` | Get all departments |
| GET | `/departments/:id` | Get department by ID |
| POST | `/departments` | Create a new department |
| PUT | `/departments/:id` | Update department by ID |
| DELETE | `/departments/:id` | Delete department by ID |

**POST body:**
```json
{
  "name": "HR",
  "description": "Human Resources department"
}
```

---

### Employees — `/employees`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | Get all employees |
| GET | `/employees/:id` | Get employee by ID |
| POST | `/employees` | Create a new employee |
| PUT | `/employees/:id` | Update employee by ID |
| DELETE | `/employees/:id` | Delete employee by ID |

**POST body:**
```json
{
  "employeeId": "EMP001",
  "accountId": 1,
  "position": "Software Engineer",
  "departmentId": 1,
  "hireDate": "2026-03-13",
  "status": "Active"
}
```

> `accountId` must exist in `accounts` table. `departmentId` must exist in `departments` table.

---

### Requests — `/requests`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/requests` | Get all requests |
| GET | `/requests/:id` | Get request by ID |
| POST | `/requests` | Create a new request |
| PUT | `/requests/:id` | Update request by ID |
| DELETE | `/requests/:id` | Delete request by ID |

**POST body:**
```json
{
  "type": "Supply Request",
  "employeeId": "EMP001",
  "items": [
    { "name": "Ballpen", "qty": 5 },
    { "name": "Notebook", "qty": 2 }
  ],
  "status": "Pending"
}
```

> `employeeId` must exist in `employees` table.

---

## Testing Order

1. `POST /accounts` — create an account, note the `id`
2. `GET /departments` — get department IDs (auto-seeded: id 1 = Engineering, id 2 = Marketing)
3. `POST /employees` — use `accountId` and `departmentId` from steps 1 & 2
4. `POST /requests` — use `employeeId` (string, e.g. `"EMP001"`) from step 3

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Run in development mode with nodemon |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm test` | Run tests |
