import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import EventCard from '../components/EventCard'
import Button from '../components/Button'
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

const EventListPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data
  const events = [
    {
      id: 1,
      title: 'Tech Innovation Workshop',
      description: 'Learn about the latest trends in technology and innovation. Hands-on workshops and expert talks.',
      date: '2024-01-15',
      time: '2:00 PM',
      location: 'Computer Science Building',
      attendees: 45,
      maxAttendees: 60,
      type: 'workshop',
      tags: ['technology', 'innovation', 'workshop'],
      image: 'https://picsum.photos/400/200?random=1',
      isLiked: false
    },
    {
      id: 2,
      title: 'Career Fair 2024',
      description: 'Connect with top companies and explore career opportunities. Bring your resume and network with industry professionals.',
      date: '2024-01-18',
      time: '10:00 AM',
      location: 'Student Center',
      attendees: 120,
      maxAttendees: 200,
      type: 'conference',
      tags: ['career', 'networking', 'jobs'],
      image: 'https://picsum.photos/400/200?random=2',
      isLiked: true
    },
    {
      id: 3,
      title: 'Basketball Tournament',
      description: 'Annual inter-department basketball tournament. Teams of 8 players each. Registration required.',
      date: '2024-01-20',
      time: '6:00 PM',
      location: 'Sports Complex',
      attendees: 8,
      maxAttendees: 16,
      type: 'sports',
      tags: ['sports', 'basketball', 'tournament'],
      image: 'https://picsum.photos/400/200?random=3',
      isLiked: false
    },
    {
      id: 4,
      title: 'Art Exhibition Opening',
      description: 'Student art exhibition featuring works from various departments. Refreshments will be served.',
      date: '2024-01-22',
      time: '7:00 PM',
      location: 'Art Gallery',
      attendees: 25,
      maxAttendees: 50,
      type: 'social',
      tags: ['art', 'exhibition', 'culture'],
      image: 'https://picsum.photos/400/200?random=4',
      isLiked: true
    },
    {
      id: 5,
      title: 'Research Symposium',
      description: 'Graduate students present their research findings. Open to all students and faculty.',
      date: '2024-01-25',
      time: '9:00 AM',
      location: 'Conference Hall',
      attendees: 80,
      maxAttendees: 120,
      type: 'academic',
      tags: ['research', 'academic', 'presentation'],
      image: 'https://picsum.photos/400/200?random=5',
      isLiked: false
    },
    {
      id: 6,
      title: 'Music Concert',
      description: 'Student bands perform original compositions. Food trucks and merchandise available.',
      date: '2024-01-28',
      time: '8:00 PM',
      location: 'Amphitheater',
      attendees: 150,
      maxAttendees: 300,
      type: 'social',
      tags: ['music', 'concert', 'entertainment'],
      image: 'https://picsum.photos/400/200?random=6',
      isLiked: false
    }
  ]

  const filters = [
    { value: 'all', label: 'All Events' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'conference', label: 'Conferences' },
    { value: 'social', label: 'Social Events' },
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports' }
  ]

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter
    
    return matchesSearch && matchesFilter
  })

  const handleEventClick = (event) => {
    // Navigate to event details
    console.log('Navigate to event:', event.id)
  }

  return (
    <div className="min-h-screen pt-16">
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
            <Link to="/create-event">
              <Button className="hidden sm:flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create Event</span>
              </Button>
            </Link>
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
                <span className="hidden sm:block">Filters</span>
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

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedFilter === filter.value
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {filter.label}
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
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </motion.div>

        {/* Events Grid/List */}
        {filteredEvents.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard
                  event={event}
                  onClick={handleEventClick}
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
              setSelectedFilter('all')
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredEvents.length > 0 && (
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
