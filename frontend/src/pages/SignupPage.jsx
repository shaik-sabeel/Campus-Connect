import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const SignupPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [studentId, setStudentId] = useState('')
  const [interestsSelected, setInterestsSelected] = useState([])
  const [terms, setTerms] = useState(false)
  const [error, setError] = useState('')
   const [ userData, setUserData ] = useState({})

  const interests = [
    'Technology', 'Business', 'Arts', 'Sports', 'Science', 'Music',
    'Photography', 'Writing', 'Volunteering', 'Entrepreneurship',
    'Research', 'Design', 'Gaming', 'Travel', 'Food', 'Fitness'
  ]

  const departments = [
    'Computer Science', 'Business Administration', 'Engineering',
    'Medicine', 'Arts & Humanities', 'Social Sciences',
    'Natural Sciences', 'Education', 'Law', 'Other'
  ]

  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD']

  


  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const newUser = {
        fullname: {
          firstname: firstName,
          lastname: lastName
        },
        email,
        password,
        department,
        academicYear: year,
        studentID: studentId || '',
        interests: interestsSelected
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser,
        { withCredentials: true }
      )
      if (response.status === 201) {
        // Confirm session cookie by pinging profile, then go to dashboard
        try { await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, { withCredentials: true }) } catch (_) {}
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Signup failed', err)
      setError(err?.response?.data?.message || 'Signup failed')
    } finally {
      setEmail('')
      setFirstName('')
      setLastName('')
      setPassword('')
      setConfirmPassword('')
      setDepartment('')
      setYear('')
      setStudentId('')
      setInterestsSelected([])
      setTerms(false)
      setLoading(false)
    }
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 flex items-center justify-center p-6 py-9">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl overflow-hidden">
        <div className="px-8 pt-8 pb-4 text-center bg-gradient-to-r from-indigo-600/10 to-fuchsia-600/10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Join Campus Connect</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Create your account and start connecting with your campus community</p>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Basic Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>First name</label>
                <input
                  required
                  className='w-full bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none'
                  type="text"
                  placeholder='First name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Last name</label>
                <input
                  required
                  className='w-full bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none'
                  type="text"
                  placeholder='Last name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none'
              type="email"
              placeholder='email@example.com'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Password</label>
              <input
                className='w-full bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required type="password"
                placeholder='password'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Confirm Password</label>
              <input
                className='w-full bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required type="password"
                placeholder='confirm password'
              />
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>Academic Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Department</label>
                <select
                  className='w-full bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 text-base focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none'
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value=''>Select your department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Year</label>
                <select
                  className='w-full bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 text-base focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none'
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value=''>Select your year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='mt-4'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Student ID (optional)</label>
              <input
                className='w-full bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none'
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                type="text"
                placeholder='Student ID'
              />
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>Interests</h3>
            <div className='flex flex-wrap gap-2'>
              {interests.map((interest) => {
                const checked = interestsSelected.includes(interest)
                return (
                  <label key={interest} className={`px-3 py-1.5 rounded-full border text-sm cursor-pointer select-none transition-colors ${checked ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-indigo-400'}`}>
                    <input
                      type='checkbox'
                      className='hidden'
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setInterestsSelected([...interestsSelected, interest])
                        } else {
                          setInterestsSelected(interestsSelected.filter((i) => i !== interest))
                        }
                      }}
                    />
                    {interest}
                  </label>
                )
              })}
            </div>
          </div>

          <div className='flex items-start gap-3'>
            <input
              id='terms'
              type='checkbox'
              className='mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <label htmlFor='terms' className='text-sm text-gray-700 dark:text-gray-300'>
              I agree to the <span className='underline'>Terms of Service</span> and <span className='underline'>Privacy Policy</span>
            </label>
          </div>

          <button disabled={loading} className='w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold rounded-xl px-4 py-3 text-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-60'>
            {loading ? 'Creating...' : 'Create account'}
          </button>

          <p className='text-center text-sm text-gray-600 dark:text-gray-300'>Already have an account? <Link to='/login' className='text-indigo-600 font-semibold'>Login here</Link></p>
        </form>
      </div>
    </div>
  )
}

export default SignupPage
