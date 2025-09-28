import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Clock, Heart, Share2, MessageCircle } from 'lucide-react'

const EventCard = ({ event, onClick }) => {
  const {
    id,
    title,
    description,
    date,
    time,
    location,
    attendees,
    maxAttendees,
    image,
    tags,
    isLiked = false,
    type = 'workshop'
  } = event

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTypeColor = (type) => {
    const colors = {
      workshop: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      conference: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      social: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      academic: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      sports: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[type] || colors.workshop
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card p-6 cursor-pointer group"
      onClick={() => onClick && onClick(event)}
    >
      {/* Event Image */}
      <div className="relative mb-4 rounded-xl overflow-hidden">
        <img
          src={image || `https://picsum.photos/400/200?random=${id}`}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(type)}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
          >
            <Share2 className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Event Content */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
          {description}
        </p>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(date)}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{time}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4" />
            <span>{attendees}/{maxAttendees} attendees</span>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">RSVP</span>
          </motion.button>
          
          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{Math.floor(Math.random() * 50) + 10}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EventCard
