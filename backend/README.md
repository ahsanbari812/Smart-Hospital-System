# Smart Hospital System Backend

This is the backend API for the Smart Hospital System, built with Node.js, Express, and MySQL.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server

## Setup

1.  **Clone the repository** (if not already done).
2.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Configure Environment Variables**:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Update `.env` with your MySQL credentials and JWT secret.
    - **Important**: Ensure the database `hopsitaldb` exists in your MySQL server. You can create it using:
      ```sql
      CREATE DATABASE hopsitaldb;
      ```

5.  **Run the Server**:
    ```bash
    npm start
    ```
    The server will start on port 5000 (or whatever is defined in `.env`).
    It will automatically sync the database models and create necessary tables.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new patient
- `POST /api/auth/login` - Login (Admin, Doctor, Patient)
- `GET /api/auth/me` - Get current user details

### Admin
- `GET /api/admin/doctors` - List all doctors
- `POST /api/admin/doctors` - Create a new doctor
- `GET /api/admin/patients` - List all patients
- `GET /api/admin/stats` - Dashboard statistics

### Doctor
- `GET /api/doctor/appointments` - View assigned appointments
- `POST /api/doctor/prescriptions` - Create prescription (auto-generates bill)
- `POST /api/doctor/lab-tests` - Recommend lab test
- `POST /api/doctor/lab-tests/:id/result` - Upload lab result (form-data, key: `file`)

### Patient
- `GET /api/patient/appointments` - View my appointments
- `POST /api/patient/appointments` - Book appointment
- `GET /api/patient/prescriptions` - View my prescriptions
- `GET /api/patient/bills` - View my bills

## Folder Structure
- `src/config`: Database configuration
- `src/controllers`: Request handlers
- `src/middleware`: Auth, Role, Upload middlewares
- `src/models`: Sequelize models
- `src/routes`: API routes
- `src/utils`: Helper functions
- `uploads`: Directory for uploaded lab results
