# 🐯 Openclaw Web Dashboard

A highly responsive and beautifully designed Full-Stack Web Application for managing eCommerce/store operations. Built with modern UI aesthetics in mind (Glassmorphism, vibrant gradients, and dynamic animations) combined with a robust Node.js REST API backend.

---

## 🌟 Key Features

### 🖥️ Frontend (React + Vite)
- **Stunning UI/UX**: Premium dashboard with glassmorphism, fluid animations (Lucide Icons), and clean typography.
- **Full CRUD Capabilities**: Add, Edit, Delete, and View interfaces fully hooked up for `Products`, `Categories`, `Brands`, `Users`, and `Orders`.
- **Advanced Stock Management**: Dedicated Stock History & Inventory Adjustment Panel (Add / Remove / Restock limits).
- **Authentication**: JWT-based login mechanism with route protection and session persistence.
- **Instant Search & Filters**: Client-side filtering implementation across all data tables.

### ⚙️ Backend (Node.js + Express)
- **Robust API**: RESTful architecture, built using Express.js and Mongoose.
- **Security First**: Password hashing using `bcryptjs`, and robust JWT token generation using `jsonwebtoken`. Rate limiting applied securely.
- **Smart Validation**: MongoDB Schema constraints with specialized sanitization logic (e.g. Thai language URL-Slug parsing fallbacks).
- **Dockerized Database**: Seamless integration with MongoDB running inside a lightweight Docker container.
- **Auto-Seeding System**: Automatically detects an empty database and generates a root admin account to ensure immediate access.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Vanilla CSS (Custom Design System), Lucide-React
- **Backend**: Node.js, Express, Mongoose, CORS, Express-Rate-Limit
- **Database**: MongoDB (via Docker Desktop)
- **Version Control & Tooling**: Git, Nodemon

---

## 🚀 Getting Started

Follow these steps to get the Openclaw development environment running on your local machine.

### 1. Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Must be running before starting the backend)

### 2. Start the Database (MongoDB in Docker)
Open a terminal in the root project folder and run:
```bash
docker-compose up -d
```
> *This will download the MongoDB image and start it in the background at `mongodb://localhost:27017`.*

### 3. Start the Backend API
Open a new terminal, navigate to the `backend` folder:
```bash
cd backend
npm install
npm run dev
```
> *The backend will start at `http://localhost:5000`. If this is the first time running it, a default admin account will be automatically created.*

### 4. Start the Frontend Application
Open a new terminal, navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
> *The frontend will instantly start up at `http://localhost:5173`.*

---

## 🔐 Default Credentials

Upon standard setup with an empty database, you can log in using:
- **Email**: `admin@openclaw.com`
- **Password**: `password123`

*(It is highly advised to immediately update this password via the Users panel or add your own master admin.)*

---

## 📁 Project Structure

```text
Web_Openclaw/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic and request handlers
│   │   ├── middleware/       # JWT and auth protection validations
│   │   ├── models/           # Mongoose schemas (Products, Users, etc.)
│   │   ├── routes/           # Defined API endpoints
│   │   ├── index.js          # Main entry points
│   │   └── app.js            # Express app and CORS configuration
│   └── .env                  # Backend Secrets (JWT_SECRET, Ports)
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable layout UI (Sidebar, Header)
│   │   ├── pages/            # Feature-driven UI Modules (Products, Categories)
│   │   ├── services/         # API fetching logic mapped to Backend endpoints
│   │   ├── utils/            # Helper formats (Currency handling)
│   │   └── index.css         # Global design tokens and animations
│   └── .env                  # Environment Variables (VITE_API_URL)
│
└── docker-compose.yml        # Docker blueprint for MongoDB Services
```

---

*Made with ❤️ for smooth operations.*
