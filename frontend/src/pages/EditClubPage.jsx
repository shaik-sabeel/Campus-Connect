// frontend/src/pages/EditClubPage.jsx
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
  X,
  Save,
  ArrowLeft,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';


const EditClubPage = () => {
  const { id } = useParams(); // Get club ID from URL
  const { user, isAuthenticated } = useAuth(); // To check if current user is owner or admin
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // Loading initial club data
  const [saving, setSaving] = useState(false); // Loading state for saving changes
  const [clubImageFile, setClubImageFile] = useState(null);
  const [clubImageUrl, setClubImageUrl] = useState(''); // Current/new image URL
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const clubCategories = [
    { value: '', label: 'Select club category' },
    { value: 'Academic', label: 'Academic' },
    { value: 'Social', label: 'Social' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Professional', label: 'Professional' },
    { value: 'Service', label: 'Service' },
    { value: 'Other', label: 'Other' }
  ];

  // --- Fetch Club Data for Editing ---
  useEffect(() => {
    const fetchClubData = async () => {
      if (!isAuthenticated) {
        toast.error("You need to be logged in to edit clubs.");
        navigate('/login', { state: { from: `/clubs/${id}/edit` } });
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/clubs/${id}`, { withCredentials: true });
        const clubData = res.data.club;

        // Authorization check (only owner or admin can edit)
        if (clubData.owner._id !== user._id && user.role !== 'admin') {
          toast.error("You are not authorized to edit this club.");
          navigate(`/clubs/${id}`);
          return;
        }

        // Set form default values based on fetched club data
        reset({
          name: clubData.name,
          description: clubData.description,
          category: clubData.category,
          website: clubData.socialLinks?.website || '',
          facebook: clubData.socialLinks?.facebook || '',
          twitter: clubData.socialLinks?.twitter || '',
          instagram: clubData.socialLinks?.instagram || ''
        });
        setClubImageUrl(clubData.image || ''); // Set current image URL

      } catch (err) {
        setFormError(err.response?.data?.message || 'Failed to load club for editing.');
        toast.error(err.response?.data?.message || 'Failed to load club for editing.');
        navigate(`/clubs/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchClubData();
  }, [id, user, isAuthenticated, navigate, reset]);

  // --- Image Upload Handling ---
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setClubImageFile(file);
      setClubImageUrl(''); // Clear previous URL preview temporarily
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
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error('Error uploading image:', error);
        setFormError('Failed to upload image. Please try again.');
        setClubImageFile(null); // Clear file input on error
        setClubImageUrl(''); // Revert URL on error
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const removeImage = () => {
    setClubImageFile(null);
    setClubImageUrl('');
    setFormError('');
  };

  // --- Form Submission ---
  const onSubmit = async (data) => {
    setSaving(true);
    setFormError('');

    try {
      const updatedClubData = {
        name: data.name,
        description: data.description,
        category: data.category,
        image: clubImageUrl, // Use the updated image URL
        socialLinks: {
          website: data.website || '',
          facebook: data.facebook || '',
          twitter: data.twitter || '',
          instagram: data.instagram || ''
        }
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/clubs/${id}`,
        updatedClubData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success('Club updated successfully! (Admin re-approval might be required if critical fields changed)');
        navigate(`/clubs/${id}`); // Redirect back to club details
      }
    } catch (error) {
      console.error('Error updating club:', error);
      setFormError(error.response?.data?.message || 'Failed to update club. Please check your inputs.');
      toast.error(error.response?.data?.message || 'Failed to update club.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-purple-600 border-t-transparent" />
        <p className="text-gray-600 dark:text-gray-300 mt-4 ml-3">Loading club data...</p>
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
                onClick={() => navigate(`/clubs/${id}`)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                aria-label="Back to Club Details"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  Edit Club
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Update details for your club
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

        {/* Edit Club Form */}
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
                {clubImageUrl ? (
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
                      title="Remove image"
                      disabled={saving || uploadingImage}
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
                          disabled={uploadingImage || saving}
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
                disabled={saving || uploadingImage}
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
                  disabled={saving || uploadingImage}
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
                  disabled={saving || uploadingImage}
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
                disabled={saving || uploadingImage}
              />
              <InputField
                label="Facebook URL"
                placeholder="e.g., https://facebook.com/yourclub"
                {...register('facebook')}
                type="url"
                icon={<Facebook className="w-5 h-5 text-gray-400" />}
                disabled={saving || uploadingImage}
              />
              <InputField
                label="Twitter URL"
                  placeholder="e.g., https://twitter.com/yourclub"
                {...register('twitter')}
                type="url"
                icon={<Twitter className="w-5 h-5 text-gray-400" />}
                disabled={saving || uploadingImage}
              />
              <InputField
                label="Instagram URL"
                placeholder="e.g., https://instagram.com/yourclub"
                {...register('instagram')}
                type="url"
                icon={<Instagram className="w-5 h-5 text-gray-400" />}
                disabled={saving || uploadingImage}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/clubs/${id}`)}
                disabled={saving || uploadingImage}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={saving || uploadingImage}
                disabled={saving || uploadingImage}
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

export default EditClubPage;