# Library Management System

A modern library management system built with React, Node.js, and MongoDB. This system helps libraries manage their resources efficiently while providing an intuitive interface for users.

## Features

- 📚 Book Management
  - View borrowed books
  - Track reading progress
  - Renew books
  - Due date notifications

- 🏢 Space Management
  - Real-time space availability
  - Book study rooms
  - View occupancy stats

- 📊 Dashboard
  - Quick stats overview
  - Activity timeline
  - Upcoming dues
  - Quick actions

- 💳 Fine Management
  - View outstanding fines
  - Online payment
  - Receipt generation

- 📱 Mobile Responsive
  - Optimized for all devices
  - Sidebar collapse support
  - Touch-friendly interface

## Tech Stack

- **Frontend**
  - React
  - TailwindCSS
  - Framer Motion
  - Heroicons
  - date-fns

- **Backend**
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## Getting Started

1. Clone the repository

```
git clone https://github.com/yourusername/library-management.git
cd library-management
```

2. Install dependencies

```
Install frontend dependencies
cd client
npm install

Install backend dependencies
cd ../server
npm install
```

3. Environment Setup

```
In server directory, create .env file
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

In client directory, create .env file
VITE_API_URL=http://localhost:5000/api
```

4. Start Development Servers

```
Start backend server
cd server
npm run dev

Start frontend server
cd client
npm run dev
```

5. Access the application at `http://localhost:5173`

## Project Structure
```
library-management/
├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── utils/
│ │ └── App.jsx
│ └── package.json
└── server/
├── controllers/
├── models/
├── routes/
├── utils/
└── package.json
```


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Heroicons](https://heroicons.com/)