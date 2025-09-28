import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Heart, 
  Share2, 
  MessageCircle,
  ArrowLeft,
  User,
  Star,
  Tag,
  Download,
  Bookmark,
  Flag
} from 'lucide-react'

const EventDetailsPage = () => {
  const { id } = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [rsvpStatus, setRsvpStatus] = useState('not_rsvp') // not_rsvp, rsvp, maybe

  // Mock data - in real app, this would come from API
  const event = {
    id: parseInt(id),
    title: 'Tech Innovation Workshop',
    description: 'Join us for an exciting workshop on the latest trends in technology and innovation. This hands-on session will cover topics including artificial intelligence, machine learning, blockchain technology, and emerging tech trends. Perfect for students interested in technology careers or entrepreneurship.',
    longDescription: `This comprehensive workshop is designed to provide students with practical insights into the rapidly evolving world of technology. Our expert speakers will share their experiences and knowledge about:

• Artificial Intelligence and Machine Learning applications
• Blockchain technology and its real-world uses
• Emerging technologies shaping the future
• Career opportunities in tech
• Startup ecosystem and entrepreneurship

The workshop includes interactive sessions, hands-on demonstrations, and networking opportunities with industry professionals. Whether you're a beginner or have some experience in technology, this event will provide valuable insights and connections.

What to expect:
- Expert presentations from industry leaders
- Interactive Q&A sessions
- Hands-on demonstrations
- Networking opportunities
- Refreshments and lunch provided
- Certificate of participation`,
    date: '2024-01-15',
    time: '2:00 PM - 5:00 PM',
    location: 'Computer Science Building, Room 201',
    address: '123 University Ave, Campus City, State 12345',
    attendees: 45,
    maxAttendees: 60,
    type: 'workshop',
    tags: ['technology', 'innovation', 'workshop', 'AI', 'machine learning'],
    image: 'https://picsum.photos/800/400?random=1',
    organizer: {
      name: 'Tech Society',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    requirements: [
      'Basic understanding of programming concepts',
      'Laptop with internet connection',
      'Student ID for verification'
    ],
    agenda: [
      { time: '2:00 PM', title: 'Welcome & Introduction', duration: '15 min' },
      { time: '2:15 PM', title: 'AI & Machine Learning Overview', duration: '45 min' },
      { time: '3:00 PM', title: 'Break & Networking', duration: '15 min' },
      { time: '3:15 PM', title: 'Blockchain Technology', duration: '45 min' },
      { time: '4:00 PM', title: 'Hands-on Workshop', duration: '45 min' },
      { time: '4:45 PM', title: 'Q&A & Wrap-up', duration: '15 min' }
    ],
    speakers: [
      {
        name: 'Dr. Sarah Johnson',
        title: 'AI Research Director',
        company: 'TechCorp',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        bio: 'Leading AI researcher with 10+ years experience in machine learning and neural networks.'
      },
      {
        name: 'Michael Chen',
        title: 'Blockchain Engineer',
        company: 'CryptoStartup',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        bio: 'Blockchain expert and startup founder with extensive experience in decentralized systems.'
      }
    ],
    attendees: [
      { name: 'Alex Smith', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' },
      { name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' },
      { name: 'James Brown', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
      { name: 'Lisa Davis', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face' },
      { name: 'Tom Miller', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' }
    ]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleRSVP = (status) => {
    setRsvpStatus(status)
  }

  const handleShare = () => {
    setShowShareModal(true)
    // In real app, implement actual sharing functionality
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/events"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="relative mb-6">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-xl"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} />
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-white'}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  {event.title}
                </h1>

                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Users className="w-5 h-5" />
                    <span>{event.attendees}/{event.maxAttendees} attendees</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>4.8 (24 reviews)</span>
                  </div>
                </div>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {event.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Detailed Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About This Event
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {event.longDescription}
                </p>
              </div>
            </motion.div>

            {/* Agenda */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Event Agenda
              </h2>
              <div className="space-y-4">
                {event.agenda.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-16 text-sm font-semibold text-purple-600 dark:text-purple-400">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {item.duration}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Speakers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Speakers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <img
                      src={speaker.avatar}
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {speaker.name}
                      </h3>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">
                        {speaker.title}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {speaker.company}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                        {speaker.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Requirements
              </h2>
              <ul className="space-y-2">
                {event.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                RSVP
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={() => handleRSVP('rsvp')}
                  className={`w-full ${
                    rsvpStatus === 'rsvp' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : ''
                  }`}
                >
                  {rsvpStatus === 'rsvp' ? '✓ RSVP\'d' : 'RSVP'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRSVP('maybe')}
                  className={`w-full ${
                    rsvpStatus === 'maybe' 
                      ? 'border-yellow-500 text-yellow-600' 
                      : ''
                  }`}
                >
                  {rsvpStatus === 'maybe' ? '✓ Maybe' : 'Maybe'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleRSVP('not_rsvp')}
                  className="w-full"
                >
                  Can't Attend
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>Attendees</span>
                  <span>{event.attendees}/{event.maxAttendees}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>

            {/* Organizer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Organizer
              </h3>
              <div className="flex items-center space-x-3">
                <img
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {event.organizer.name}
                    </h4>
                    {event.organizer.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Student Organization
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Attendees */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Attendees
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {event.attendees.map((attendee, index) => (
                  <img
                    key={index}
                    src={attendee.avatar}
                    alt={attendee.name}
                    className="w-8 h-8 rounded-full object-cover"
                    title={attendee.name}
                  />
                ))}
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
                  +{event.attendees - 5}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {event.attendees} people are attending
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Event</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Add to Calendar</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Flag className="w-4 h-4" />
                  <span>Report Event</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsPage
