import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { Toaster } from 'react-hot-toast'
import Library from './pages/Library'
import BookDetails from './pages/BookDetails'
import MyBooks from './pages/MyBooks'
import BorrowedBookDetails from './pages/BorrowedBookDetails'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import QrGenerator from './pages/QrGenerator'
import Users from './pages/Users'
import Issues from './pages/Issues'
import AdminProfile from './pages/AdminProfile'
import StudySpaces from './pages/StudySpaces'
import Fines from './pages/Fines'
import Feedback from './pages/Feedback'

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/library/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
          <Route path="/mybooks" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
          <Route path="/mybooks/:bookId" element={<ProtectedRoute><BorrowedBookDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/spaces" element={<ProtectedRoute><StudySpaces /></ProtectedRoute>} />
          <Route path="/fines" element={<ProtectedRoute><Fines /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="qr-generator" element={<QrGenerator />} />
          <Route path="users" element={<Users />} />
          <Route path="issues" element={<Issues />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
