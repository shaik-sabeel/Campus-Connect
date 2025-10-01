import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Award,
  Link as LinkIcon,
  Tag,
  Star,
  CheckCircle,
  Clock // For createdAt/updatedAt
} from 'lucide-react';
import Button from './Button'; // Assuming you have a Button component
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const ClubCard = ({ club, viewMode = 'grid' }) => {
  const { user, isAuthenticated, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(club.members?.includes(user?._id) || false);
  const [loading, setLoading] = useState(false);
  const isOwner = user?._id === club?.owner?._id;

  // Update isMember when user or club.members change
  useEffect(() => {
    setIsMember(club.members?.some(memberId => memberId === user?._id) || false);
  }, [user, club.members]);

  const handleJoinLeave = async (e) => {
    e.preventDefault(); // Prevent navigating to club details
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isOwner) {
      toast.warn("You cannot leave a club you own. Consider deleting or transferring ownership.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isMember ? `/clubs/${club._id}/leave` : `/clubs/${club._id}/join`;
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}${endpoint}`, {}, { withCredentials: true });
      
      toast.success(res.data.message);
      setIsMember(!isMember); // Toggle membership status
      // Optionally, refresh clubs list in parent or update `club.members` directly if efficient.
      // For now, simpler to toggle client-side state for responsiveness.
      refreshSession(); // Refresh user profile (if user's club list needs to update)
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isMember ? 'leave' : 'join'} club.`);
      console.error(`Error ${isMember ? 'leaving' : 'joining'} club:`, err);
    } finally {
      setLoading(false);
    }
  };


  const getCategoryColor = (category) => {
    switch (category) {
      case 'Academic': return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'Social': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'Sports': return 'bg-gradient-to-r from-red-500 to-orange-600';
      case 'Gaming': return 'bg-gradient-to-r from-purple-500 to-fuchsia-600';
      case 'Professional': return 'bg-gradient-to-r from-cyan-500 to-teal-600';
      case 'Service': return 'bg-gradient-to-r from-yellow-500 to-orange-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };
    const renderClubStatusBadge = (status) => {
      switch (status) {
          case 'pending':
              return <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-yellow-600">Pending</span>;
          case 'rejected':
              return <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-red-600">Rejected</span>;
          case 'approved':
          default: // Approved or no specific status should show normal category badge
              return (
                  <span className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(club.category)}`}>
                    {club.category}
                  </span>
              );
      }
  };


  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="card p-6"
      >
        <Link to={`/clubs/${club._id || club.id}`} className="flex flex-col md:flex-row gap-6 group">
          <div className="md:w-48 h-32 md:h-40 rounded-xl overflow-hidden flex-shrink-0 relative">
            <img
              src={club.image || `https://via.placeholder.com/400x200?text=${club.name.split(' ').slice(0,2).join('+')}`}
              alt={club.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {renderClubStatusBadge(club.status)}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {club.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
              {club.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{club.members?.length || 0} members</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Founded: {new Date(club.createdAt).getFullYear()}</span>
              </div>
            </div>
             <div className="mt-auto flex justify-between items-center">
                 <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
                    <User className="w-4 h-4" />
                    <span>Owner: {club.owner?.firstname} {club.owner?.lastname}</span>
                 </div>
                 {isAuthenticated && !isOwner && (
                    <Button
                        variant={isMember ? 'outline' : 'primary'}
                        size="sm"
                        loading={loading}
                        onClick={handleJoinLeave}
                        className="ml-auto"
                    >
                        {isMember ? 'Joined' : 'Join Club'}
                    </Button>
                )}
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card p-0 overflow-hidden cursor-pointer group"
    >
      <Link to={`/clubs/${club._id || club.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={club.image || `https://via.placeholder.com/400x200?text=${club.name.split(' ').slice(0,2).join('+')}`}
            alt={club.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {renderClubStatusBadge(club.status)}
        </div>

        <div className="p-6 flex flex-col h-[calc(100%-12rem)]"> {/* Adjust height for content below image */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {club.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
            {club.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Users className="w-4 h-4" />
              <span>{club.members?.length || 0} members</span>
            </div>
             <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="w-4 h-4" />
                <span>Owner: {club.owner?.firstname} {club.owner?.lastname}</span>
             </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4" />
              <span>Founded: {new Date(club.createdAt).getFullYear()}</span>
            </div>
          </div>
          {isAuthenticated && !isOwner ? (
            <Button
              variant={isMember ? 'outline' : 'primary'}
              onClick={handleJoinLeave}
              loading={loading}
              className="mt-auto block w-full"
            >
              {isMember ? 'Joined' : 'Join Club'}
            </Button>
          ) : (
            <Link
                to={`/clubs/${club._id || club.id}`}
                className="block w-full text-center py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold"
            >
              View Details
            </Link>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default ClubCard;