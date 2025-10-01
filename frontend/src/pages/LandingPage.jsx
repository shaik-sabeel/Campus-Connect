import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import {
  Calendar,
  Users,
  Zap,
  Globe,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Smart Event Discovery',
      description: 'AI-powered recommendations based on your interests and schedule'
    },
    {
      icon: Users,
      title: 'Networking Made Easy',
      description: 'Connect with like-minded students and build meaningful relationships'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get instant notifications about events, RSVPs, and opportunities'
    },
    {
      icon: Globe,
      title: 'Campus-wide Reach',
      description: 'Access events from all departments, clubs, and organizations'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Active Students' },
    { number: '500+', label: 'Events Monthly' },
    { number: '50+', label: 'Campus Organizations' },
    { number: '95%', label: 'User Satisfaction' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      content: 'Campus Connect helped me discover amazing workshops and meet incredible people. It\'s transformed my college experience!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'Business Student',
      content: 'The networking opportunities through this platform are unmatched. I\'ve made connections that will last a lifetime.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Engineering Student',
      content: 'Finding relevant events was always a challenge. Now I get personalized recommendations that actually interest me.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-40 right-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2"
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <span className="text-yellow-300 font-semibold">Welcome to the Future</span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Campus
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Connect
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                Your smart hub for discovering events, networking with peers, and unlocking opportunities across campus.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Join Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Explore Events
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              {stats.slice(0, 2).map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-yellow-300">{stat.number}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - 3D Model */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[600px] lg:h-[700px]"
          >
            <div className="absolute inset-0 glass rounded-3xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 rounded-3xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-16 h-16" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">3D Scene Placeholder</h3>
                  <p className="text-white/80">Interactive 3D model would be here</p>
                  <p className="text-sm text-white/60 mt-2">
                    (See spline-integration-guide.js for instructions)
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <Star className="w-8 h-8 text-white" />
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }} // Increased amount
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose Campus Connect?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing how students discover, connect, and engage with campus life through smart technology and intuitive design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 text-center group hover:shadow-2xl"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-5xl lg:text-6xl font-bold mb-2">{stat.number}</div>
                <div className="text-xl text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of students who have transformed their campus experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-white space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of students who are already discovering amazing opportunities and building lasting connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Browse Events
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-6 text-blue-100">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free to join</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>No spam</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage