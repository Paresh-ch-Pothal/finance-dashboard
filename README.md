# Finance Dashboard Backend

A production-ready backend server built with **Node.js**, **TypeScript**, **Express.js**, and **MongoDB** for finance record management. The system uses **role-based access control** for Admin, Analyst, and Viewer users. It includes JWT authentication, API validation, rate limiting, Swagger documentation, and deployment-ready configuration.

---

## Features

- **Node.js + TypeScript + Express.js** backend server
- **MongoDB** as the database (MongoDB Atlas for production & MongoDB Compass for local development)
- **Role-Based Access Control** (Admin, Analyst, Viewer)
- **JWT Authentication** for secure login and registration
- **Express Validator** for input validation
- **Rate Limiting** to prevent API abuse
- **Middleware** for authentication and role verification
- **Seed Data** functionality using `seedDB.ts`
- **Swagger API Documentation** for easy API testing
- **Environment Configuration** using `.env`
- **Code Modularization** for better readability and maintainability
- **Production Deployment** on Render

---

## User Roles & Permissions

| Role         | Permissions                                                                      |
| ------------ | -------------------------------------------------------------------------------- |
| **Admin**    | Create, update, delete records; manage users; view dashboard, summaries & analytics |
| **Analyst**  | View records, analyze data, generate reports                                     |
| **Viewer**   | Read-only access to records and summaries                                        |

---

## Project Structure

```
server/
│
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose schemas
│   ├── middlewares/    # Auth, role check, validation
│   ├── routes/         # Express routes
│   ├── utils/          # Helpers, error handling
│   ├── seedDB.ts           # SeedDB scripts
│   └── server.ts        # App entry point
│
├── .env                # Environment variables
├── tsconfig.json       # TypeScript config
├── package.json
└── README.md
```

---

## Setup Process

Follow these steps to set up the backend locally and in production.

### 1. Clone the Repository

```bash
git clone https://github.com/Paresh-ch-Pothal/finance-dashboard
cd server
```

### 2. Install Dependencies

```bash
npm install
```

Dependencies include:

| Category          | Packages                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| **Core**          | `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `dotenv`, `cors`      |
| **Validation**    | `express-validator`                                                      |
| **Security**      | `express-rate-limit`                                                     |
| **Docs**          | `swagger-ui-express`                                                     |
| **Dev**           | `typescript`, `ts-node`, `nodemon`                                       |

### 3. Configure Environment Variables

Create a `.env` file in the root of the project:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
```

> - Use **MongoDB Compass** for local development: `mongodb://localhost:27017/finance`
> - Use **MongoDB Atlas** for production.

### 4. Seed Initial Data

Populate the database with initial users and records:

```bash
ts-node src/seed/seedDB.ts
```

### 5. Start the Development Server

```bash
npm run dev
```

- Uses `nodemon` for auto-reloading
- Server runs at `http://localhost:5000`

### 6. Swagger API Documentation

Accessible at (For Development):

```
http://localhost:5000/api-docs
```

For live testing, the server is deployed on Render with MongoDB Atlas:
```
https://finance-dashboard-awg3.onrender.com/api-docs/
```

Execute requests directly via the Swagger UI.

### 7. Deployment on Render

1. Connect your GitHub repository to [Render](https://render.com).
2. Create a new **Web Service**.
3. Set the required environment variables in the Render dashboard.
4. Render will automatically install dependencies and start the server.

---

## API Endpoints

| Endpoint                         | Method   | Access                    |
| ----------------------           | -------- | ------------------------- |
| `/auth/register`                 | `POST`   | Public                    |
| `/auth/login`                    | `POST`   | Public                    |
| `/record/getRecords`             | `GET`    | Viewer, Analyst, Admin    |
| `/record/Summary`                | `GET`    | Viewer , Analyst , Admin  |
| `/record/trends`                 | `GET`    | Analyst , Admin           |
| `/record/createRecord/:id`       | `POST`   | Admin                     |
| `/record/updateRecord/:id`       | `PATCH`  | Admin                     |
| `/record/deleteRecord/:id`       | `DELETE` | Admin                     |
| `/user/getUsers`                 | `GET`    | Admin                     |
| `/user/updateUser:id`            | `PUT`    | Admin                     |
| `/user/deleteUser:id`            | `DELETE` | Admin                     |

---

## Code Quality & Best Practices

| Practice                  | Details                                         |
| ------------------------- | ----------------------------------------------- |
| **Middleware**            | Authentication and role-based access control    |
| **Input Validation**      | Using `express-validator`                       |
| **Rate Limiting**         | Prevents API abuse and spamming                 |
| **JWT Authentication**    | Secure token-based login system                 |
| **Modular Code**          | Controllers, routes, and utilities are separated |
| **Environment Config**    | `.env` files for all secrets                    |
| **Swagger**               | Interactive API testing and documentation       |

---

## Getting Help

If you face any issues:

- Check the `.env` configuration
- Ensure MongoDB is running locally (if using Compass)
- Verify that your `JWT_SECRET` is consistent across environments
- Consult the Swagger UI at `/api-docs` for API request examples

---

## License

This project is open-source and available under the [MIT License](LICENSE).
