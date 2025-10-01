// frontend/src/pages/EditEventPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import InputField from '../components/InputField';
import axios from 'axios';
import {
  Upload,
  Image,
  Plus,
  X,
  Save,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';


const EditEventPage = () => {
  const { id } = useParams(); // Get event ID from URL
  const { user, isAuthenticated } = useAuth(); // To check if current user is organizer or admin
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [eventImageFile, setEventImageFile] = useState(null);
  const [eventImageUrl, setEventImageUrl] = useState(''); // Current/new image URL
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm();

  const availableTags = [
    'Technology', 'Business', 'Arts', 'Sports', 'Science', 'Music',
    'Photography', 'Writing', 'Volunteering', 'Entrepreneurship',
    'Research', 'Design', 'Gaming', 'Travel', 'Food', 'Fitness',
    'General Networking', 'Social Events', 'Skill Development'
  ];

  const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conference' },
    { value: 'social', label: 'Social Event' },
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'career', label: 'Career Fair' },
    { value: 'other', label: 'Other' }
  ];

  // --- Fetch Event Data for Editing ---
  useEffect(() => {
    const fetchEventData = async () => {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: `/events/${id}/edit`, message: "Login to edit event." } });
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/events/${id}`, { withCredentials: true });
        const eventData = res.data.event;

        // Check authorization (only organizer or admin can edit)
        if (eventData.organizer._id !== user._id && user.role !== 'admin') {
          toast.error("You are not authorized to edit this event.");
          navigate(`/events/${id}`);
          return;
        }

        // Set form default values
        reset({
          title: eventData.title,
          description: eventData.description,
          longDescription: eventData.longDescription || '',
          date: new Date(eventData.date).toISOString().split('T')[0], // Format date for input type="date"
          startTime: eventData.time,
          endTime: eventData.endTime || '',
          allDay: eventData.allDay,
          venue: eventData.location.split(',')[0].trim(), // Split if comma is used, assumes first part is venue
          room: eventData.location.includes(',') ? eventData.location.split(',').slice(1).join(',').trim() : '',
          address: eventData.address || '',
          online: eventData.online,
          type: eventData.category,
          maxAttendees: eventData.maxAttendees,
          requirements: eventData.requirements || '',
          contact: eventData.contactInfo || '',
          public: eventData.isPublic,
          // interests will be handled by setSelectedTags and form `watch` logic
        });
        setSelectedTags(eventData.tags || []);
        setEventImageUrl(eventData.image || ''); // Set current image URL

      } catch (err) {
        setFormError(err.response?.data?.message || 'Failed to load event for editing.');
        toast.error(err.response?.data?.message || 'Failed to load event for editing.');
        navigate(`/events/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id, user, isAuthenticated, navigate, reset]); // Dependency on `id`, `user` for auth check

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setEventImageFile(file);
      setEventImageUrl(''); // Clear current URL preview
      setFormError('');
      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/upload`,
          formData,
          { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setEventImageUrl(uploadRes.data.url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error('Error uploading image:', error);
        setFormError('Failed to upload image. Please try again.');
        setEventImageFile(null); // Clear file on error
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const removeImage = () => {
    setEventImageFile(null);
    setEventImageUrl('');
    setFormError('');
  };

  const onSubmit = async (data) => {
    if (selectedTags.length === 0) {
      setFormError('Please select at least one tag.');
      return;
    }
    setSaving(true);
    setFormError('');

    try {
      const locationString = data.venue + (data.room ? `, ${data.room}` : '');

      const updatedEventData = {
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        date: data.date,
        time: data.startTime,
        endTime: data.endTime,
        allDay: data.allDay,
        location: locationString,
        address: data.address,
        online: data.online,
        category: data.type,
        maxAttendees: parseInt(data.maxAttendees),
        tags: selectedTags,
        image: eventImageUrl, // Use the updated image URL
        requirements: data.requirements,
        contactInfo: data.contact,
        isPublic: data.public,
        // Status remains unchanged by user edit, handled by admin
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/events/${id}`,
        updatedEventData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success('Event updated successfully! (Admin approval might be required)');
        navigate(`/events/${id}`);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setFormError(error.response?.data?.message || 'Failed to update event. Please check your inputs.');
      toast.error(error.response?.data?.message || 'Failed to update event.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-purple-600 border-t-transparent" />
        <p className="text-gray-600 dark:text-gray-300 mt-4 ml-3">Loading event data...</p>
      </div>
    );
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
                onClick={() => navigate(`/events/${id}`)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  Edit Event
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Update details for your event
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        {formError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 p-3 rounded-lg mb-6 flex items-center justify-between"
          >
            <p>{formError}</p>
            <Button variant="ghost" size="sm" onClick={() => setFormError('')}><X className="w-4 h-4" /></Button>
          </motion.div>
        )}

        {/* Edit Event Form */}
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
                {eventImageUrl ? (
                  <div className="relative">
                    <img
                      src={eventImageUrl}
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
                    {uploadingImage ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 dark:text-gray-300">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Upload an event image (JPEG, PNG, GIF up to 5MB)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={uploadingImage}
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                        >
                          <Image className="w-4 h-4" />
                          <span>Choose Image</span>
                        </label>
                      </>
                    )}
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
                  Short Description <span className="text-red-500">*</span>
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
                  placeholder="Summarize your event in detail for listings..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Description (Optional)
                </label>
                <textarea
                  {...register('longDescription', {
                    minLength: {
                      value: 100,
                      message: 'Long description should be at least 100 characters for details page (optional)'
                    }
                  })}
                  rows={6}
                  placeholder="Provide a more detailed description for the event page..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                />
                {errors.longDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.longDescription.message}</p>
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
                      const selectedDate = new Date(value + 'T00:00:00');
                      const today = new Date();
                      today.setUTCHours(0, 0, 0, 0);
                      return selectedDate >= today || 'Event date cannot be in the past';
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
                      validate: value => {
                          const startTime = watch('startTime');
                          if (startTime && value && startTime >= value) {
                              return 'End time must be after start time';
                          }
                          return true;
                      }
                  })}
                  error={errors.endTime?.message}
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

              <InputField
                label="Venue Name"
                placeholder="e.g., Student Center"
                {...register('venue', {
                  required: watch('online') ? false : 'Venue name is required for physical events'
                })}
                error={errors.venue?.message}
                required={!watch('online')}
                disabled={watch('online')}
              />

              <InputField
                label="Room/Area (Optional)"
                placeholder="e.g., Room 201"
                {...register('room')}
                disabled={watch('online')}
              />

              <InputField
                label="Address (Optional)"
                placeholder="Enter full address, e.g. 123 Campus Dr, City, State"
                {...register('address', {
                    required: watch('online') ? false : 'Address is required for physical events'
                })}
                error={errors.address?.message}
                disabled={watch('online')}
                required={!watch('online')}
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
                  Select relevant tags (Choose at least 1)
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
                {selectedTags.length < 1 && (
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
                  Contact Information (for event inquiries)
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
                  Make this event public (visible to all students). Note: Requires Admin Approval.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/events/${id}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={saving || uploadingImage}
                disabled={!eventImageUrl && eventImageFile && !uploadingImage || selectedTags.length < 1}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditEventPage;