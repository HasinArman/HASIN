# Pet Healthcare Management System.

A comprehensive healthcare management system for pets, built with Express.js, React.js, and MongoDB, implementing CI/CD pipeline with GitHub Actions.

## 🏥 Project Overview

The Pet Healthcare Management System is a full-stack web application designed to manage pet health records, appointments, and medical history. The system serves three types of users: Administrators, Veterinarians, and Clients.

## ✨ Features

### Backend Features

- **User Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (Admin, Veterinarian, Client)
  - Secure password hashing with bcrypt
  - Session management with httpOnly cookies
- **Pet Management**

  - Complete CRUD operations for pet profiles
  - Species, breed, age, weight tracking
  - Medical history management
  - Vaccination records with due dates
- **Appointment Scheduling**

  - Book appointments with veterinarians
  - View and manage appointment calendar
  - Status tracking (scheduled, completed, cancelled)
  - Appointment notes and history
- **Security Features**

  - Helmet.js for security headers
  - Rate limiting to prevent abuse
  - CORS configuration
  - Input validation with Joi
  - Environment variable management

### Frontend Features

- **Modern React Interface**
  - Responsive design
  - User-friendly dashboard
  - Real-time updates
  - Secure authentication flow

## 🛠 Technology Stack

### Backend

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi schema validation
- **Security**: Helmet, Bcrypt, CORS

### Frontend

- **Framework**: React.js
- **Build Tool**: Vite
- **Styling**: CSS3 / Modern CSS
- **HTTP Client**: Axios / Fetch API

### DevOps & Testing

- **CI/CD**: GitHub Actions
- **Testing**: Jest, Supertest
- **Code Quality**: ESLint
- **Containerization**: Docker, Docker Compose

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas** account (cloud database) or local MongoDB
- **Git** - [Download](https://git-scm.com/download/win)
- **Docker Desktop** (optional, for containerization) - [Download](https://www.docker.com/products/docker-desktop/)

### Git Installation (Windows)

If Git is not recognized in PowerShell:

1. Install Git from: https://git-scm.com/download/win
2. Restart PowerShell after installation
3. Verify installation:
   ```bash
   git --version
   ```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HasinArman/HASIN.git
cd HASIN
```

### 2. MongoDB Atlas Setup (Database)

**Option 1: Using MongoDB Atlas (Recommended for CI/CD)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account or sign in
3. Create a new cluster (Free tier available)
4. Create a database user:
   - Go to Database Access → Add New Database User
   - Username: `pkdevelopers17` (or your choice)
   - Password: Set a strong password
5. Whitelist IP Address:
   - Go to Network Access → Add IP Address
   - For development: Add `0.0.0.0/0` (allows all IPs)
   - For production: Add specific IPs only
6. Get Connection String:
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/pet-healthcare?retryWrites=true&w=majority`

**Option 2: Using Local MongoDB**

```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Use connection string: mongodb://localhost:27017/pet-healthcare
```

### 3. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file (create server/.env file manually)
# Create server/.env file with following content:

# PORT=5000
# MONGODB_URI=mongodb+srv://pkdevelopers17:x9jauedVroZ3qUyA@pkdevelopers.w4clrnu.mongodb.net/pet-healthcare?retryWrites=true&w=majority
# JWT_SECRET=pet-healthcare-secret-key-2024-change-in-production
# CLIENT_ORIGIN=http://localhost:5173
# NODE_ENV=development

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:5000`

### 4. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file (create client/.env file manually)
# Create client/.env file with following content:

# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite default port)

### 5. Using Docker (Alternative)

```bash
# Start MongoDB and API using Docker Compose
docker-compose up -d

# This will start:
# - MongoDB on port 27017
# - API on port 5000
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (Protected)

### Pets

- `POST /api/pets` - Create pet (Protected)
- `GET /api/pets` - Get all pets (Protected)
- `GET /api/pets/:id` - Get pet by ID (Protected)
- `PUT /api/pets/:id` - Update pet (Protected)
- `DELETE /api/pets/:id` - Delete pet (Protected)

### Appointments

- `POST /api/appointments` - Create appointment (Protected)
- `GET /api/appointments` - Get all appointments (Protected)
- `PUT /api/appointments/:id` - Update appointment (Protected)

### Health Check

- `GET /health` - Server health status

## 🧪 Testing

### Run Tests

```bash
# Navigate to server directory
cd server

# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage
```

**Note:** Tests run sequentially (`maxWorkers: 1`) to avoid database conflicts between test suites.

### Run Linter

```bash
# Navigate to server directory
cd server

# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Test Results

- **Test Suites**: 2 total (auth.test.js, pet.test.js)
- **Tests**: 7 total (all passing)
- **Coverage**: Code coverage report generated in `server/coverage/` directory

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The workflow file is located at `.github/workflows/ci-cd.yml`.

### Pipeline Stages

1. **Test Job** (`Run Tests`)
   - Runs on every push and pull request to `main` or `develop` branches
   - Sets up MongoDB service (MongoDB 7)
   - Sets up Node.js (v18)
   - Installs backend dependencies (`npm ci`)
   - Runs ESLint for code quality (`npm run lint`)
   - Executes Jest tests with coverage (`npm test`)
   - Uploads coverage to Codecov
   - **Duration**: ~50 seconds

2. **Build Job** (`Build Application`)
   - Runs after successful test job
   - Validates build process
   - Checks Node.js version compatibility
   - Verifies dependency installation
   - **Duration**: ~15 seconds

3. **Deploy Staging** (`Deploy to Staging`)
   - Automatically deploys on `develop` branch
   - Runs after successful tests and build
   - Currently configured as placeholder (add your deployment commands)

4. **Deploy Production** (`Deploy to Production`)
   - Automatically deploys on `main` branch
   - Runs after successful tests and build
   - Currently configured as placeholder (add your deployment commands)
   - **Duration**: ~11 seconds

### Pipeline Triggers

- **Push to `main`** → Test → Build → Deploy Production
- **Push to `develop`** → Test → Build → Deploy Staging
- **Pull Request** → Test → Build (no deployment)

### View Pipeline Status

1. Go to: https://github.com/HasinArman/HASIN/actions
2. Click on any workflow run to see detailed logs
3. Check individual job status and execution time

### Workflow File Location

- `.github/workflows/ci-cd.yml` - Main CI/CD pipeline configuration

## 📁 Project Structure

```
HASIN/
├── server/                 # Backend application
│   ├── config/            # Configuration files
│   │   └── db.js         # Database connection
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   ├── petController.js
│   │   └── appointmentController.js
│   ├── middlewares/       # Custom middlewares
│   │   ├── auth.js       # Authentication middleware
│   │   └── response.js   # Response helpers
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── Pet.js
│   │   └── Appointment.js
│   ├── routes/           # API routes
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── pet.js
│   │   └── appointment.js
│   ├── tests/            # Test files
│   │   ├── auth.test.js
│   │   └── pet.test.js
│   ├── utils/           # Utility functions
│   │   └── strings.js
│   ├── .env.example     # Environment variables template
│   ├── .eslintrc.js     # ESLint configuration
│   ├── jest.config.js   # Jest configuration
│   ├── package.json     # Dependencies
│   └── server.js        # Entry point
│
├── client/              # Frontend application
│   ├── src/            # Source files
│   ├── public/         # Static files
│   └── package.json    # Dependencies
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml   # CI/CD pipeline configuration
│
├── Dockerfile          # Docker configuration (if using Docker)
├── docker-compose.yml  # Docker Compose configuration (if using Docker)
├── README.md          # This file
└── .cursor/           # Debug logs (development only)
```

## 🔒 Security Features

- **Helmet.js**: Security headers protection
- **Rate Limiting**: Prevents API abuse
- **CORS**: Cross-origin resource sharing configuration
- **JWT Tokens**: Secure authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Joi schema validation
- **Environment Variables**: Secure configuration management

## 📊 Code Quality

- **ESLint**: Code quality and style checking
- **Jest**: Unit and integration testing
- **Code Coverage**: Coverage reports generated automatically
- **Automated Testing**: Runs on every commit via GitHub Actions
- **Sequential Test Execution**: Tests run sequentially to avoid database conflicts (`maxWorkers: 1` in `jest.config.js`)

## 🐳 Docker Support

### Prerequisites

- Docker Desktop installed and running
- Docker Compose installed

### Build Docker Image

```bash
# From project root directory
docker build -t pet-healthcare-api .
```

### Run with Docker Compose

```bash
# Start MongoDB and API services
docker-compose up -d

# View running containers
docker ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Docker Services

- **MongoDB**: Runs on port `27017`
- **API**: Runs on port `5000`

**Note:** Docker Compose uses MongoDB Atlas connection string from environment variables. For local MongoDB, update `docker-compose.yml` with local connection string.

## 🌐 Environment Variables

### Backend (server/.env)

Create `server/.env` file with the following content:

```env
PORT=5000
MONGODB_URI=mongodb+srv://pkdevelopers17:x9jauedVroZ3qUyA@pkdevelopers.w4clrnu.mongodb.net/pet-healthcare?retryWrites=true&w=majority
JWT_SECRET=pet-healthcare-secret-key-2024-change-in-production
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Note:** For production, change `JWT_SECRET` to a strong random string and update `MONGODB_URI` with your production database credentials.

### Frontend (client/.env)

Create `client/.env` file with the following content:

```env
VITE_API_URL=http://localhost:5000/api
```

**Note:** For production, update `VITE_API_URL` to your production API URL.

## 📝 Development Scripts

### Backend (server/)

```bash
# Navigate to server directory first
cd server

npm start          # Start production server
npm run dev        # Start development server with nodemon (auto-reload)
npm test           # Run all tests with coverage
npm run test:watch # Run tests in watch mode
npm run lint       # Check code quality with ESLint
npm run lint:fix   # Auto-fix ESLint issues
```

### Frontend (client/)

```bash
# Navigate to client directory first
cd client

npm run dev        # Start development server (Vite - usually on port 5173)
npm run build      # Build for production (creates dist/ folder)
npm run preview    # Preview production build locally
npm run lint       # Check code quality with ESLint
```

### Project Root

```bash
# From project root (HASIN/)
# Start both backend and frontend (use two terminals)

# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git add .
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request on GitHub

## 📦 Git Commands Reference

### Initial Setup (First Time)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit with CI/CD setup"

# Add remote repository
git remote add origin https://github.com/HasinArman/HASIN.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### Regular Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

### View GitHub Actions

- Repository: https://github.com/HasinArman/HASIN
- Actions: https://github.com/HasinArman/HASIN/actions

## 🔧 Troubleshooting

### Common Issues

#### 1. Git Command Not Found

**Problem:** `git: The term 'git' is not recognized`

**Solution:**
```bash
# Install Git from: https://git-scm.com/download/win
# After installation, restart PowerShell
git --version  # Verify installation
```

#### 2. MongoDB Connection Error

**Problem:** `MongooseServerSelectionError` or `Authentication failed`

**Solutions:**
- Check MongoDB Atlas IP whitelist (Network Access → Add IP Address)
- Verify database username and password
- Ensure connection string includes database name: `...mongodb.net/pet-healthcare?...`
- For local MongoDB: Use `mongodb://localhost:27017/pet-healthcare`

#### 3. Tests Failing

**Problem:** Tests fail with timeout or user not found errors

**Solution:**
- Tests run sequentially (`maxWorkers: 1`) to avoid conflicts
- Ensure MongoDB connection is working
- Check `JWT_SECRET` is set in test environment
- Verify `.env` files exist in both `server/` and `client/` directories

#### 4. Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change PORT in server/.env file
```

#### 5. GitHub Actions Failing

**Problem:** CI/CD pipeline fails

**Solutions:**
- Check workflow logs in GitHub Actions tab
- Verify MongoDB service is running in workflow
- Ensure all environment variables are set correctly
- Check test files for any errors

### Verification Commands

```bash
# Check Node.js version
node --version  # Should be v18 or higher

# Check npm version
npm --version

# Check Git installation
git --version

# Check Docker (if using)
docker --version
docker-compose --version

# Verify MongoDB connection (from server directory)
cd server
npm run dev  # Check for MongoDB connection success message
```

## 📄 License

ISC

## 👥 Authors

Hasin Hamid

## 🙏 Acknowledgments

- Express.js community
- React.js community
- MongoDB documentation
- GitHub Actions documentation

---

**Note**: This project is developed for educational purposes as part of the Management and IT-Consulting in Health Service course (WS25/26).
