import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import Button from '../components/Button'
import InputField from '../components/InputField'
import axios from 'axios'
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Edit3,
  Save,
  X,
  Camera,
  Award,
  Users,
  Calendar as CalendarIcon,
  Heart,
  Settings,
  Bell,
  Shield,
  Download,
  Share2
} from 'lucide-react'

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm()
  const [serverError, setServerError] = useState('')

  const [userData, setUserData] = useState(null)
  const [userEvents, setUserEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, { withCredentials: true })
        const u = res.data?.user
        setUserData(u)
        setValue('firstName', u?.fullname?.firstname || '')
        setValue('lastName', u?.fullname?.lastname || '')
        setValue('email', u?.email || '')
        setValue('department', u?.department || '')
        setValue('year', u?.academicYear || '')
        setValue('bio', u?.bio || '')
      } catch (e) {
        setServerError('Failed to load profile')
      }
    }
    load()
  }, [setValue])

  // Fetch user events (created & attended)
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true)
      setEventsError('')
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/events/user/events`, { withCredentials: true })
        const events = res.data?.events || []
        setUserEvents(events)
      } catch (e) {
        setEventsError('Failed to load your events')
      } finally {
        setEventsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Derived dynamic stats from real data
  const eventsAttended = userEvents.filter(e => Array.isArray(e.attendees) && e.attendees.some(a => (a?._id || a)?.toString() === (userData?._id || '').toString()) && e.organizer?._id?.toString() !== userData?._id?.toString()).length
  const eventsCreated = userEvents.filter(e => e.organizer?._id?.toString() === userData?._id?.toString()).length
  const connectionsCount = Array.isArray(userData?.connections) ? userData.connections.length : 0
  const achievementsCount = Array.isArray(userData?.achievements) ? userData.achievements.length : 0

  const stats = [
    { label: 'Events Attended', value: eventsAttended, icon: CalendarIcon },
    { label: 'Connections', value: connectionsCount, icon: Users },
    { label: 'Events Created', value: eventsCreated, icon: Users },
    { label: 'Achievements', value: achievementsCount, icon: Award }
  ]

  // Recent activity from real events (mix of created and attended)
  const recentActivities = [...userEvents]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 5)
    .map(evt => {
      const isCreator = evt.organizer?._id?.toString() === userData?._id?.toString()
      return {
        id: evt._id,
        title: evt.title,
        date: evt.createdAt || evt.date,
        type: isCreator ? 'created' : 'attended',
        image: evt.image || `https://picsum.photos/100/100?random=${evt._id}`
      }
    })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'events', label: 'Events', icon: CalendarIcon },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const onSubmit = async (data) => {
    setLoading(true)
    setServerError('')
    try {
      const updates = {
        bio: data.bio,
        department: data.department,
        academicYear: data.year,
        'socialLinks.linkedin': data.linkedin,
        'socialLinks.github': data.github,
        'socialLinks.twitter': data.twitter
      }
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/users/profile`, updates, { withCredentials: true })
      setUserData(res.data?.user)
      setIsEditing(false)
    } catch (e) {
      setServerError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const fd = new FormData()
        fd.append('image', file)
        const up = await axios.post(`${import.meta.env.VITE_BASE_URL}/upload`, fd, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
        const url = up.data?.url
        if (url) {
          const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/users/profile/avatar`, { url }, { withCredentials: true })
          setUserData(res.data?.user)
        }
      } catch (e) {
        setServerError('Failed to upload avatar')
      }
    }
  }

  // Guard: show loader while userData is being fetched
  if (!userData) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-purple-600 border-t-transparent" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={userData?.avatar || 'https://placehold.co/200x200?text=Avatar'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              <button
                onClick={() => document.getElementById('avatar-upload').click()}
                className="absolute bottom-2 right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {userData?.fullname?.firstname} {userData?.fullname?.lastname}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {userData?.department} • {userData?.academicYear}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Joined {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {userData?.bio || ''}
              </p>

              {/* Interests */}
              <div className="flex flex-wrap gap-2">
                {(userData?.interests || []).map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:block">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                {/* Stats */}
                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Your Activity
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon
                      return (
                        <div key={stat.label} className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {eventsLoading ? '—' : stat.value}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {stat.label}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Recent Activity
                  </h2>
                  {eventsLoading ? (
                    <div className="text-center text-gray-600 dark:text-gray-400 py-8">Loading activity...</div>
                  ) : eventsError ? (
                    <div className="text-center text-red-600 dark:text-red-400 py-8">{eventsError}</div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivities.length > 0 ? recentActivities.map((event, index) => (
                        <div key={event.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {event.type === 'attended' ? 'Attended' : 'Created'} • {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.type === 'attended' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {event.type === 'attended' ? 'Attended' : 'Created'}
                          </span>
                        </div>
                      )) : (
                        <div className="text-center text-gray-600 dark:text-gray-400 py-8">No recent activity.</div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Your Events
                </h2>
                {eventsLoading ? (
                  <div className="text-center text-gray-600 dark:text-gray-400 py-8">Loading events...</div>
                ) : eventsError ? (
                  <div className="text-center text-red-600 dark:text-red-400 py-8">{eventsError}</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userEvents.length > 0 ? userEvents.map((event, index) => {
                      const isCreator = event.organizer?._id?.toString() === userData?._id?.toString()
                      return (
                        <div key={event._id || index} className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden">
                          <img
                            src={event.image || `https://picsum.photos/400/200?random=${event._id}`}
                            alt={event.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              {event.date ? new Date(event.date).toLocaleDateString() : ''}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                isCreator 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {isCreator ? 'Created' : 'Attended'}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{event.status}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="text-center text-gray-600 dark:text-gray-400 py-8 col-span-full">No events yet.</div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Achievements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(userData?.achievements || []).length > 0 ? (userData.achievements).map((achievement, index) => {
                    const Icon = Award
                    return (
                      <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl">
                        <div className={`w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {achievement.title || 'Achievement'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {achievement.description || ''}
                        </p>
                        {achievement.earnedDate && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )
                  }) : (
                    <div className="text-center text-gray-600 dark:text-gray-400 py-8 col-span-full">No achievements yet.</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Edit Profile Form */}
                {isEditing ? (
                  <div className="card p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Edit Profile
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="First Name"
                          defaultValue={userData?.fullname?.firstname || ''}
                          {...register('firstName', { required: 'First name is required' })}
                          error={errors.firstName?.message}
                          required
                        />
                        <InputField
                          label="Last Name"
                          defaultValue={userData?.fullname?.lastname || ''}
                          {...register('lastName', { required: 'Last name is required' })}
                          error={errors.lastName?.message}
                          required
                        />
                      </div>

                      <InputField
                        label="Email"
                        type="email"
                        defaultValue={userData?.email || ''}
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        error={errors.email?.message}
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Department
                          </label>
                          <select
                            defaultValue={userData?.department || ''}
                            {...register('department')}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                          >
                            <option value="Computer Science">Computer Science</option>
                            <option value="Business Administration">Business Administration</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Medicine">Medicine</option>
                            <option value="Arts & Humanities">Arts & Humanities</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Academic Year
                          </label>
                          <select
                            defaultValue={userData?.academicYear || ''}
                            {...register('year')}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                          >
                            <option value="Freshman">Freshman</option>
                            <option value="Sophomore">Sophomore</option>
                            <option value="Junior">Junior</option>
                            <option value="Senior">Senior</option>
                            <option value="Graduate">Graduate</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          defaultValue={userData?.bio || ''}
                          {...register('bio')}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          loading={loading}
                          className="flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="card p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Account Settings
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Notifications
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Manage your notification preferences
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Privacy & Security
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Control your privacy settings
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Export Data
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Download your account data
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {userData?.email || ''}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {userData?.location || ''}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {userData?.studentId || ''}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Social Links
              </h3>
              <div className="space-y-3">
                <a
                  href={userData?.socialLinks?.linkedin || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">in</span>
                  </div>
                  <span className="text-sm">LinkedIn</span>
                </a>
                <a
                  href={userData?.socialLinks?.github || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">GH</span>
                  </div>
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href={userData?.socialLinks?.twitter || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-blue-400 hover:text-blue-500 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <span className="text-sm">Twitter</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
