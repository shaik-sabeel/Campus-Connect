import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
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
  Flag,
  UserCircle, // Fallback for avatar
  Code, // Example for tech speaker
  Briefcase, // Example for business speaker
  Info,
  Edit3,
  UserCheck
} from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const EventDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth(); // Get current logged-in user for RSVP and permissions
  const [isLiked, setIsLiked] = useState(false); // Likes are local/user specific for now
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState('not_rsvp'); // not_rsvp, rsvp

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        // Need to be authenticated to check for organizer view or attendees for RSVP status
        // The eventController now handles checking status based on user role (organizer, admin or public approved event)
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/events/${id}`, { withCredentials: true });
        const fetchedEvent = res.data.event;
        setEvent(fetchedEvent);
        
        if (isAuthenticated && user) {
            // Determine RSVP status
            if (fetchedEvent.attendees.some(attendee => attendee._id === user._id)) {
                setRsvpStatus('rsvp');
            } else {
                setRsvpStatus('not_rsvp');
            }
            // For liked/bookmarked, this would need backend endpoints per user
        }

      } catch (err) {
        console.error("Failed to fetch event details:", err);
        setError("Event not found or access denied.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, user]); // Refetch if user or auth state changes

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleRSVP = async (status) => {
    if (!isAuthenticated) {
        alert("You must be logged in to RSVP to an event.");
        navigate('/login', { state: { from: location.pathname } });
        return;
    }

    try {
        if (status === 'rsvp' && rsvpStatus !== 'rsvp') {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/events/${id}/join`, {}, { withCredentials: true });
            setRsvpStatus('rsvp');
            setEvent(prev => ({ ...prev, attendees: [...prev.attendees, { _id: user._id, fullname: user.fullname, avatar: user.avatar }], currentAttendees: (prev.currentAttendees || 0) + 1 }));
            alert("Successfully RSVP'd to the event!");
        } else if (status === 'not_rsvp' && rsvpStatus === 'rsvp') {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/events/${id}/leave`, {}, { withCredentials: true });
            setRsvpStatus('not_rsvp');
            setEvent(prev => ({ ...prev, attendees: prev.attendees.filter(a => a._id !== user._id), currentAttendees: (prev.currentAttendees || 1) - 1 }));
            alert("Successfully cancelled RSVP for the event.");
        }
    } catch (err) {
        console.error("RSVP/Cancel failed:", err);
        alert(err.response?.data?.message || `Failed to ${status === 'rsvp' ? 'RSVP' : 'cancel RSVP'}.`);
    }
  }

  const handleShare = () => {
    alert("Share functionality coming soon!"); // Replace with actual sharing via social media SDKs or native share API
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-purple-600 border-t-transparent" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading Event...</span>
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

  if (!event) return null; // Should not happen with current logic, but a safeguard

  const isOrganizer = user && event.organizer._id === user._id;

  return (
    <div className="min-h-screen pt-16 dark:bg-gray-900 transition-colors duration-300">
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
                  src={event.image || `https://picsum.photos/800/400?random=${event._id}`}
                  alt={event.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-xl"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
                    {(event.category || 'Other').charAt(0).toUpperCase() + (event.category || 'Other').slice(1)}
                  </span>
                   {event.status !== 'approved' && (
                    <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-semibold">
                      {(event.status || '').charAt(0).toUpperCase() + (event.status || '').slice(1)} {event.status === 'pending' ? '(Awaiting Approval)' : `(${event.adminApprovalMessage || ''})`}
                    </span>
                   )}
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)} // This is purely UI for now
                    className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
                    aria-label="Like event"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} />
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)} // This is purely UI for now
                    className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
                    aria-label="Bookmark event"
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-white'}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300">
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
                    <span>{event.isOnline ? "Online Event" : event.location}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Users className="w-5 h-5" />
                    <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span>N/A (no reviews yet)</span> {/* Dynamic reviews would be an enhancement */}
                  </div>
                </div>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {event.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {(event.tags || []).map((tag, index) => (
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
                  {event.description} {/* Using basic description, would expand if `longDescription` in model */}
                </p>
                {/* Agenda and Speakers could be part of description in current simplified model or separate model fields */}
                 <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">Example Agenda (Hardcoded)</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                  <li><strong>2:00 PM:</strong> Welcome & Introduction</li>
                  <li><strong>2:15 PM:</strong> Core Workshop Session 1</li>
                  <li><strong>3:00 PM:</strong> Break</li>
                  <li><strong>3:15 PM:</strong> Core Workshop Session 2</li>
                  <li><strong>4:00 PM:</strong> Q&A & Networking</li>
                </ul>

                <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">Example Speakers (Hardcoded)</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&face" alt="Speaker 1" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Jane Doe</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Lead Engineer, Tech Innovations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&face" alt="Speaker 2" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">John Smith</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Data Scientist, Future Corp</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Requirements (Conditional rendering) */}
            {(event.requirements && event.requirements.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Info className="w-6 h-6"/>
                  <span>Requirements</span>
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
            )}
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
                  disabled={event.currentAttendees >= event.maxAttendees && rsvpStatus !== 'rsvp'}
                >
                  {rsvpStatus === 'rsvp' ? '✓ RSVP\'d' : (event.currentAttendees >= event.maxAttendees ? 'Event Full' : 'RSVP')}
                </Button>
                {/* If event is full and user hasn't RSVP'd */}
                {event.currentAttendees >= event.maxAttendees && rsvpStatus !== 'rsvp' && (
                  <p className="text-red-500 text-sm text-center">This event is full!</p>
                )}
                 {rsvpStatus === 'rsvp' && (
                    <Button
                        variant="outline"
                        onClick={() => handleRSVP('not_rsvp')}
                        className="w-full"
                    >
                        Cancel RSVP
                    </Button>
                )}
                {/* 'Maybe' option is currently client-side state only. If needed for analytics, require backend implementation. */}
                {/* <Button
                  variant="outline"
                  onClick={() => handleRSVP('maybe')}
                  className={`w-full ${
                    rsvpStatus === 'maybe'
                      ? 'border-yellow-500 text-yellow-600'
                      : ''
                  }`}
                >
                  {rsvpStatus === 'maybe' ? '✓ Maybe' : 'Maybe'}
                </Button> */}

              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>Attendees</span>
                  <span>{event.currentAttendees}/{event.maxAttendees}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
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
                  src={event.organizer.avatar || `https://ui-avatars.com/api/?name=${event.organizer.fullname.firstname}+${event.organizer.fullname.lastname}&background=random&color=fff`}
                  alt={event.organizer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {event.organizer.fullname.firstname} {event.organizer.fullname.lastname}
                    </h4>
                    {/* Assuming verification is linked to role or some flag */}
                    {event.organizer.role === 'admin' && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {event.organizer.department} {event.organizer.academicYear ? `(${event.organizer.academicYear})` : ''}
                  </p>
                   {/* Connect button logic - can be integrated with user connections API */}
                    {!isOrganizer && isAuthenticated && (
                         <Button variant="ghost" size="sm" className="mt-2">
                            <UserCheck className="w-4 h-4 mr-1"/> Connect
                         </Button>
                    )}
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
                {event.attendees.slice(0, 5).map((attendee, index) => (
                  <img
                    key={index}
                    src={attendee.avatar || `https://ui-avatars.com/api/?name=${attendee.fullname.firstname}+${attendee.fullname.lastname}&background=random&color=fff`}
                    alt={attendee.fullname.firstname}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-700"
                    title={`${attendee.fullname.firstname} ${attendee.fullname.lastname}`}
                  />
                ))}
                {event.attendees.length > 5 && (
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
                    +{event.attendees.length - 5}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {event.currentAttendees} people are attending
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
                 {isAuthenticated && isOrganizer && (
                    <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={() => navigate(`/create-event?edit=${event._id}`)} // Placeholder for edit page
                    >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Event</span>
                    </Button>
                )}
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
                  className="w-full flex items-center justify-center space-x-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
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
