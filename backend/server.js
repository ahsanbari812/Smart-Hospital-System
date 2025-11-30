const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const syncDatabase = require('./src/utils/syncDb');
const { startKeepAlive } = require('./src/utils/keep-alive');

// Load env vars
dotenv.config();

const app = express();

// Response time logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
    });
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Smart Hospital System API is running' });
});

// Routes
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const patientRoutes = require('./src/routes/patientRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await syncDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);

        // Start keep-alive service in production
        startKeepAlive();
    });
};

startServer();
