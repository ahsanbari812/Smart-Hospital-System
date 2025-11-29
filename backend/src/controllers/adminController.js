const { User, Doctor, Patient, Department, Appointment, Bill, LabTest } = require('../models');
const bcrypt = require('bcryptjs');

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private/Admin
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [
                { model: User, attributes: ['name', 'email', 'phone'] },
                { model: Department, attributes: ['name'] }
            ]
        });
        res.json({ success: true, data: doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a new doctor
// @route   POST /api/admin/doctors
// @access  Private/Admin
const createDoctor = async (req, res) => {
    const { name, email, password, phone, departmentId, specialization, schedule, fees } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'doctor'
        });

        const doctor = await Doctor.create({
            userId: user.id,
            departmentId,
            specialization,
            schedule,
            fees
        });

        res.status(201).json({ success: true, data: doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update doctor
// @route   PUT /api/admin/doctors/:id
// @access  Private/Admin
const updateDoctor = async (req, res) => {
    const { name, phone, departmentId, specialization, schedule, fees } = req.body;
    try {
        const doctor = await Doctor.findByPk(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const user = await User.findByPk(doctor.userId);
        if (name) user.name = name;
        if (phone) user.phone = phone;
        await user.save();

        if (departmentId) doctor.departmentId = departmentId;
        if (specialization) doctor.specialization = specialization;
        if (schedule) doctor.schedule = schedule;
        if (fees) doctor.fees = fees;
        await doctor.save();

        res.json({ success: true, data: doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete doctor
// @route   DELETE /api/admin/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const user = await User.findByPk(doctor.userId);
        await user.destroy(); // Cascade delete should handle doctor record, but explicit is safer if not set
        // await doctor.destroy(); // If cascade is set on User model, this happens automatically

        res.json({ success: true, message: 'Doctor removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private/Admin
const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            include: [{ model: User, attributes: ['name', 'email', 'phone'] }]
        });
        res.json({ success: true, data: patients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all departments
// @route   GET /api/admin/departments
// @access  Private/Admin
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.findAll();
        res.json({ success: true, data: departments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create department
// @route   POST /api/admin/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
    const { name, description, image } = req.body;
    try {
        const department = await Department.create({ name, description, image });
        res.status(201).json({ success: true, data: department });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const doctorCount = await Doctor.count();
        const patientCount = await Patient.count();
        const appointmentCount = await Appointment.count();
        const totalRevenue = await Bill.sum('amount', { where: { status: 'paid' } });

        res.json({
            success: true,
            data: {
                doctors: doctorCount,
                patients: patientCount,
                appointments: appointmentCount,
                revenue: totalRevenue || 0
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all lab tests
// @route   GET /api/admin/lab-tests
// @access  Private/Admin
const getLabTests = async (req, res) => {
    try {
        const { status } = req.query;
        const whereClause = status ? { status } : {};

        const labTests = await LabTest.findAll({
            where: whereClause,
            include: [
                { model: Patient, include: [{ model: User, attributes: ['name'] }] },
                { model: Doctor, include: [{ model: User, attributes: ['name'] }] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: labTests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update lab test result
// @route   PUT /api/admin/lab-tests/:id
// @access  Private/Admin
const updateLabTestResult = async (req, res) => {
    const { resultUrl, status } = req.body;
    try {
        const labTest = await LabTest.findByPk(req.params.id);
        if (!labTest) {
            return res.status(404).json({ success: false, message: 'Lab test not found' });
        }

        if (resultUrl) labTest.resultUrl = resultUrl;
        if (status) labTest.status = status;

        await labTest.save();

        res.json({ success: true, data: labTest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private/Admin
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [
                { model: Patient, include: [{ model: User, attributes: ['name'] }] },
                { model: Doctor, include: [{ model: User, attributes: ['name'] }] }
            ],
            order: [['appointmentDate', 'DESC'], ['appointmentTime', 'ASC']]
        });
        res.json({ success: true, data: appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getAllDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getAllPatients,
    getAllDepartments,
    createDepartment,
    getDashboardStats,
    getLabTests,
    updateLabTestResult,
    getAllAppointments
};
