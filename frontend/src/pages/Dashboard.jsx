import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  Plus,
  Users,
  TrendingUp,
  Bell,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  Award,
  Target,
  UserCheck, // New for connections
  Clock3, // New for activities
  User
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming')
  const { user, isAuthenticated, isLoading } = useAuth(); // Get user from auth context
  const [userEvents, setUserEvents] = useState([]); // All events for this user (created/attended)
  const [connections, setConnections] = useState([]); // User's connections
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || !user?._id) {
        setLoadingDashboard(false);
        return;
      }

      setLoadingDashboard(true);
      try {
        // Fetch user's events (created and attended)
        const eventsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/events/user/events`, { withCredentials: true });
        setUserEvents(eventsRes.data.events);

        // Fetch user's profile with connections (AuthContext already gets it, but re-fetch for real-time connection status)
        // Or directly use user.connections from auth context if populated in token or during profile fetch
        // Let's assume user.connections is populated when `refreshSession` runs for simplicity,
        // otherwise, you'd fetch /users/profile and extract connections or a dedicated /users/connections endpoint.
        if (user.connections) { // user from AuthContext should have connections populated or at least IDs
             const populatedConnections = await Promise.all(
                user.connections.map(async (connectionId) => {
                    const connRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile/${connectionId}`, { withCredentials: true }); // Assume this endpoint exists or modify existing one to fetch any user by ID
                    return connRes.data.user;
                })
             );
            setConnections(populatedConnections.filter(Boolean));
        }

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoadingDashboard(false);
      }
    };

    if (!isLoading && isAuthenticated) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, isLoading]);

  if (isLoading || loadingDashboard) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-purple-600 border-t-transparent" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading Dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center dark:bg-gray-900 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  const eventsAttended = userEvents.filter(e => e.attendees?.includes(user?._id) && e.organizer?._id.toString() !== user?._id.toString() && e.status === 'approved').length;
  const eventsCreated = userEvents.filter(e => e.organizer?._id.toString() === user?._id.toString()).length; // Include pending, approved, rejected
  const upcomingEvents = userEvents.filter(event => new Date(event.date) >= new Date() && event.status === 'approved').sort((a,b) => new Date(a.date) - new Date(b.date));

  // Mocked (or integrate backend for these if created)
  const stats = [
    { label: 'Events Attended', value: eventsAttended, icon: Calendar, change: '+5 (prev month)' },
    { label: 'Connections Made', value: connections.length, icon: Users, change: '+2 (last week)' },
    { label: 'Events Created', value: eventsCreated, icon: Plus, change: '+1 (this month)' },
    { label: 'Achievements', value: user?.achievements?.length || 0, icon: Award, change: '+0 (new)' } // Dynamically from user.achievements
  ]

  const quickActions = [
    {
      title: 'Create Event',
      description: 'Organize your own event',
      icon: Plus,
      link: '/create-event',
      color: 'from-purple-600 to-blue-600'
    },
    {
      title: 'Explore Events',
      description: 'Discover new opportunities',
      icon: Calendar,
      link: '/events',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'Discover Clubs',
      description: 'Connect with communities',
      icon: Users,
      link: '/clubs', // NEW: Link to clubs page
      color: 'from-indigo-600 to-purple-600'
    },
    {
      title: 'View Profile',
      description: 'Manage your account',
      icon: User, // Changed icon for Profile from Users
      link: '/profile',
      color: 'from-pink-600 to-purple-600'
    }
  ]

    const filterUserEvents = (type) => {
        let events = userEvents.filter(e => e.isActive);
        if (type === 'upcoming') {
            events = events.filter(e => new Date(e.date) >= new Date() && e.status === 'approved');
        } else if (type === 'past') {
            events = events.filter(e => new Date(e.date) < new Date() && e.status === 'approved');
        } else if (type === 'created') {
            events = events.filter(e => e.organizer?._id.toString() === user._id.toString());
        }
        return events.sort((a,b) => new Date(a.date) - new Date(b.date));
    }

  return (
    <div className="min-h-screen pt-16 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Hi {user?.fullname?.firstname} 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Here are your upcoming events and activities
              </p>
            </div>
            {/* Conditional Admin Premium badge (assuming 'premium' can be indicated by admin role for demo) */}
            {user?.role === 'admin' && (
                <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl cursor-pointer"
                >
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Admin Access</span>
                </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.title}
                      to={action.link}
                      className="group"
                    >
                      <motion.div
                        whileHover={{ y: -2 }}
                        className={`p-6 rounded-xl bg-gradient-to-r ${action.color} text-white cursor-pointer transition-all duration-300`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{action.title}</h3>
                            <p className="text-white/80 text-sm">{action.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>

            {/* User's Events (Created, Attended) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Your Events
                </h2>
                <div className="flex space-x-2">
                  {['upcoming', 'past', 'created'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeTab === tab
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filterUserEvents(activeTab).length > 0 ? (
                    filterUserEvents(activeTab).map((event, index) => (
                        <motion.div
                        key={event._id || event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                        >
                            <img
                                src={event.image || `https://picsum.photos/100/100?random=${event._id}`}
                                alt={event.title}
                                className="w-16 h-16 rounded-lg object-cover mb-4 sm:mb-0"
                            />
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {event.title} {event.status !== 'approved' && <span className="text-orange-500 text-xs">({event.status})</span>}
                                </h3>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                            {event.organizer?._id.toString() !== user._id.toString() ? (
                                <div className="text-right">
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {event.attendees?.length || 0}/{event.maxAttendees}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    attendees
                                </div>
                                </div>
                            ) : (
                                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                    Created by you
                                </div>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                        No {activeTab} events found.
                    </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/events"
                  className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold transition-colors"
                >
                  <span>View All Events</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {/* Dynamically display user's own event and connection activities */}
                {userEvents.length > 0 ? userEvents.slice(0, 3).map((event, index) => (
                    <motion.div
                        key={event._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start space-x-3"
                    >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock3 className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-white">
                                {event.organizer?._id.toString() === user._id.toString()
                                    ? `You ${event.status === 'approved' ? 'created' : 'submitted for approval'} "${event.title}"`
                                    : `You RSVP'd to "${event.title}"`
                                }
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(event.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </motion.div>
                )) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No recent activity.</p>
                )}
                 {connections.length > 0 && (
                    connections.slice(0, 2).map((connection, index) => (
                        <motion.div
                            key={connection._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + (userEvents.length + index) * 0.1 }}
                            className="flex items-start space-x-3"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 dark:text-white">
                                    Connected with {connection.fullname.firstname} {connection.fullname.lastname}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Just now (simulated)
                                </p>
                            </div>
                        </motion.div>
                    ))
                 )}
              </div>
            </motion.div>

            {/* Recommendations (Static for now, but backend can provide dynamic based on interests) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recommended for You
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      AI & Machine Learning
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      5 events this week
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Networking Events
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      3 events this week
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="space-y-3">
                {upcomingEvents.slice(0,2).map(event => (
                     <div key={event._id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            Upcoming event: "{event.title}" starts in {Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24))} days
                        </p>
                    </div>
                ))}

                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    You've been accepted to "Tech Innovation Workshop" (Sample)
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard