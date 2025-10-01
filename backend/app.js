const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db.js');
const userRoutes = require('./routes/user.route.js');
const eventRoutes = require('./routes/event.route.js'); // Existing
const adminRoutes = require('./routes/admin.route.js'); // NEW
const clubRoutes = require('./routes/club.route.js'); // NEW


connectToDb();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

const corsOptions = {
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// Explicitly set CORS headers and handle preflight for Express 5 compatibility
app.use((req, res, next) => {
    // console.log('CORS middleware - Origin:', req.headers.origin); // Commented for less noise
    // console.log('CORS middleware - Method:', req.method); // Commented for less noise
    res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        // console.log('CORS middleware - Handling OPTIONS request'); // Commented for less noise
        return res.sendStatus(204);
    }
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Welcome to Campus Connect Backend!');
});

// Primary Routes
app.use('/users', userRoutes);
app.use('/events', eventRoutes);

// NEW: Admin Routes
app.use('/admin', adminRoutes);

// NEW: Club Routes
app.use('/clubs', clubRoutes);

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer memory storage; we will upload buffers via Cloudinary SDK
const upload = multer({ storage: multer.memoryStorage() });

// Image upload endpoint (used by both frontend's CreateEventPage and ProfilePage for avatar)
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'campus-connect', // Unified folder for all uploads
                    resource_type: 'image',
                    transformation: [{ quality: 'auto', fetch_format: 'auto' }]
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        return res.status(200).json({ url: result.secure_url });
    } catch (e) {
        console.error('Cloudinary upload failed:', e);
        return res.status(500).json({ message: 'Upload failed', error: e.message });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Something went wrong!',
        errors: err.errors || []
    });
});


module.exports = app;