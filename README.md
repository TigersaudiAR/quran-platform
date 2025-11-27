# منصة القرآن الكريم - Quran Learning Platform

A full-stack Quran learning platform built with modern web technologies.

## 🌟 Features

- **📖 Mushaf Viewer**: Browse and read the Quran with a beautiful Arabic RTL interface
- **📈 Memorization Dashboard**: Track your memorization progress with detailed statistics
- **👥 Halaqat (Classes)**: Join and manage Quran learning circles
- **🔐 Authentication**: Role-based access control (Admin, Teacher, Student)

## 🏗️ Project Structure

```
quran-platform/
├── backend/          # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── data/
│   │   └── types/
│   └── package.json
│
└── frontend/         # React + TypeScript + Vite + Tailwind
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── services/
    │   └── types/
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev    # Development
npm run build  # Build
npm start      # Production
```

The API server runs on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev    # Development
npm run build  # Build
npm run preview # Preview build
```

The frontend runs on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Quran
- `GET /api/quran/surahs` - Get all surahs
- `GET /api/quran/surahs/:id` - Get surah by ID
- `GET /api/quran/surahs/:surahId/ayahs` - Get ayahs by surah
- `GET /api/quran/juz/:juzNumber` - Get juz info
- `GET /api/quran/pages/:pageNumber` - Get page info

### Memorization Progress
- `GET /api/progress` - Get user's progress
- `GET /api/progress/stats` - Get progress statistics
- `POST /api/progress` - Create progress record
- `PUT /api/progress/:id` - Update progress
- `DELETE /api/progress/:id` - Delete progress
- `GET /api/progress/student/:studentId` - Get student progress (Teacher/Admin)

### Halaqat (Classes)
- `GET /api/halaqat` - Get halaqat list
- `GET /api/halaqat/:id` - Get halaqah details
- `POST /api/halaqat` - Create halaqah (Teacher/Admin)
- `PUT /api/halaqat/:id` - Update halaqah
- `POST /api/halaqat/:id/students` - Add student
- `DELETE /api/halaqat/:id/students/:studentId` - Remove student
- `DELETE /api/halaqat/:id` - Delete halaqah

## 👤 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@quran-platform.com | admin123 |
| Teacher | teacher@quran-platform.com | teacher123 |
| Student | student@quran-platform.com | student123 |

## 🛠️ Technologies

### Backend
- Node.js + Express
- TypeScript
- JWT Authentication
- In-memory data store

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## 📝 License

ISC
