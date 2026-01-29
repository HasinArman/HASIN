# Pet Healthcare Management System

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
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HASIN
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/pet-healthcare
# JWT_SECRET=your-secret-key-change-in-production
# CLIENT_ORIGIN=http://localhost:3000
# NODE_ENV=development

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Using Docker (Alternative)

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
cd server
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Linter

```bash
npm run lint
```

### Fix Linting Issues

```bash
npm run lint:fix
```

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

### Pipeline Stages

1. **Test Job**
   - Runs on every push and pull request
   - Sets up MongoDB service
   - Runs ESLint for code quality
   - Executes Jest tests with coverage
   - Uploads coverage to Codecov

2. **Build Job**
   - Validates build process
   - Checks Node.js version compatibility
   - Verifies dependency installation

3. **Deploy Staging**
   - Automatically deploys on `develop` branch
   - Runs after successful tests and build
   - Deploys to staging environment

4. **Deploy Production**
   - Automatically deploys on `main` branch
   - Runs after successful tests and build
   - Deploys to production environment

### Pipeline Triggers

- Push to `main` → Production deployment
- Push to `develop` → Staging deployment
- Pull Request → Validation only (no deployment)

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
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
└── README.md          # This file
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
- **Code Coverage**: 85%+ coverage target
- **Automated Testing**: Runs on every commit

## 🐳 Docker Support

### Build Docker Image

```bash
docker build -t pet-healthcare-api .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

## 🌐 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pet-healthcare
JWT_SECRET=your-secret-key-change-in-production
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 Development Scripts

### Backend

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run test:watch # Run tests in watch mode
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

### Frontend

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC

## 👥 Authors

[Your Name]

## 🙏 Acknowledgments

- Express.js community
- React.js community
- MongoDB documentation
- GitHub Actions documentation

---

**Note**: This project is developed for educational purposes as part of the Management and IT-Consulting in Health Service course (WS25/26).
