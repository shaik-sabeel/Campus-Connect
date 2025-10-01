import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import EventCard from '../components/EventCard'
import Button from '../components/Button'
import axios from 'axios'
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Clock,
  Plus,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const EventListPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all') // Changed from filter to category
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isAuthenticated, isLoading: authLoading } = useAuth(); // NEW: Check authentication status

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      setError('')
      try {
        // All event list page only fetches APPROVED events from now on (controlled by backend)
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/events`, {
            params: {
                category: selectedCategory,
                search: searchTerm,
                // Add pagination params here if needed: page: 1, limit: 10
            },
            withCredentials: true // Include credentials even for GET
        })
        setEvents(res.data?.events || [])
      } catch (e) {
        console.error("Error fetching events:", e);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false)
      }
    }
    // Only fetch events when auth state is known
    if (!authLoading) {
      fetchEvents()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchTerm, authLoading])

  // Event categories (from backend model for consistency)
  const eventCategories = [
    { value: 'all', label: 'All Events' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Business', label: 'Business' },
    { value: 'Arts', label: 'Arts' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Science', label: 'Science' },
    { value: 'Music', label: 'Music' },
    { value: 'Networking', label: 'Networking' },
    { value: 'Career', label: 'Career Fair' },
    { value: 'Workshop', label: 'Workshops' },
    { value: 'Conference', label: 'Conferences' },
    { value: 'Social', label: 'Social Events' },
    { value: 'Academic', label: 'Academic' },
    { value: 'Other', label: 'Other' }
  ];

  // Removed client-side filtering as it's now handled by backend
  const displayEvents = events;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-purple-600 border-t-transparent" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading Events...</span>
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

  return (
    <div className="min-h-screen pt-16 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Discover Events
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Find amazing events happening around campus
              </p>
            </div>
            {isAuthenticated && ( // Only show "Create Event" if authenticated
                <Link to="/create-event">
                    <Button className="hidden sm:flex items-center space-x-2">
                        <Plus className="w-5 h-5" />
                        <span>Create Event</span>
                    </Button>
                </Link>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events, tags, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:block">Categories</span>
              </button>

              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Options (Categories) */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <div className="flex flex-wrap gap-2">
                {eventCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.value
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <p className="text-gray-600 dark:text-gray-300">
            Showing {displayEvents.length} events
            {searchTerm || selectedCategory !== 'all' ? ` (filtered from ${events.length})` : ''}
          </p>
        </motion.div>

        {/* Events Grid/List */}
        {displayEvents.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }
          >
            {displayEvents.map((event, index) => (
              <motion.div
                key={event._id || event.id} // Use _id if available from Mongoose
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard
                  event={event}
                  // onClick prop is not typically passed in for EventCard
                  // EventCard uses internal Link or direct navigate for details
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Load More Button (Implement pagination in backend first) */}
        {displayEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg">
              Load More Events
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default EventListPage