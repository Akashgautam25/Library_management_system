# 📚 Library Management System

A full-stack Library Management System built with modern web technologies, demonstrating clean architecture, OOP concepts, SOLID principles, and design patterns.

## 🚀 Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 18, TypeScript, Vite          |
| Backend    | Node.js, Express, TypeScript        |
| Database   | MongoDB, Mongoose ODM               |
| Auth       | JWT (JSON Web Tokens), bcryptjs     |
| Validation | express-validator                   |
| HTTP       | Axios (frontend), CORS              |

## ✨ Features

- **User Authentication** — Register/Login with JWT, Admin & Student roles
- **Book Management** — Add, update, delete, search books (admin)
- **Issue / Return Books** — Students can borrow and return books
- **Fine Calculation** — Automatic fine for late returns (Strategy Pattern)
- **Search** — Search by title, author, or category
- **Admin Dashboard** — Stats overview, recent transactions, overdue tracking
- **Borrowing History** — Track all user transactions with status badges

## 📁 Folder Structure

```
library-management-system/
├── backend/
│   ├── src/
│   │   ├── config/         # Database singleton connection
│   │   ├── controllers/    # HTTP request handlers
│   │   ├── factories/      # Factory pattern (repos, strategies)
│   │   ├── interfaces/     # TypeScript interfaces & contracts
│   │   ├── middlewares/     # Auth, role, error, validation
│   │   ├── models/         # Mongoose schemas (User, Book, Transaction)
│   │   ├── repositories/   # Repository pattern (data access layer)
│   │   ├── routes/         # Express route definitions
│   │   ├── services/       # Business logic layer
│   │   ├── strategies/     # Strategy pattern (fine calculation)
│   │   ├── utils/          # Helpers, constants, error classes
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Books/      # BookCard, BookForm
│   │   │   └── Layout/     # Navbar
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── hooks/          # Custom hooks (useBooks, useTransactions)
│   │   ├── pages/          # Page components (7 pages)
│   │   ├── services/       # API service layer (Axios)
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Validators, formatters
│   │   ├── App.tsx         # Main app with routing
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Complete design system
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docs/
│   └── diagrams.md         # UML diagrams (Mermaid)
└── README.md
```

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────────────┐
│             Frontend (React)            │
│  Pages → Components → Hooks → Services │
├─────────────────────────────────────────┤
│        API Layer (Axios + REST)         │
├─────────────────────────────────────────┤
│           Backend (Express)             │
│  Routes → Controllers → Services       │
│          → Repositories → MongoDB       │
├─────────────────────────────────────────┤
│          Database (MongoDB)             │
└─────────────────────────────────────────┘
```

### Design Patterns Used

| Pattern               | Location                     | Purpose                                    |
| --------------------- | ---------------------------- | ------------------------------------------ |
| **Repository**        | `repositories/`              | Abstracts data access from business logic  |
| **Singleton**         | `config/database.ts`         | Single MongoDB connection instance         |
| **Strategy**          | `strategies/FineStrategy.ts` | Swappable fine calculation algorithms      |
| **Factory**           | `factories/index.ts`         | Centralizes object creation                |

### OOP Concepts

- **Encapsulation** — Private fields in Database, password hashing in User model
- **Inheritance** — BaseRepository → concrete repos, AppError → specific errors
- **Polymorphism** — Different fine strategies via same interface
- **Abstraction** — Interfaces define contracts hiding implementation details

### SOLID Principles

- **SRP** — Each service/controller handles one domain concern
- **OCP** — New strategies/repos extend without modifying existing code
- **LSP** — Concrete repos substitute for BaseRepository seamlessly
- **ISP** — IReadRepository and IWriteRepository are separated
- **DIP** — Services depend on abstractions via Factory, not concrete classes

## 🛠️ Setup Instructions

### Prerequisites

- Node.js >= 18
- MongoDB running locally or a MongoDB Atlas URI
- npm or yarn

### 1. Clone & Navigate

```bash
cd library-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
FINE_PER_DAY=2
MAX_BORROW_DAYS=14
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies API calls to `http://localhost:5000`.

## 📡 API Endpoints

### Auth

| Method | Endpoint             | Access | Description       |
| ------ | -------------------- | ------ | ----------------- |
| POST   | `/api/auth/register` | Public | Register new user |
| POST   | `/api/auth/login`    | Public | Login             |
| GET    | `/api/auth/profile`  | Auth   | Get profile       |

### Books

| Method | Endpoint                       | Access | Description      |
| ------ | ------------------------------ | ------ | ---------------- |
| GET    | `/api/books`                   | Public | Get all books    |
| GET    | `/api/books/search?q=`         | Public | Search books     |
| GET    | `/api/books/:id`               | Public | Get book by ID   |
| GET    | `/api/books/category/:cat`     | Public | Filter by category |
| POST   | `/api/books`                   | Admin  | Add book         |
| PUT    | `/api/books/:id`               | Admin  | Update book      |
| DELETE | `/api/books/:id`               | Admin  | Delete book      |

### Transactions

| Method | Endpoint                        | Access | Description           |
| ------ | ------------------------------- | ------ | --------------------- |
| POST   | `/api/transactions/issue`       | Auth   | Issue a book          |
| POST   | `/api/transactions/return`      | Auth   | Return a book         |
| GET    | `/api/transactions/history`     | Auth   | User's history        |
| GET    | `/api/transactions/active`      | Admin  | All active issues     |
| GET    | `/api/transactions/overdue`     | Admin  | Overdue transactions  |
| GET    | `/api/transactions/dashboard`   | Admin  | Dashboard stats       |

### Users

| Method | Endpoint               | Access | Description     |
| ------ | ---------------------- | ------ | --------------- |
| GET    | `/api/users`           | Admin  | Get all users   |
| GET    | `/api/users/students`  | Admin  | Get students    |
| GET    | `/api/users/:id`       | Admin  | Get user by ID  |
| DELETE | `/api/users/:id`       | Admin  | Delete user     |

## 📊 UML Diagrams

See [docs/diagrams.md](docs/diagrams.md) for:
- Class Diagram
- Use Case Diagram
- Sequence Diagram (Book Issue Flow)
- ER Diagram

## 👥 Team Details

| Role | Contributor |
| ---- | ----------- |
| Full Stack Developer | Ansh Sharma |
| Backend Developer | Rahul kumar diwedi |
| Frontend Developer | Akash kumar gautam|
| Database & Architecture | [Member 4 Name] |
| Testing & Documentation | [Member 5 Name] |

---

*Built with ❤️ using React, Node.js, Express, MongoDB, and TypeScript*
