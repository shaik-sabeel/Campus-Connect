import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import Button from '../components/Button'
import InputField from '../components/InputField'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Upload,
  Image,
  Plus,
  X,
  Save,
  ArrowLeft
} from 'lucide-react'

const CreateEventPage = () => {
  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [eventImage, setEventImage] = useState(null)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm()

  const availableTags = [
    'Technology', 'Business', 'Arts', 'Sports', 'Science', 'Music',
    'Photography', 'Writing', 'Volunteering', 'Entrepreneurship',
    'Research', 'Design', 'Gaming', 'Travel', 'Food', 'Fitness',
    'Networking', 'Career', 'Academic', 'Social', 'Workshop',
    'Conference', 'Seminar', 'Meetup', 'Competition', 'Exhibition'
  ]

  const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conference' },
    { value: 'social', label: 'Social Event' },
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'career', label: 'Career Fair' },
    { value: 'other', label: 'Other' }
  ]

  const onSubmit = async (data) => {
    setLoading(true)
    
    // Add selected tags to form data
    data.tags = selectedTags
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      navigate('/events')
    }, 2000)
  }

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setEventImage(file)
      // In real app, you would upload to server and get URL
    }
  }

  const removeImage = () => {
    setEventImage(null)
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/events')}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  Create Event
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Share your event with the campus community
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Create Event Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Event Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Event Image
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                {eventImage ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(eventImage)}
                      alt="Event preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      Upload an event image
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      <Image className="w-4 h-4" />
                      <span>Choose Image</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Basic Information
              </h2>

              <InputField
                label="Event Title"
                placeholder="Enter event title"
                {...register('title', {
                  required: 'Event title is required',
                  minLength: {
                    value: 5,
                    message: 'Title must be at least 5 characters'
                  }
                })}
                error={errors.title?.message}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description', {
                    required: 'Event description is required',
                    minLength: {
                      value: 50,
                      message: 'Description must be at least 50 characters'
                    }
                  })}
                  rows={4}
                  placeholder="Describe your event in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('type', { required: 'Event type is required' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                  )}
                </div>

                <InputField
                  label="Maximum Attendees"
                  type="number"
                  placeholder="e.g., 50"
                  {...register('maxAttendees', {
                    required: 'Maximum attendees is required',
                    min: {
                      value: 1,
                      message: 'Must allow at least 1 attendee'
                    }
                  })}
                  error={errors.maxAttendees?.message}
                  required
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Date & Time
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Event Date"
                  type="date"
                  {...register('date', {
                    required: 'Event date is required',
                    validate: value => {
                      const selectedDate = new Date(value)
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return selectedDate >= today || 'Event date cannot be in the past'
                    }
                  })}
                  error={errors.date?.message}
                  required
                />

                <InputField
                  label="Start Time"
                  type="time"
                  {...register('startTime', {
                    required: 'Start time is required'
                  })}
                  error={errors.startTime?.message}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="End Time"
                  type="time"
                  {...register('endTime', {
                    required: 'End time is required'
                  })}
                  error={errors.endTime?.message}
                  required
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('allDay')}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    All day event
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Location
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Venue Name"
                  placeholder="e.g., Student Center"
                  {...register('venue', {
                    required: 'Venue name is required'
                  })}
                  error={errors.venue?.message}
                  required
                />

                <InputField
                  label="Room/Area"
                  placeholder="e.g., Room 201"
                  {...register('room')}
                />
              </div>

              <InputField
                label="Address"
                placeholder="Enter full address"
                {...register('address', {
                  required: 'Address is required'
                })}
                error={errors.address?.message}
                required
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('online')}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  This is an online event
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tags & Categories
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Select relevant tags (Choose at least 3)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedTags.includes(tag)
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {selectedTags.length < 3 && (
                  <p className="text-red-500 text-sm mt-2">
                    Please select at least 3 tags
                  </p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Additional Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requirements (Optional)
                </label>
                <textarea
                  {...register('requirements')}
                  rows={3}
                  placeholder="List any requirements for attendees (e.g., bring laptop, student ID, etc.)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Information
                </label>
                <InputField
                  placeholder="Email or phone for event inquiries"
                  {...register('contact')}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('public')}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  Make this event public (visible to all students)
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/events')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={selectedTags.length < 3}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Create Event</span>
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default CreateEventPage
