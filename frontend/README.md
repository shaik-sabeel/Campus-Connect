# Campus Connect - Smart Event & Opportunity Hub

A modern, responsive web application built with React, TailwindCSS, and Framer Motion for connecting students through smart events and opportunities.

## Features

- 🎨 **Modern UI/UX**: Beautiful, responsive design with glassmorphism effects
- 🌙 **Dark/Light Mode**: Toggle between themes with smooth transitions
- 🎭 **Smooth Animations**: Powered by Framer Motion for delightful interactions
- 🎯 **3D Integration**: Spline 3D models in the hero section
- 📱 **Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- 🔐 **Authentication**: Login and signup with form validation
- 📊 **Dashboard**: Personalized dashboard with stats and quick actions
- 🎪 **Event Management**: Create, browse, and manage events
- 👤 **User Profiles**: Comprehensive profile management
- 🏷️ **Smart Filtering**: Advanced search and filter capabilities

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: TailwindCSS with custom components
- **Animations**: Framer Motion
- **3D Graphics**: Spline (spline.design)
- **Forms**: React Hook Form
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd campus-connect
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar with theme toggle
│   ├── Footer.jsx      # Footer component
│   ├── EventCard.jsx   # Event card component
│   ├── Button.jsx      # Custom button component
│   └── InputField.jsx  # Form input component
├── pages/              # Page components
│   ├── LandingPage.jsx # Homepage with 3D hero
│   ├── LoginPage.jsx   # Authentication pages
│   ├── SignupPage.jsx
│   ├── Dashboard.jsx   # User dashboard
│   ├── EventListPage.jsx # Event browsing
│   ├── EventDetailsPage.jsx # Event details
│   ├── CreateEventPage.jsx # Event creation
│   └── ProfilePage.jsx # User profile
├── App.jsx             # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Key Features

### Landing Page
- Hero section with Spline 3D integration
- Feature highlights with animations
- Statistics and testimonials
- Call-to-action sections

### Authentication
- Multi-step signup process
- Form validation with React Hook Form
- Social login options
- Responsive design

### Dashboard
- Personalized greeting
- Activity statistics
- Quick action buttons
- Recent activity feed
- Recommendations

### Event Management
- Advanced search and filtering
- Event creation with image upload
- Detailed event pages
- RSVP functionality
- Attendee management

### Profile Management
- Comprehensive user profiles
- Achievement system
- Settings and preferences
- Social links integration

## Customization

### Colors
The app uses a purple-blue gradient theme. You can customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f3f4f6',
        // ... your custom colors
      }
    }
  }
}
```

### Animations
Animations are powered by Framer Motion. You can customize them in individual components or create a global animation configuration.

### 3D Models
The Spline integration is in the landing page hero section. Replace the scene URL with your own Spline scene:

```jsx
<Spline 
  scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode"
  className="w-full h-full"
/>
```

## Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@campusconnect.edu or create an issue in the repository.

---

Made with ❤️ for students by students
