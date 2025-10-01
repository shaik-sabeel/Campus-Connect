import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import Button from '../components/Button'
import InputField from '../components/InputField'
import axios from 'axios'
import {
  Users,
  Image,
  Upload,
  Plus,
  X,
  Save,
  ArrowLeft,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react'
import { toast } from 'react-toastify';


const CreateClubPage = () => {
  const [loading, setLoading] = useState(false)
  const [clubImageFile, setClubImageFile] = useState(null)
  const [clubImageUrl, setClubImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formError, setFormError] = useState('');

  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();

  const clubCategories = [
    { value: '', label: 'Select club category' },
    { value: 'Academic', label: 'Academic' },
    { value: 'Social', label: 'Social' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Professional', label: 'Professional' },
    { value: 'Service', label: 'Service' },
    { value: 'Other', label: 'Other' }
  ]

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError('');

    try {
      let finalImageUrl = clubImageUrl;
      if (clubImageFile && !clubImageUrl) {
         setFormError('Please wait for the image to upload or upload a club image.');
         setLoading(false);
         return;
      }

      const clubData = {
        name: data.name,
        description: data.description,
        category: data.category,
        image: finalImageUrl,
        socialLinks: {
          website: data.website || '',
          facebook: data.facebook || '',
          twitter: data.twitter || '',
          instagram: data.instagram || ''
        }
      };
      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/clubs`,
        clubData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success('Club created successfully and is pending admin approval! It will be visible on the clubs page once approved.');
        navigate('/dashboard'); // Go back to dashboard after creation
      }
    } catch (error) {
      console.error('Error creating club:', error);
      setFormError(error.response?.data?.message || 'Failed to create club. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setClubImageFile(file);
      setClubImageUrl(''); // Clear previous URL
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
          setClubImageUrl(uploadRes.data.url);
      } catch (error) {
          console.error('Error uploading image:', error);
          setFormError('Failed to upload image. Please try again.');
          setClubImageFile(null);
      } finally {
          setUploadingImage(false);
      }
    }
  }

  const removeImage = () => {
    setClubImageFile(null);
    setClubImageUrl('');
    setFormError('');
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
                onClick={() => navigate('/clubs')}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  Create New Club
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Register your student organization or community
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
            <Button variant="ghost" size="sm" onClick={() => setFormError('')}><X className="w-4 h-4"/></Button>
          </motion.div>
        )}

        {/* Create Club Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Club Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Club Banner Image
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                {clubImageFile && clubImageUrl ? (
                  <div className="relative">
                    <img
                      src={clubImageUrl}
                      alt="Club preview"
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
                          Upload a banner image for your club
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="club-image-upload"
                          disabled={uploadingImage}
                        />
                        <label
                          htmlFor="club-image-upload"
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
                Club Information
              </h2>

              <InputField
                label="Club Name"
                placeholder="Enter club name"
                {...register('name', {
                  required: 'Club name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters'
                  }
                })}
                error={errors.name?.message}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Club Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description', {
                    required: 'Club description is required',
                    minLength: {
                      value: 10,
                      message: 'Description must be at least 10 characters'
                    }
                  })}
                  rows={4}
                  placeholder="Describe your club's mission, activities, and goals..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category', { required: 'Club category is required' })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                >
                  {clubCategories.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Social Links (Optional)
              </h2>

              <InputField
                label="Website URL"
                placeholder="e.g., https://yourclub.org"
                {...register('website')}
                type="url"
              />
              <InputField
                label="Facebook URL"
                placeholder="e.g., https://facebook.com/yourclub"
                {...register('facebook')}
                type="url"
                icon={<Facebook className="w-5 h-5 text-gray-400" />} // Optional: Add icons directly to InputField
              />
              <InputField
                label="Twitter URL"
                placeholder="e.g., https://twitter.com/yourclub"
                {...register('twitter')}
                type="url"
                icon={<Twitter className="w-5 h-5 text-gray-400" />}
              />
              <InputField
                label="Instagram URL"
                placeholder="e.g., https://instagram.com/yourclub"
                {...register('instagram')}
                type="url"
                icon={<Instagram className="w-5 h-5 text-gray-400" />}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/clubs')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading || uploadingImage}
                disabled={!clubImageUrl && clubImageFile && !uploadingImage}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Create Club</span>
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default CreateClubPage