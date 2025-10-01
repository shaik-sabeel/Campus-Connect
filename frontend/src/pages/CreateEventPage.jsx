import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import Button from '../components/Button'
import InputField from '../components/InputField'
import axios from 'axios'
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
  ArrowLeft,
  BookMarked, // For requirements icon
  PhoneCall, // For contact info
  Globe // For online event icon
} from 'lucide-react'
import { useAuth } from '../context/AuthContext' // NEW: to get user details for organizer in UI

const CreateEventPage = () => {
  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [eventImage, setEventImage] = useState(null)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm()
  const { user } = useAuth(); // NEW: Get current user to link to club creation
  const isOnline = watch('online', false); // Watch for 'online' checkbox value

  const availableTags = [ // Expanded list for consistency
    'Technology', 'Business', 'Arts', 'Sports', 'Science', 'Music',
    'Photography', 'Writing', 'Volunteering', 'Entrepreneurship',
    'Research', 'Design', 'Gaming', 'Travel', 'Food', 'Fitness',
    'Networking', 'Career', 'Academic', 'Social', 'Workshop',
    'Conference', 'Seminar', 'Meetup', 'Competition', 'Exhibition'
  ]

  const eventCategories = [ // Using eventCategories to align with model's category enum
    { value: 'Technology', label: 'Technology' },
    { value: 'Business', label: 'Business' },
    { value: 'Arts', label: 'Arts' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Science', label: 'Science' },
    { value: 'Music', label: 'Music' },
    { value: 'Photography', label: 'Photography' },
    { value: 'Writing', label: 'Writing' },
    { value: 'Volunteering', label: 'Volunteering' },
    { value: 'Entrepreneurship', label: 'Entrepreneurship' },
    { value: 'Research', label: 'Research' },
    { value: 'Design', label: 'Design' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Food', label: 'Food' },
    { value: 'Fitness', label: 'Fitness' },
    { value: 'Networking', label: 'Networking' },
    { value: 'Career', label: 'Career' },
    { value: 'Academic', label: 'Academic' },
    { value: 'Social', label: 'Social' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Conference', label: 'Conference' },
    { value: 'Seminar', label: 'Seminar' },
    { value: 'Meetup', label: 'Meetup' },
    { value: 'Competition', label: 'Competition' },
    { value: 'Exhibition', label: 'Exhibition' },
    { value: 'Other', label: 'Other' }
  ]

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      let imageUrl = ''
      if (eventImage) {
        const formData = new FormData()
        formData.append('image', eventImage)
        // Upload image directly to /upload endpoint, not cloudinary via frontend
        const uploadRes = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/upload`,
          formData,
          { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
        )
        imageUrl = uploadRes.data.url
      }

      const eventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.startTime,
        location: isOnline ? 'Online Event' : (data.venue + (data.room ? `, ${data.room}` : '')), // Logic for online/physical location
        category: data.type, // Map 'type' from form to 'category' in model
        maxAttendees: parseInt(data.maxAttendees),
        tags: selectedTags,
        image: imageUrl,
        requirements: data.requirements ? data.requirements.split(',').map(s => s.trim()) : [], // Store as array
        contactInfo: data.contact,
        isOnline: data.online // NEW
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/events`,
        eventData,
        { withCredentials: true }
      )

      if (response.status === 201) {
        // Show success message that it's pending approval
        alert('Event created successfully and sent for admin approval!');
        navigate('/events');
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert(error.response?.data?.message || 'Failed to create event. Please check your inputs.');
    } finally {
      setLoading(false)
    }
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
    }
  }

  const removeImage = () => {
    setEventImage(null)
  }
  
    // Helper function to validate dates relative to today
    const validateDate = (value) => {
        if (!value) return 'Event date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignore time for comparison
        return selectedDate >= today || 'Event date cannot be in the past';
    };


  return (
    <div className="min-h-screen pt-16 dark:bg-gray-900 transition-colors duration-300">
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
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      Upload an event image (recommended)
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
                  placeholder="Describe your event in detail (minimum 50 characters)..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('type', { required: 'Event category is required' })} // using 'type' for form field
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                  >
                    <option value="">Select event category</option>
                    {eventCategories.map((type) => (
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
                    },
                    valueAsNumber: true // Ensures input is treated as number
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
                    validate: validateDate // Use helper function for validation
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

              {/* Assuming no end time required for backend model yet, but keeping for UI consistency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="End Time (Optional)"
                  type="time"
                  {...register('endTime')}
                  error={errors.endTime?.message}
                />
                 {/* For consistency with UI: The "All Day" feature would need backend support */}
                 <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <input
                    type="checkbox"
                    {...register('allDay')}
                    id="allDayEvent"
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:bg-gray-700"
                    />
                    <label htmlFor="allDayEvent" className="ml-2 text-sm">
                    All day event (UI only)
                    </label>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Location
              </h2>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                <input
                    type="checkbox"
                    {...register('online')}
                    id="onlineEvent"
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:bg-gray-700"
                />
                <label htmlFor="onlineEvent" className="ml-2 text-sm flex items-center space-x-1">
                    <Globe className="w-4 h-4 inline-block"/>
                    <span>This is an online event</span>
                </label>
            </div>


              {!isOnline && ( // Only show physical location fields if not an online event
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                    label="Venue Name"
                    placeholder="e.g., Student Center"
                    {...register('venue', {
                        required: !isOnline ? 'Venue name is required for physical events' : false
                    })}
                    error={errors.venue?.message}
                    required={!isOnline}
                    />

                    <InputField
                    label="Room/Area"
                    placeholder="e.g., Room 201, Zoom link"
                    {...register('room')} // Allow input even if online (e.g. for Zoom link)
                    />
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tags & Categories
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Select relevant tags (Choose at least 1) <span className="text-red-500">*</span>
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
                {selectedTags.length < 1 && ( // MODIFIED: Minimum 1 tag required for consistency
                  <p className="text-red-500 text-sm mt-2">
                    Please select at least 1 tag
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                    <BookMarked className="w-4 h-4"/>
                    <span>Requirements (Optional)</span>
                </label>
                <textarea
                  {...register('requirements')} // Matches backend model field
                  rows={3}
                  placeholder="List any requirements for attendees (e.g., bring laptop, student ID). Separate with commas for multiple."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                    <PhoneCall className="w-4 h-4"/>
                    <span>Contact Information (Optional)</span>
                </label>
                <InputField
                  placeholder="Email or phone for event inquiries (e.g., organizer@example.com)"
                  {...register('contact')} // Matches backend model field
                />
              </div>

               {/* No 'public' field in model, handled by 'status' admin approval now. */}
               {/* Could add a 'club' field here to link an event to a specific club */}
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
                disabled={selectedTags.length < 1} // MODIFIED: Min 1 tag
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