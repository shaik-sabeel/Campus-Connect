import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      )
      if (response.status === 200) {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login failed', error)
      setError(error?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl overflow-hidden">
        <div className="px-8 pt-8 pb-4 text-center bg-gradient-to-r from-indigo-600/10 to-fuchsia-600/10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to your Campus Connect account</p>
        </div>
        {error && (
          <div className="px-8 pt-4">
            <div className="text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2">
              {error}
            </div>
          </div>
        )}
        <form onSubmit={submitHandler} className="px-8 py-6 space-y-6">
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none'
              type='email'
              placeholder='email@example.com'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Password</label>
            <input
              className='w-full bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required type='password'
              placeholder='password'
            />
          </div>
          <button disabled={loading} className='w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold rounded-xl px-4 py-3 text-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-60'>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <p className='text-center text-sm text-gray-600 dark:text-gray-300'>New here? <Link to='/signup' className='text-indigo-600 font-semibold'>Create new Account</Link></p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
