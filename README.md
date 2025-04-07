# BRCKT.ME

BRCKT.ME is a modern, full-stack social platform that enables seamless content sharing, community building, and real-time interaction. Built with a robust React frontend and Express backend, it offers a responsive, feature-rich experience with Twitter integration, image sharing, and user authentication—all supported by MongoDB for reliable data persistence.

## 🚀 Features

- User authentication and profile management
- Twitter integration
- Real-time updates and notifications
- Image uploading with Cloudinary
- Responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router
- Tailwind CSS
- Vite
- Axios

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- Passport.js for authentication
- Cloudinary for image storage

## 🧰 Project Structure

```
brckt-me/
├── client/             # Frontend React application
│   ├── public/         # Static assets
│   ├── src/            # React source code
│   └── ...
└── server/             # Backend Express API
    ├── config/         # Configuration files
    ├── controllers/    # Request handlers
    ├── middleware/     # Express middleware
    ├── models/         # Mongoose models
    ├── routes/         # API routes
    ├── scripts/        # Utility scripts
    └── server.js       # Entry point
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/hambergjesse/rat-link-platform.git
cd brckt-me
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Configure environment variables
   - Create `.env` files in both client and server directories
   - See `.env.example` files for required variables

4. Start development servers
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm run dev
```

## 🔄 API Endpoints

- `GET /api/users` - Get all users
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/profile/:userId` - Get user profile
- `POST /api/upload` - Upload images

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [Jesse Hamberg](https://github.com/hambergjesse) 