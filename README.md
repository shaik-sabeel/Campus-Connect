# Campus Connect - MERN Stack Application

A comprehensive campus event management and networking platform built with the MERN stack.

## Features

- 🔐 **Authentication**: Secure user registration and login with JWT tokens and cookies
- 📅 **Event Management**: Create, discover, and manage campus events
- 👥 **User Profiles**: Comprehensive user profiles with interests and achievements
- 🔒 **Protected Routes**: Secure access to dashboard, events, and profile pages
- 📱 **Responsive Design**: Mobile-first responsive design for all devices
- 🎨 **Modern UI**: Beautiful, modern interface with smooth animations

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin requests

### Frontend
- **React 18** with Vite
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **React Hook Form** for form handling

## Project Structure

```
Campus-Connect/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── services/        # Business logic
│   └── app.js          # Express app configuration
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/campus-connect
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_BASE_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile (protected)
- `GET /users/logout` - User logout (protected)

### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get single event
- `POST /events` - Create event (protected)
- `PUT /events/:id` - Update event (protected)
- `DELETE /events/:id` - Delete event (protected)
- `POST /events/:id/join` - Join event (protected)
- `POST /events/:id/leave` - Leave event (protected)
- `GET /events/user/events` - Get user's events (protected)

## Key Features Implemented

### Authentication System
- JWT-based authentication with secure cookies
- Password hashing with bcrypt
- Protected routes with middleware
- Session management with token blacklisting

### Event Management
- Full CRUD operations for events
- Event categorization and tagging
- Attendee management
- Search and filtering capabilities

### User Interface
- Responsive design for all screen sizes
- Modern UI with Tailwind CSS
- Smooth animations with Framer Motion
- Form validation and error handling

### Security
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Secure password requirements
- Protected API endpoints

## Usage

1. **Registration**: Users can register with their campus information
2. **Login**: Secure login with email and password
3. **Dashboard**: Personalized dashboard with upcoming events and statistics
4. **Events**: Browse, search, and filter campus events
5. **Create Events**: Users can create and manage their own events
6. **Profile**: Manage user profile and view achievements

## Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

### Building for Production

Backend:
```bash
cd backend
npm run build
```

Frontend:
```bash
cd frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
