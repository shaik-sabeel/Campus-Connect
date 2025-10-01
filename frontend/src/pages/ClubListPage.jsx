import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import axios from 'axios'
import ClubCard from '../components/ClubCard' // NEW: ClubCard component
import {
  Search,
  Plus,
  Grid,
  List,
  SlidersHorizontal,
  X,
  Users // For generic club icon
} from 'lucide-react'

const ClubListPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClubsCount, setTotalClubsCount] = useState(0);

  const fetchClubs = async (currentPage = 1, currentSearchTerm = searchTerm, currentSelectedCategory = selectedCategory) => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page: currentPage,
        limit: 9, // Adjust limit as needed
        search: currentSearchTerm,
        category: currentSelectedCategory === 'all' ? '' : currentSelectedCategory
      }
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/clubs`, { params, withCredentials: true })
      setClubs(currentPage === 1 ? res.data?.clubs || [] : [...clubs, ...(res.data?.clubs || [])]);
      setTotalPages(res.data?.totalPages || 1);
      setTotalClubsCount(res.data?.total || 0);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load clubs')
      setClubs([]);
      setTotalClubsCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1);
    fetchClubs(1, searchTerm, selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory])

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchClubs(nextPage, searchTerm, selectedCategory);
  };


  const categories = [
    { value: 'all', label: 'All Clubs' },
    { value: 'Academic', label: 'Academic' },
    { value: 'Social', label: 'Social' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Professional', label: 'Professional' },
    { value: 'Service', label: 'Service' },
    { value: 'Other', label: 'Other' }
  ]

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setShowFilters(false);
  }


  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Discover Clubs
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Find communities, make connections, and join student organizations
              </p>
            </div>
            <Link to="/create-club">
              <Button className="hidden sm:flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create Club</span>
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clubs by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
              />
              {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:block">Categories</span>
              </button>

              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden"
            >
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => { setSelectedCategory(category.value); setShowFilters(false); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.value
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Loading / Error / Results Count */}
        {loading && clubs.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-600 dark:text-gray-300 mt-4">Loading clubs...</p>
          </div>
        ) : error ? (
            <div className="text-center py-12 text-red-600 dark:text-red-400">
                <p>{error}</p>
                <Button onClick={handleClearFilters} className="mt-4">Clear Filters</Button>
            </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <p className="text-gray-600 dark:text-gray-300">
                Showing {clubs.length} of {totalClubsCount} clubs
              </p>
            </motion.div>

            {/* Clubs Grid/List */}
            {clubs.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                }
              >
                {clubs.map((club, index) => (
                  <motion.div
                    key={club._id || club.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ClubCard club={club} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No clubs found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Try adjusting your search terms or categories
                </p>
                <Button onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </motion.div>
            )}

            {/* Load More Button */}
            {clubs.length > 0 && page < totalPages && ( !loading) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-12"
              >
                <Button variant="outline" size="lg" onClick={handleLoadMore} loading={loading}>
                  Load More Clubs
                </Button>
              </motion.div>
            )}
            {(page === totalPages && clubs.length > 0) && (
              <p className="text-center text-gray-600 dark:text-gray-300 mt-12">
                  You've reached the end of the club list!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ClubListPage