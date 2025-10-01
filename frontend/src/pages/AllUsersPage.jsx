// frontend/src/pages/AllUsersPage.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Users,
  Search,
  Mail,
  User,
  ArrowLeft,
  ChevronsUpDown,
  Ban,
  Filter,
  RefreshCcw,
  UserPlus,
  X,
  ExternalLink
} from 'lucide-react'
import axios from 'axios'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const AllUsersPage = () => {
  const { user: currentUser, isAuthenticated } = useAuth(); // Current logged-in user
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('registeredDate');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [refreshKey, setRefreshKey] = useState(0);

  const roles = ['all', 'user', 'admin'];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/users`, { withCredentials: true });
        setUsers(res.data?.users || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users.');
        console.error('Fetch users error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && currentUser?.role === 'admin') {
      fetchUsers();
    } else {
        // Should ideally be caught by AdminProtectedRoute, but defensive
        navigate('/dashboard', { replace: true, state: { message: 'Admin access required' } });
    }
  }, [isAuthenticated, currentUser, navigate, refreshKey]);

  const sortedAndFilteredUsers = [...users]
    .filter(u => {
      const first = (u.fullname?.firstname || u.firstname || '').toLowerCase();
      const last = (u.fullname?.lastname || u.lastname || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const dept = (u.department || '').toLowerCase();
      const term = (searchTerm || '').toLowerCase();
      const matchesSearch = first.includes(term) || last.includes(term) || email.includes(term) || dept.includes(term);
      const matchesRole = filterRole === 'all' || u.role === filterRole;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'registeredDate') {
        comparison = new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (sortBy === 'name') {
        const aLast = (a.fullname?.lastname || a.lastname || '').toString();
        const bLast = (b.fullname?.lastname || b.lastname || '').toString();
        comparison = aLast.localeCompare(bLast);
      } else if (sortBy === 'role') {
        comparison = (a.role || '').localeCompare(b.role || '');
      } else if (sortBy === 'email') {
        comparison = (a.email || '').localeCompare(b.email || '');
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc'); // Default to ascending when changing sort column
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    if (currentUser._id === userId && newRole === 'user') {
      toast.error("You cannot demote your own admin role via this panel.");
      return;
    }
    
    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/users/${userId}/role`, { role: newRole }, { withCredentials: true });
      toast.success(`User role updated to ${newRole} successfully!`);
      setRefreshKey(prev => prev + 1); // Trigger re-fetch of users
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user role.');
      console.error('Error updating user role:', err);
    } finally {
      setLoading(false);
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
          <div className="flex items-center space-x-4 mb-4">
             <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                All Users
              </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage user accounts, roles, and profiles across Campus Connect.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 mb-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end"
        >
            <div className="relative col-span-full md:col-span-2 lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by name, email, or department..."
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

            <div>
                <label htmlFor="filterRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Role</label>
                <select
                    id="filterRole"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300"
                >
                    {roles.map(role => (
                        <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                    ))}
                </select>
            </div>

            <Button
                onClick={() => {setSearchTerm(''); setFilterRole('all'); setRefreshKey(prev => prev + 1); }}
                variant="outline"
                className="w-full md:w-auto"
                size="md"
            >
                <RefreshCcw className="w-5 h-5 mr-2" />
                Clear Filters
            </Button>
        </motion.div>

        {loading && users.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-600 dark:text-gray-300 mt-4 ml-3">Loading users...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              All Users ({sortedAndFilteredUsers.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-4 font-semibold text-gray-700 dark:text-gray-200 rounded-tl-xl">Avatar</th>
                    <th className="p-4 font-semibold text-gray-700 dark:text-gray-200 cursor-pointer" onClick={() => handleSort('name')}>
                        <div className="flex items-center space-x-1">
                            <span>Name</span>
                            <ChevronsUpDown className="w-4 h-4 text-gray-500"/>
                        </div>
                    </th>
                    <th className="p-4 font-semibold text-gray-700 dark:text-gray-200 cursor-pointer" onClick={() => handleSort('email')}>
                         <div className="flex items-center space-x-1">
                            <span>Email</span>
                            <ChevronsUpDown className="w-4 h-4 text-gray-500"/>
                        </div>
                    </th>
                    <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Department</th>
                    <th className="p-4 font-semibold text-gray-700 dark:text-gray-200 cursor-pointer" onClick={() => handleSort('role')}>
                         <div className="flex items-center space-x-1">
                            <span>Role</span>
                            <ChevronsUpDown className="w-4 h-4 text-gray-500"/>
                        </div>
                    </th>
                    <th className="p-4 font-semibold text-gray-700 dark:text-gray-200 rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredUsers.length > 0 ? (
                    sortedAndFilteredUsers.map((u, index) => (
                      <motion.tr
                        key={u._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="p-4">
                            <img
                                src={u.avatar || 'https://placehold.co/40x40?text=U'}
                                alt={u.firstname}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        </td>
                        <td className="p-4 text-gray-900 dark:text-white font-semibold">
                            {(u.fullname?.firstname || u.firstname || '')} {(u.fullname?.lastname || u.lastname || '')}
                        </td>
                        <td className="p-4 text-gray-700 dark:text-gray-300">{u.email}</td>
                        <td className="p-4 text-gray-700 dark:text-gray-300">{u.department}</td>
                        <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                ${u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''}
                                ${u.role === 'user' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                            `}>
                                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                            </span>
                        </td>
                        <td className="p-4 space-x-2">
                          {u._id !== currentUser._id ? ( // Cannot change current user's role here
                            u.role === 'user' ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateUserRole(u._id, 'admin')}
                                    disabled={loading}
                                >
                                    Make Admin
                                </Button>
                            ) : (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleUpdateUserRole(u._id, 'user')}
                                    disabled={loading}
                                >
                                    Demote
                                </Button>
                            )
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">Self</span>
                          )}
                          <Link to={`/profile/${u._id}`} className="text-gray-600 dark:text-gray-300 hover:text-purple-600">
                             <Button variant="ghost" size="sm" onClick={() => navigate(`/profile?id=${u._id}`)} className="flex items-center justify-center"> {/* Placeholder route/prop for viewing other user profile */}
                               <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-600 dark:text-gray-300">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AllUsersPage