const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Patient, Doctor } = require('../models');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user (Patient by default)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone, dob, gender } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Determine role based on email domain
        let role = 'patient';
        if (email.endsWith('@doctor.com')) {
            role = 'doctor';
        } else if (email.endsWith('@admin.com')) {
            role = 'admin';
        }

        // Create User
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role
        });

        // Create Profile based on role
        if (user) {
            if (role === 'patient') {
                await Patient.create({
                    userId: user.id,
                    dob,
                    gender
                });
            } else if (role === 'doctor') {
                await Doctor.create({
                    userId: user.id,
                    // departmentId and specialization are now nullable
                    fees: 0.00 // Default fees
                });
            }
            // Admin doesn't need a specific profile table for now

            res.status(201).json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.id)
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.id)
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Patient, required: false },
                { model: Doctor, required: false }
            ]
        });

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    register,
    login,
    getMe
};
