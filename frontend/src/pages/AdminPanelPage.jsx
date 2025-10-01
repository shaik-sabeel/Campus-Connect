// frontend/src/pages/AdminPanelPage.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
// frontend/src/pages/AdminPanelPage.jsx
// frontend/src/pages/AllUsersPage.jsx
import {
  Users,
  Search,
  Mail,
  User,
  ArrowLeft,
  ChevronsUpDown,
  // REMOVE CircleCheck, ADD CheckCircle
  CheckCircle, // Change from CircleCheck
  Ban,
  Filter,
  RefreshCcw,
  UserPlus,
  // Added missing icons used below
  Calendar,
  AlertCircle,
  ClipboardCheck,
  Building2,
  Clock,
  ExternalLink,
  ClipboardX,
  Activity,
  HardHat
} from 'lucide-react';
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import { toast } from 'react-toastify'


const AdminPanelPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    pendingEvents: 0,
    approvedEvents: 0,
    totalClubs: 0,
    pendingClubs: 0,
  });
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingClubs, setPendingClubs] = useState([]); // ADDED: Pending clubs state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Used to re-fetch data

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError('');
      try {
        const statsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/stats`, { withCredentials: true });
        setStats(statsRes.data);

        // Fetch all events and filter client-side for pending
        const eventsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/events`, { withCredentials: true });
        const events = eventsRes.data?.events || [];
        setPendingEvents(events.filter(e => e.status === 'pending'));

        // Optional: Pending clubs endpoint may not exist yet; keep empty without failing
        try {
          const pendingClubsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/clubs/pending`, { withCredentials: true });
          setPendingClubs(pendingClubsRes.data?.clubs || []);
        } catch (_) {
          setPendingClubs([]);
        }

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch admin data.');
        console.error('Admin data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') { // Only fetch if admin
      fetchAdminData();
    } else {
        console.warn("Non-admin user tried to access AdminPanelPage. Redirection expected.");
    }
  }, [user, navigate, refreshKey]); // Refresh data on `refreshKey` change


  const handleApproveReject = async (itemId, type, action) => { // Unified handler for events/clubs
    if (!window.confirm(`Are you sure you want to ${action} this ${type}?`)) return;

    setLoading(true);
    try {
        const endpoint = `${import.meta.env.VITE_BASE_URL}/admin/${type}s/${itemId}/${action}`;
        let reason = '';
        if (action === 'reject') {
            reason = prompt(`Optional: Provide a reason for rejecting this ${type}.`);
        }
        
        await axios.patch(endpoint, { reason }, { withCredentials: true });
        toast.success(`${type} ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
        setRefreshKey(prev => prev + 1); // Trigger refresh
    } catch (err) {
        toast.error(err.response?.data?.message || `Failed to ${action} ${type}.`);
        console.error(`Error ${action} ${type}:`, err);
    } finally {
        setLoading(false);
    }
  };

  const getCategoryColorClass = (type) => {
    switch (type) {
      case 'Workshop': case 'Academic': return 'text-blue-600';
      case 'Conference': case 'Professional': return 'text-purple-600';
      case 'Social': return 'text-green-600';
      case 'Sports': return 'text-red-600';
      case 'Arts': return 'text-pink-600';
      case 'Career': return 'text-cyan-600';
      case 'Gaming': return 'text-indigo-600';
      case 'Science': return 'text-lime-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
            <HardHat className="w-8 h-8 text-indigo-600"/>
            <span>Admin Dashboard</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Overview of campus activity and content moderation
          </p>
        </motion.div>

        {loading ? (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
            </div>
        ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 p-4 rounded-lg">
                <p>{error}</p>
            </div>
        ) : (
          <>
            {/* Overview Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            >
              <div className="card p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="card p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEvents}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="card p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Pending Events</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingEvents}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="card p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Approved Events</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.approvedEvents}</p>
                </div>
                <ClipboardCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
               <div className="card p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Clubs</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalClubs}</p>
                </div>
                <Building2 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
               <div className="card p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Pending Clubs</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingClubs}</p>
                </div>
                <Clock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Events for Approval */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card p-6 mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Pending Events ({stats.pendingEvents})
                  </h2>

                  {pendingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {pendingEvents.map((event) => (
                        <div key={event._id} className="flex flex-col sm:flex-row items-center sm:items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <img
                            src={event.image || `https://via.placeholder.com/64?text=${event.title.split(' ')[0]}`}
                            alt={event.title}
                            className="w-16 h-16 rounded-lg object-cover mb-4 sm:mb-0 sm:mr-4"
                          />
                          <div className="flex-1 text-center sm:text-left">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                              <Link to={`/events/${event._id}`} className="hover:underline">
                                {event.title}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              by {event.organizer?.fullname?.firstname} {event.organizer?.fullname?.lastname} (Category: <span className={`${getCategoryColorClass(event.category)}`}>{event.category}</span>)
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                               {new Date(event.date).toLocaleDateString()} at {event.time} | {event.location}
                            </p>
                          </div>
                          <div className="mt-4 sm:mt-0 flex space-x-2 sm:ml-4 flex-shrink-0">
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/events/${event._id}?adminView=true`)}
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center px-3"
                            >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View
                            </Button>
                            <Button
                              onClick={() => handleApproveReject(event._id, 'event', 'approve')}
                              disabled={loading}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 flex items-center justify-center px-3"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleApproveReject(event._id, 'event', 'reject')}
                              disabled={loading}
                              size="sm"
                              className="flex items-center justify-center px-3"
                            >
                              <ClipboardX className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 text-center">No events currently pending approval.</p>
                  )}
                </motion.div>

                {/* Pending Clubs for Approval - Guarded if no data */}
                {pendingClubs && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-6 mb-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Pending Clubs ({stats.pendingClubs})
                    </h2>

                    {pendingClubs.length > 0 ? (
                      <div className="space-y-4">
                        {pendingClubs.map((club) => (
                          <div key={club._id} className="flex flex-col sm:flex-row items-center sm:items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <img
                              src={club.image || `https://via.placeholder.com/64?text=${club.name.split(' ')[0]}`}
                              alt={club.name}
                              className="w-16 h-16 rounded-lg object-cover mb-4 sm:mb-0 sm:mr-4"
                            />
                            <div className="flex-1 text-center sm:text-left">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                <Link to={`/clubs/${club._id}`} className="hover:underline">
                                  {club.name}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                by {club.owner?.firstname} {club.owner?.lastname} (Category: <span className={`${getCategoryColorClass(club.category)}`}>{club.category}</span>)
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                 Created: {new Date(club.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex space-x-2 sm:ml-4 flex-shrink-0">
                               <Button
                                  variant="outline"
                                  onClick={() => navigate(`/clubs/${club._id}`)}
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center px-3"
                                >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    View
                                </Button>
                                <Button
                                  onClick={() => handleApproveReject(club._id, 'club', 'approve')}
                                  disabled={loading}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 flex items-center justify-center px-3"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="danger"
                                  onClick={() => handleApproveReject(club._id, 'club', 'reject')}
                                  disabled={loading}
                                  size="sm"
                                  className="flex items-center justify-center px-3"
                                >
                                  <ClipboardX className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300 text-center">No clubs currently pending approval.</p>
                    )}
                  </motion.div>
                )}
            </div>

            {/* Other Admin Tools - All Users, Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                {/* All Users Management */}
                <div className="card p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Manage Users
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        View and manage all user accounts on the platform.
                    </p>
                    <Link to="/admin/users">
                        <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>View All Users</span>
                        </Button>
                    </Link>
                </div>

                {/* Platform Settings */}
                <div className="card p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Platform Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Configure global settings for Campus Connect (e.g., categories, rules).
                    </p>
                     <Button variant="outline" className="w-full flex items-center justify-center space-x-2"
                        onClick={() => toast.info("Platform settings page coming soon!")}
                    >
                        <Activity className="w-5 h-5" />
                        <span>Go to Settings</span>
                    </Button>
                </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminPanelPage