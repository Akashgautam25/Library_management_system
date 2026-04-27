# 📚 Library Management System

A **production-ready full-stack Library Management System** built using modern technologies with clean architecture, scalable design, and real-world features like authentication, transactions, and fine management.

---

## 🌐 Live Demo

- 🚀 **Frontend:** https://library-management-system-wm78.vercel.app/login
- 🔗 **Backend API:** https://library-management-system-1-s08o.onrender.com

---

## 🚀 Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 18, TypeScript, Vite          |
| Backend    | Node.js, Express, TypeScript        |
| Database   | MongoDB (Atlas), Mongoose ODM       |
| Auth       | JWT (JSON Web Tokens), bcryptjs     |
| Validation | express-validator                   |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## ✨ Features

### 👤 Authentication & Roles
- Secure JWT-based login/signup
- Role-based access (Admin / Student)

### 📚 Book Management
- Add, update, delete books (Admin)
- Search & filter by title, author, category

### 🔄 Borrow & Return System
- Issue books with due date
- Return books with automatic status update

### 💸 Fine System
- Automatic fine calculation for overdue books
- Admin can manage fines

### 📊 Dashboards
- **Student Dashboard**
  - Borrowed books
  - History & fines
- **Admin Dashboard**
  - All transactions
  - Overdue tracking
  - User management
  - System stats

---

## 📁 Folder Structure

```bash
library-management-system/
├── backend/
│   ├── src/
│   ├── dist/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── docs/
└── README.md
```

---

## 🏗️ Architecture

```bash
Frontend (React)
   ↓
API Layer (Axios)
   ↓
Backend (Express)
   ↓
Database (MongoDB)
```

---

## ⚙️ Environment Variables

### 🔐 Backend (.env)

```env
PORT=10000
MONGODB_URL=your_mongodb_atlas_url
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
FINE_PER_DAY=2
MAX_BORROW_DAYS=14
```

---

### 🌐 Frontend (.env)

```env
VITE_API_URL=https://YOUR_BACKEND_URL/api
```

---

## 🛠️ Local Setup

### 1️⃣ Clone Repo

```bash
git clone https://github.com/Akashgautam25/Library_management_system.git
cd Library_management_system
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run build
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Overview

| Method | Endpoint | Description |
|-------|---------|------------|
| POST | `/api/auth/login` | Login user |
| GET | `/api/books` | Get all books |
| POST | `/api/transactions/issue` | Borrow book |
| POST | `/api/transactions/return` | Return book |
| GET | `/api/transactions/overdue` | Overdue books |

---

## 📊 System Design Highlights

- Layered Architecture (Controller → Service → Repository)
- SOLID Principles applied
- Strategy Pattern (Fine Calculation)
- JWT-based Authentication
- Scalable MongoDB schema

---

## 👥 Team

| Role | Contributor |
|------|------------|
| Full Stack Developer | Akash Kumar Gautam |
| Frontend Developer | Ansh Sharma |
| Backend Developer | Rahul Kumar Diwedi |
| Database & Architecture | Harender Chhoker |
| Testing & Documentation | Lakshya |

---

## 🎯 Production Deployment

- Frontend deployed on **Vercel**
- Backend deployed on **Render**
- Database hosted on **MongoDB Atlas**

---

## 🎤 Project Summary

> “This is a full-stack SaaS-based library system with role-based access, transaction tracking, and automated fine management, designed using scalable architecture and deployed on cloud platforms.”

---

## ❤️ Built With

React • Node.js • Express • MongoDB • TypeScript

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
