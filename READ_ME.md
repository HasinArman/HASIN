# Pet Healthcare Management System

A comprehensive healthcare management system for pets, built with Express.js and MongoDB, implementing CI/CD pipeline with GitHub Actions.

## Features

- User authentication and authorization (Admin, Veterinarian, Client roles)
- Pet management (CRUD operations)
- Appointment scheduling
- Medical history tracking
- Vaccination records
- RESTful API with JWT authentication

## Technology Stack

-**Backend**: Node.js, Express.js

-**Database**: MongoDB with Mongoose

-**Authentication**: JWT (JSON Web Tokens)

-**Validation**: Joi

-**Testing**: Jest, Supertest

-**CI/CD**: GitHub Actions

-**Code Quality**: ESLint

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository

```bash

gitclone <repository-url>

cdHASIN

```

2. Install dependencies

```bash

cdserver

npminstall

```

3. Set up environment variables

```bash

cp.env.example.env

# Edit .env with your configuration

```

4. Start the server

```bash

npmrundev

```

## API Endpoints

### Authentication

-`POST /api/auth/register` - Register new user

-`POST /api/auth/login` - Login user

-`POST /api/auth/logout` - Logout user

-`GET /api/auth/profile` - Get user profile

### Pets

-`POST /api/pets` - Create pet

-`GET /api/pets` - Get all pets

-`GET /api/pets/:id` - Get pet by ID

-`PUT /api/pets/:id` - Update pet

-`DELETE /api/pets/:id` - Delete pet

### Appointments

-`POST /api/appointments` - Create appointment

-`GET /api/appointments` - Get all appointments

-`PUT /api/appointments/:id` - Update appointment

## Testing

Run tests:

```bash

npmtest

```

Run tests with coverage:

```bash

npmtest----coverage

```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

1.**Test Job**: Runs linter and tests on every push/PR

2.**Build Job**: Validates build process

3.**Deploy Staging**: Auto-deploys to staging on `develop` branch

4.**Deploy Production**: Auto-deploys to production on `main` branch

## Project Structure

```

server/

├── config/          # Database configuration

├── controllers/     # Route controllers

├── middlewares/     # Custom middlewares

├── models/          # Mongoose models

├── routes/          # API routes

├── tests/           # Test files

├── utils/           # Utility functions

└── server.js        # Entry point

```

## License

ISC
