import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import {
  Users,
  ArrowLeft,
  Link as LinkIcon,
  MessageCircle,
  Share2,
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Facebook,
  Twitter,
  Instagram,
  User,
  ExternalLink
} from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify';

const ClubDetailsPage = ({ adminView = false }) => { // adminView can be used here too if admins see more detail or different view
  const { id } = useParams()
  const { user, isAuthenticated, refreshSession } = useAuth()
  const navigate = useNavigate();

  const [club, setClub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMember, setIsMember] = useState(false)
  const [showAdminMenu, setShowAdminMenu] = useState(false); // For admin approval

  const isOwner = user?._id === club?.owner?._id;
  const isUserAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchClub = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/clubs/${id}`, { withCredentials: true })
        setClub(res.data.club)
        if (user && res.data.club.members.some(member => member._id === user._id)) {
          setIsMember(true)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch club details.')
        console.error('Failed to fetch club details:', err);
      } finally {
        setLoading(false)
      }
    }
    fetchClub()
  }, [id, user, isAuthenticated]); // Refetch if user or id changes

  const handleJoinLeave = async () => {
    if (!isAuthenticated) {
        navigate('/login');
        return;
    }
    if (isOwner) {
      toast.warn("You own this club, you cannot leave it.");
      return;
    }

    setLoading(true);
    setError('');
    try {
        const endpoint = isMember ? `/clubs/${id}/leave` : `/clubs/${id}/join`;
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}${endpoint}`, {}, { withCredentials: true });

        // Update club members list locally and global user context
        setClub(prev => ({
            ...prev,
            members: isMember
                ? prev.members.filter(m => m._id !== user._id)
                : [...prev.members, { _id: user._id, firstname: user.firstname, lastname: user.lastname, avatar: user.avatar }]
        }));
        setIsMember(!isMember); // Toggle membership status
        toast.success(res.data.message);
        refreshSession(); // Refresh user context for any internal club memberships tracking
    } catch (err) {
        console.error(`Error ${isMember ? 'leaving' : 'joining'} club:`, err);
        toast.error(err.response?.data?.message || `Failed to ${isMember ? 'leave' : 'join'} club.`);
    } finally {
        setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: club.name,
        text: club.description,
        url: window.location.href,
      })
      .then(() => toast.info('Successfully shared'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.info('Club link copied to clipboard!'))
        .catch((error) => console.error('Failed to copy:', error));
    }
  }

  // Admin approval/rejection/delete actions
  const handleApproveClub = async () => {
    if (!isUserAdmin) return;
    setLoading(true);
    setError('');
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/clubs/${id}/approve`, {}, { withCredentials: true });
      setClub(prev => ({ ...prev, status: 'approved' }));
      toast.success('Club approved successfully!');
      setShowAdminMenu(false);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve club.');
      toast.error(err.response?.data?.message || 'Failed to approve club.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClub = async () => {
      if (!isUserAdmin) return;
      setLoading(true);
      setError('');
      const reason = prompt("Please provide a reason for rejecting this club (optional):");
      try {
          await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/clubs/${id}/reject`, { reason }, { withCredentials: true });
          setClub(prev => ({ ...prev, status: 'rejected' }));
          toast.success('Club rejected successfully.');
          setShowAdminMenu(false);
          navigate('/admin/dashboard');
      } catch (err) {
          setError(err.response?.data?.message || 'Failed to reject club.');
          toast.error(err.response?.data?.message || 'Failed to reject club.');
      } finally {
          setLoading(false);
      }
  };

  const handleDeleteClub = async () => {
    if (!isOwner && !isUserAdmin) return;
    if (!window.confirm("Are you sure you want to delete this club? This action cannot be undone.")) return;

    setLoading(true);
    setError('');
    try {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/clubs/${id}`, { withCredentials: true });
        toast.success('Club deleted successfully!');
        navigate('/clubs'); // Go back to clubs list
    } catch (err) {
        console.error('Error deleting club:', err);
        toast.error(err.response?.data?.message || 'Failed to delete club.');
        setError(err.response?.data?.message || 'Failed to delete club.');
    } finally {
        setLoading(false);
    }
};

const handleEditClub = () => {
  if (isOwner || isUserAdmin) {
    navigate(`/clubs/${id}/edit`); // This route would need to be created.
  }
};


  if (loading && !club) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex flex-col items-center justify-center text-center text-red-600 dark:text-red-400">
        <p className="text-xl font-semibold">{error}</p>
        <Link to="/clubs" className="mt-4 text-purple-600 hover:underline">Go back to clubs</Link>
      </div>
    )
  }

  if (!club) {
    return (
        <div className="min-h-screen pt-16 flex items-center justify-center text-center text-gray-700 dark:text-gray-300">
            <p>Club not found or you do not have permission to view it.</p>
            <Link to="/clubs" className="mt-4 text-purple-600 hover:underline">Go back to clubs</Link>
        </div>
    );
  }

  const getCategoryBackground = (category) => {
    switch (category) {
      case 'Academic': return 'bg-gradient-to-br from-blue-500 to-indigo-600';
      case 'Social': return 'bg-gradient-to-br from-green-500 to-emerald-600';
      case 'Sports': return 'bg-gradient-to-br from-red-500 to-orange-600';
      case 'Gaming': return 'bg-gradient-to-br from-purple-500 to-fuchsia-600';
      case 'Professional': return 'bg-gradient-to-br from-cyan-500 to-teal-600';
      case 'Service': return 'bg-gradient-to-br from-yellow-500 to-orange-600';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };


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
            to="/clubs"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clubs
          </Link>
          {adminView && isUserAdmin && (
             <Link
                to="/admin/dashboard"
                className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors ml-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin Dashboard
              </Link>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Club Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="relative mb-6">
                <img
                  src={club.image || `https://via.placeholder.com/800x400?text=${club.name.split(' ').slice(0,2).join('+')}`}
                  alt={club.name}
                  className="w-full h-64 lg:h-80 object-cover rounded-xl"
                />
                 {/* Club Status and Category Badge */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getCategoryBackground(club.category)}`}>
                    {club.category}
                  </span>
                   {(isOwner || isUserAdmin) && (
                     <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white
                         ${club.status === 'approved' ? 'bg-green-600' : ''}
                         ${club.status === 'pending' ? 'bg-yellow-600' : ''}
                         ${club.status === 'rejected' ? 'bg-red-600' : ''}
                     `}>
                       Status: {club.status?.charAt(0).toUpperCase() + club.status?.slice(1)}
                     </span>
                   )}
                </div>

                <div className="absolute top-4 right-4 flex space-x-2">
                    {/* Placeholder for favorite/bookmark functionality */}
                </div>
                 {/* Owner/Admin Action Menu (Edit, Delete, Admin Actions) */}
                 {(isOwner || isUserAdmin) && (
                     <div className="absolute bottom-4 left-4 z-10">
                             <div className="relative">
                                 <Button variant="ghost" onClick={() => setShowAdminMenu(!showAdminMenu)} size="sm" className="bg-white/20 dark:bg-gray-800/50">
                                     <MoreVertical className="w-4 h-4 text-white" />
                                 </Button>
                                 {showAdminMenu && (
                                     <motion.div
                                         initial={{ opacity: 0, y: -10 }}
                                         animate={{ opacity: 1, y: 0 }}
                                         exit={{ opacity: 0, y: -10 }}
                                         className="absolute left-0 mt-2 w-48 glass rounded-xl shadow-lg py-1"
                                     >
                                         {(isOwner && club.status !== 'approved') && (
                                           <button
                                               onClick={handleEditClub}
                                               className="w-full text-left px-4 py-2 flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-700 transition-colors duration-300 text-sm"
                                               disabled={loading}
                                           >
                                               <Pencil className="w-4 h-4" /> <span>Edit Club</span>
                                           </button>
                                         )}
                                         {(isOwner || isUserAdmin) && (
                                            <button
                                                onClick={handleDeleteClub}
                                                className="w-full text-left px-4 py-2 flex items-center space-x-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 transition-colors duration-300 text-sm"
                                                disabled={loading}
                                            >
                                                <Trash2 className="w-4 h-4" /> <span>Delete Club</span>
                                            </button>
                                         )}
                                         {/* Admin specific actions (for pending status from admin panel) */}
                                         {isUserAdmin && club.status === 'pending' && (
                                            <>
                                                <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>
                                                <button
                                                    onClick={handleApproveClub}
                                                    className="w-full text-left px-4 py-2 flex items-center space-x-2 text-green-600 hover:bg-green-100 dark:hover:bg-gray-700 transition-colors duration-300 text-sm"
                                                    disabled={loading}
                                                >
                                                    <CheckCircle className="w-4 h-4" /> <span>Approve</span>
                                                </button>
                                                <button
                                                    onClick={handleRejectClub}
                                                    className="w-full text-left px-4 py-2 flex items-center space-x-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 transition-colors duration-300 text-sm"
                                                    disabled={loading}
                                                >
                                                    <X className="w-4 h-4" /> <span>Reject</span>
                                                </button>
                                            </>
                                         )}
                                     </motion.div>
                                 )}
                             </div>
                     </div>
                 )}
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  {club.name}
                </h1>

                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300 flex-wrap">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>{club.members?.length || 0} Members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Founded: {new Date(club.createdAt).getFullYear()}</span>
                  </div>
                </div>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {club.description}
                </p>

              </div>
            </motion.div>


            {/* Club Description / About Section */}
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6"
            >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    About Our Club
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {club.description} {/* Reusing short description, expand with `longDescription` field if added */}
                    </p>
                </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join/Leave Club */}
            {(club.status === 'approved' && isAuthenticated) && ( // Only show if approved and user logged in
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-6 text-center"
                 >
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Membership
                    </h3>
                    {!isOwner ? (
                      <Button
                        variant={isMember ? 'outline' : 'primary'}
                        onClick={handleJoinLeave}
                        loading={loading}
                        disabled={loading}
                        className="w-full"
                      >
                        {isMember ? '✓ Joined' : 'Join Club'}
                      </Button>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300">You are the owner of this club.</p>
                    )}

                 </motion.div>
            )}
             {(!isAuthenticated && club.status === 'approved') && (
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-6 text-center"
                 >
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Join Our Community
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Log in to become a member and connect!</p>
                    <Link to="/login" className="btn-primary inline-flex items-center">
                        <Users className="w-4 h-4 mr-2" /> <span>Login to Join</span>
                    </Link>
                 </motion.div>
            )}


            {/* Club Owner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Club Owner
              </h3>
              {club.owner && (
                <div className="flex items-center space-x-3">
                  <img
                    src={club.owner.avatar || 'https://placehold.co/48x48?text=O'}
                    alt={`${club.owner.firstname} ${club.owner.lastname}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {club.owner.firstname} {club.owner.lastname}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {club.owner.department || 'Student/Faculty'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Club Members */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Club Members ({club.members?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {(club.members?.length || 0) > 0 ? (
                  club.members.slice(0, 5).map((member) => (
                    <img
                      key={member._id}
                      src={member.avatar || 'https://placehold.co/32x32?text=M'}
                      alt={`${member.firstname} ${member.lastname}`}
                      className="w-8 h-8 rounded-full object-cover"
                      title={`${member.firstname} ${member.lastname}`}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No members yet. Be the first to join!</p>
                )}

                {(club.members?.length || 0) > 5 && (
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
                    +{(club.members?.length || 0) - 5}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Connect with Us
              </h3>
              <div className="space-y-3">
                {club.socialLinks?.website && (
                  <a
                    href={club.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <LinkIcon className="w-5 h-5" />
                    <span>Visit Website</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                  </a>
                )}
                {club.socialLinks?.facebook && (
                  <a
                    href={club.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook</span>
                     <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                  </a>
                )}
                {club.socialLinks?.twitter && (
                  <a
                    href={club.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-blue-400 hover:text-blue-500 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    <span>Twitter</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                  </a>
                )}
                {club.socialLinks?.instagram && (
                  <a
                    href={club.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>Instagram</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                  </a>
                )}
                 {(!club.socialLinks?.website && !club.socialLinks?.facebook && !club.socialLinks?.twitter && !club.socialLinks?.instagram) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No social links yet.</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubDetailsPage