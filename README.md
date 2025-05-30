# VIT Chennai Library Management System

A comprehensive digital library management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd Libathon
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   # Create .env.local with: VITE_API_URL=http://localhost:5000/api
   npm run dev
   ```

### Production Deployment

For detailed deployment instructions, see:
- 📚 [Deployment Guide](DEPLOYMENT.md)
- ✅ [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)

**Quick Deploy:**
- **Frontend**: Deploy to [Vercel](https://vercel.com) [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/libathon&project-name=libathon&root-directory=client)
- **Backend**: Deploy to [Render](https://render.com)

## 🌟 Features

- **User Management**: Student registration, authentication, and profiles
- **Book Management**: Browse, search, and borrow books
- **QR Code Integration**: Quick book scanning and verification
- **Study Spaces**: Reserve discussion rooms and study areas
- **Dashboard**: Personal library analytics and activity tracking
- **Admin Panel**: Comprehensive management tools
- **Fine Management**: Automated fine calculation and payment
- **Mobile Responsive**: Works on all devices

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Chart.js** for analytics
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for image storage
- **Multer** for file uploads
- **bcryptjs** for password hashing

## 📁 Project Structure

```
Libathon/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS files
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── package.json
├── DEPLOYMENT.md         # Deployment guide
└── DEPLOYMENT_CHECKLIST.md  # Deployment checklist
```

## 🔧 Configuration

### Environment Variables

#### Backend (`server/.env`)
```bash
MONGODB_URI=mongodb://localhost:27017/libathon
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (`client/.env.local`)
```bash
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Prerequisites
- MongoDB Atlas account
- Cloudinary account
- Vercel account (for frontend)
- Render account (for backend)

### Deployment Steps
1. Follow the [Deployment Guide](DEPLOYMENT.md)
2. Use the [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
3. Configure environment variables on both platforms
4. Deploy backend to Render
5. Deploy frontend to Vercel
6. Update CORS settings

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests  
cd client
npm test
```

## 📖 API Documentation

The API is RESTful and includes the following main endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/library/books` - Get books with pagination
- `POST /api/library/books` - Add new book (Admin)
- `POST /api/borrow` - Borrow a book
- `GET /api/dashboard/stats` - Get user dashboard data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 [Deployment Guide](DEPLOYMENT.md)
- ✅ [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
- 🐛 [Create an Issue](https://github.com/your-username/libathon/issues)

## 🎯 Production URLs

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`
- **API Health**: `https://your-app.onrender.com/health`

---

Made with ❤️ for VIT Chennai