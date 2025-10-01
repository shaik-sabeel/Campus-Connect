import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom' // Removed useNavigate, useAuth().logout for navigation
import { motion } from 'framer-motion'
import {
  Sun,
  Moon,
  Menu,
  X,
  Calendar,
  Users,
  Plus,
  User,
  LogOut,
  Bell,
  PanelTopClose, // NEW icon for admin panel
  Flag, // For clubs or more
  Laptop // Alternative for dashboard
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, logout, user } = useAuth() // Use user for role check

  const navItems = [
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Clubs', path: '/clubs', icon: Users }, // NEW link
    { name: 'Create Event', path: '/create-event', icon: Plus }, // This will still go to protected page
  ]
  
  // Conditionally add admin dashboard if user is admin
  if (isAuthenticated && user?.role === 'admin') {
    navItems.push({ name: 'Admin Panel', path: '/admin/dashboard', icon: PanelTopClose });
  }

  const isActive = (path) => location.pathname === path || (path === '/admin/dashboard' && location.pathname.startsWith('/admin'));

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout(); // useAuth handles navigation after logout
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 glass border-b border-white/20 dark:border-gray-700/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2"> {/* MODIFIED: Changed /home to / */}
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Campus Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && ( // Only show main nav items if authenticated
              <>
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </>
            )}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                {/* Notifications button */}
                <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-300">
                  <Bell className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth controls */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                  aria-label="User Account Menu"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block">Account</span>
                </button>

                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-lg py-2 z-50"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-800/50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                     <Link // NEW: Dashboard link in dropdown
                      to="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-800/50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Laptop className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-800/50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              // Display login/signup if not authenticated, except on those pages
              !['/login', '/signup'].includes(location.pathname) && (
                <Link to="/login" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                  Login
                </Link>
              )
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/20 dark:border-gray-700/20"
          >
            {isAuthenticated && (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 mb-2 ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </>
            )}
             {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 mb-2 text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 mb-2 text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
             ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 mb-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </>
             )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar