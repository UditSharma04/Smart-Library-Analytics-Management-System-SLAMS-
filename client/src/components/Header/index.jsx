import { useLocation } from 'react-router-dom'
import { format } from 'date-fns'

export default function Header() {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user'))

  // Get page title from current route
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1]
    return path.charAt(0).toUpperCase() + path.slice(1)
  }

  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="h-full px-6 flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold text-gray-800">
          {getPageTitle()}
        </h1>

        <div className="flex items-center gap-6">
          {/* Date and Time */}
          <div className="text-sm text-gray-600">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.name || 'Student'}
              </div>
              <div className="text-xs text-gray-500">
                Student
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
              {user?.name?.charAt(0) || 'S'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 