import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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
  Target
} from 'lucide-react'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming')

  // Mock data
  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Innovation Workshop',
      date: '2024-01-15',
      time: '2:00 PM',
      location: 'Computer Science Building',
      attendees: 45,
      maxAttendees: 60,
      type: 'workshop',
      image: 'https://picsum.photos/400/200?random=1'
    },
    {
      id: 2,
      title: 'Career Fair 2024',
      date: '2024-01-18',
      time: '10:00 AM',
      location: 'Student Center',
      attendees: 120,
      maxAttendees: 200,
      type: 'conference',
      image: 'https://picsum.photos/400/200?random=2'
    },
    {
      id: 3,
      title: 'Basketball Tournament',
      date: '2024-01-20',
      time: '6:00 PM',
      location: 'Sports Complex',
      attendees: 8,
      maxAttendees: 16,
      type: 'sports',
      image: 'https://picsum.photos/400/200?random=3'
    }
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
      title: 'Join Clubs',
      description: 'Connect with communities',
      icon: Users,
      link: '/clubs',
      color: 'from-indigo-600 to-purple-600'
    },
    {
      title: 'View Profile',
      description: 'Manage your account',
      icon: Users,
      link: '/profile',
      color: 'from-pink-600 to-purple-600'
    }
  ]

  const stats = [
    { label: 'Events Attended', value: '24', icon: Calendar, change: '+12%' },
    { label: 'Connections Made', value: '156', icon: Users, change: '+8%' },
    { label: 'Events Created', value: '3', icon: Plus, change: '+2' },
    { label: 'Achievements', value: '8', icon: Award, change: '+1' }
  ]

  const recentActivity = [
    {
      type: 'event',
      title: 'RSVP\'d to Tech Innovation Workshop',
      time: '2 hours ago',
      icon: Calendar
    },
    {
      type: 'connection',
      title: 'Connected with Sarah Johnson',
      time: '5 hours ago',
      icon: Users
    },
    {
      type: 'achievement',
      title: 'Earned "Event Organizer" badge',
      time: '1 day ago',
      icon: Award
    },
    {
      type: 'event',
      title: 'Created "Study Group Meetup"',
      time: '2 days ago',
      icon: Plus
    }
  ]

  return (
    <div className="min-h-screen pt-16">
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
                Hi Sabeel 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Here are your upcoming events and activities
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Premium</span>
            </motion.div>
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

            {/* Upcoming Events */}
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
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {event.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mt-1">
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
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {event.attendees}/{event.maxAttendees}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        attendees
                      </div>
                    </div>
                  </motion.div>
                ))}
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
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Recommendations */}
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
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    New event: "Startup Pitch Competition" starts in 2 days
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    You've been accepted to "Tech Innovation Workshop"
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
