import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Default menu items that are always available
  const defaultMenuItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: 'dashboard' },
    { path: '/admin/users', label: 'User Management', icon: 'users' },
    { path: '/admin/assessments', label: 'Assessment Management', icon: 'assessment' },
  ];

  // Get available pages from your backend or context
  const [menuItems, setMenuItems] = useState(defaultMenuItems);

  useEffect(() => {
    // TODO: Replace with actual API call to get available pages
    // This is just a simulation
    const fetchAvailablePages = async () => {
      try {
        // Simulated API response
        const availablePages = [
          ...defaultMenuItems,
          { path: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
          { path: '/admin/settings', label: 'Settings', icon: 'settings' },
          // Add other admin pages as they are created
        ];
        setMenuItems(availablePages);
      } catch (error) {
        console.error('Failed to fetch available pages:', error);
      }
    };

    fetchAvailablePages();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
          <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
            <h1 className="text-xl font-bold text-primary-600">SkillHub Admin</h1>
          </div>
          <nav className="mt-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  location.pathname === item.path ? 'bg-gray-100 dark:bg-gray-700 border-l-4 border-primary-600' : ''
                }`}
              >
                <span className="mx-4">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 shadow">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Dashboard'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Admin Badge */}
              <div className="px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded-full">
                Admin
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {currentUser?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{currentUser?.name || 'Admin'}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
            <div className="space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 