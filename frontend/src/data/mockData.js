// Mock data for events - replace with real API calls
export const mockEvents = [
  {
    id: 1,
    title: 'Tech Innovation Workshop',
    description: 'Learn about the latest trends in technology and innovation. Hands-on workshops and expert talks.',
    date: '2024-01-15',
    time: '2:00 PM',
    location: 'Computer Science Building',
    attendees: 45,
    maxAttendees: 60,
    type: 'workshop',
    tags: ['technology', 'innovation', 'workshop'],
    image: 'https://picsum.photos/400/200?random=1',
    isLiked: false
  },
  {
    id: 2,
    title: 'Career Fair 2024',
    description: 'Connect with top companies and explore career opportunities. Bring your resume and network with industry professionals.',
    date: '2024-01-18',
    time: '10:00 AM',
    location: 'Student Center',
    attendees: 120,
    maxAttendees: 200,
    type: 'conference',
    tags: ['career', 'networking', 'jobs'],
    image: 'https://picsum.photos/400/200?random=2',
    isLiked: true
  },
  {
    id: 3,
    title: 'Basketball Tournament',
    description: 'Annual inter-department basketball tournament. Teams of 8 players each. Registration required.',
    date: '2024-01-20',
    time: '6:00 PM',
    location: 'Sports Complex',
    attendees: 8,
    maxAttendees: 16,
    type: 'sports',
    tags: ['sports', 'basketball', 'tournament'],
    image: 'https://picsum.photos/400/200?random=3',
    isLiked: false
  },
  {
    id: 4,
    title: 'Art Exhibition Opening',
    description: 'Student art exhibition featuring works from various departments. Refreshments will be served.',
    date: '2024-01-22',
    time: '7:00 PM',
    location: 'Art Gallery',
    attendees: 25,
    maxAttendees: 50,
    type: 'social',
    tags: ['art', 'exhibition', 'culture'],
    image: 'https://picsum.photos/400/200?random=4',
    isLiked: true
  },
  {
    id: 5,
    title: 'Research Symposium',
    description: 'Graduate students present their research findings. Open to all students and faculty.',
    date: '2024-01-25',
    time: '9:00 AM',
    location: 'Conference Hall',
    attendees: 80,
    maxAttendees: 120,
    type: 'academic',
    tags: ['research', 'academic', 'presentation'],
    image: 'https://picsum.photos/400/200?random=5',
    isLiked: false
  },
  {
    id: 6,
    title: 'Music Concert',
    description: 'Student bands perform original compositions. Food trucks and merchandise available.',
    date: '2024-01-28',
    time: '8:00 PM',
    location: 'Amphitheater',
    attendees: 150,
    maxAttendees: 300,
    type: 'social',
    tags: ['music', 'concert', 'entertainment'],
    image: 'https://picsum.photos/400/200?random=6',
    isLiked: false
  }
]

export const mockUser = {
  firstName: 'Sabeel',
  lastName: 'Ahmed',
  email: 'sabeel.ahmed@university.edu',
  department: 'Computer Science',
  year: 'Junior',
  studentId: 'CS2021001',
  bio: 'Passionate computer science student with interests in AI, machine learning, and web development. Always eager to learn new technologies and connect with like-minded individuals.',
  interests: ['Technology', 'AI', 'Machine Learning', 'Web Development', 'Entrepreneurship'],
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  joinDate: '2021-09-01',
  location: 'Campus City, State',
  phone: '+1 (555) 123-4567'
}
