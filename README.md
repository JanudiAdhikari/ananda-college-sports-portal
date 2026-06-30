# Ananda College Sports Portal

A full-stack school sports management and information system for Ananda College, Colombo 10, Sri Lanka.

## Main Features

### Public Website

- View school sports
- View teams by sport and age group
- View player profiles
- View fixtures and results
- View live matches and live scores
- View gallery albums and event images
- View featured sports, players, fixtures and albums on the home page

### Admin Panel

- JWT based login
- Role based access control
- Manage sports
- Manage teams
- Manage players
- Manage fixtures and results
- Manage gallery albums and image uploads
- Manage live matches and live scores
- Manage system users

## User Roles

- `SUPER_ADMIN`
- `SPORTS_TEACHER`
- `PHOTO_CLUB`
- `VIDEO_CLUB`

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Multer

## Project Structure

```txt
ananda-college-sports-portal/
├── backend/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── package.json
└── README.md

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd ananda-college-sports-portal
```

### 2. Install dependencies

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 3. Configure backend environment

Create:

```bash
backend/.env
```

Use:

```bash
backend/.env.example
```

as a guide.

### 4. Configure frontend environment

Create:

```bash
frontend/.env
```

Use:

```bash
frontend/.env.example
```

as a guide.

### 5. Seed super admin

```bash
cd backend
npm run seed:admin
```

### 6. Seed sample sports

```bash
npm run seed:sports
```

### 7. Run the project

From the root folder:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

## Default Admin Login

Use the credentials configured in:

```bash
backend/.env
```

Example:

```text
Username: admin
Password: Admin@123456
```

## Deployment Notes

- Frontend can be deployed on Vercel.
- Backend can be deployed on Render.
- MongoDB Atlas is used as the cloud database.
- Cloudinary is used for gallery image storage.

## Important Security Notes

- Do not commit .env files.
- Use strong JWT secrets.
- Use strong admin passwords.
- Rotate credentials if they are accidentally shared.
- Restrict MongoDB Atlas network access before production.

## Step 9: Test everything

Run:

```bash
npm run dev
```

Test:

1. http://localhost:5000/api/health
2. http://localhost:5173
3. Login as admin
4. Open admin dashboard
5. Open one wrong backend URL: http://localhost:5000/api/test-error
6. It should return a clean JSON 404 error
7. Logout and login again