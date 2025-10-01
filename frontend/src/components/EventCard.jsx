import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Heart,
  User,
  Tag
} from 'lucide-react'

const EventCard = ({ event, onClick, viewMode = 'grid' }) => {
  const [isLiked, setIsLiked] = useState(event?.isLiked || false)

  const handleLike = (e) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getEventTypeColor = (categoryOrType) => {
    const key = (categoryOrType || '').toString().toLowerCase()
    const colors = {
      workshop: 'from-blue-500 to-indigo-600',
      conference: 'from-purple-500 to-pink-600',
      social: 'from-green-500 to-emerald-600',
      academic: 'from-orange-500 to-red-600',
      sports: 'from-yellow-500 to-orange-600',
      technology: 'from-cyan-500 to-blue-600',
      business: 'from-amber-500 to-orange-600',
      arts: 'from-pink-500 to-rose-600',
      science: 'from-lime-500 to-green-600',
      music: 'from-fuchsia-500 to-purple-600',
      networking: 'from-sky-500 to-indigo-600',
      career: 'from-teal-500 to-emerald-600'
    }
    return colors[key] || 'from-gray-500 to-gray-600'
  }

  const category = event?.category || event?.type || 'Other'
  const categoryLabel = category ? `${category}` : 'Other'
  const attendeeCount = Array.isArray(event?.attendees) ? event.attendees.length : (event?.attendees || 0)
  const maxAttendees = event?.maxAttendees || 0
  const tags = Array.isArray(event?.tags) ? event.tags : []
  const imageSrc = event?.image || `https://placehold.co/600x400?text=${encodeURIComponent(event?.title || 'Event')}`

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="card p-6 cursor-pointer"
        onClick={() => onClick && onClick(event)}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Event Image */}
          <div className="md:w-48 h-32 md:h-40 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={imageSrc}
              alt={event?.title || 'Event'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {event?.title || 'Untitled Event'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                  {event?.description || ''}
                </p>
              </div>
              <button
                onClick={handleLike}
                className="ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Event Details */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event?.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{event?.time || ''}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{event?.location || ''}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{attendeeCount}/{maxAttendees}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                  +{tags.length - 3} more
                </span>
              )}
            </div>

            {/* Event Type Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getEventTypeColor(category)}`}>
                {categoryLabel}
              </span>
                <Link
                to={`/events/${event?._id || event?.id}`}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold text-sm"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card p-0 overflow-hidden cursor-pointer group"
      onClick={() => onClick && onClick(event)}
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={event?.title || 'Event'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLike}
            className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getEventTypeColor(category)}`}>
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {event?.title || 'Untitled Event'}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {event?.description || ''}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event?.date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4" />
            <span>{event?.time || ''}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{event?.location || ''}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4" />
            <span>{attendeeCount}/{maxAttendees} attendees</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
              +{tags.length - 2}
            </span>
          )}
        </div>

        {/* Action Button */}
        <Link
          to={`/events/${event?._id || event?.id}`}
          className="block w-full text-center py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  )
}

export default EventCard