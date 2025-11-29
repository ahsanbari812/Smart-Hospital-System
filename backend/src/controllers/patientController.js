const { Appointment, Doctor, User, Prescription, LabTest, Bill, Department } = require('../models');

// @desc    Get all doctors (for booking)
// @route   GET /api/patient/doctors
// @access  Private/Patient
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [
                { model: User, attributes: ['name'] },
                { model: Department, attributes: ['name'] }
            ]
        });
        res.json({ success: true, data: doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get patient appointments
// @route   GET /api/patient/appointments
// @access  Private/Patient
const getPatientAppointments = async (req, res) => {
    try {
        const patient = await req.user.getPatient();
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient profile not found' });
        }

        const appointments = await Appointment.findAll({
            where: { patientId: patient.id },
            include: [
                {
                    model: Doctor,
                    include: [
                        { model: User, attributes: ['name'] },
                        { model: Department, attributes: ['name'] }
                    ]
                }
            ]
        });

        res.json({ success: true, data: appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Book appointment
// @route   POST /api/patient/appointments
// @access  Private/Patient
const bookAppointment = async (req, res) => {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

    try {
        const patient = await req.user.getPatient();

        // Check if doctor exists
        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Check availability (simplified: check if doctor has appointment at same time)
        const existingAppointment = await Appointment.findOne({
            where: {
                doctorId,
                appointmentDate,
                appointmentTime,
                status: ['pending', 'confirmed']
            }
        });

        if (existingAppointment) {
            return res.status(400).json({ success: false, message: 'Doctor is not available at this time' });
        }

        // Check if patient already has an appointment at this time
        const patientBusy = await Appointment.findOne({
            where: {
                patientId: patient.id,
                appointmentDate,
                appointmentTime,
                status: ['pending', 'confirmed']
            }
        });

        if (patientBusy) {
            return res.status(400).json({ success: false, message: 'You already have an appointment at this time' });
        }

        const appointment = await Appointment.create({
            patientId: patient.id,
            doctorId,
            appointmentDate,
            appointmentTime,
            reason,
            status: 'pending'
        });

        res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Cancel appointment
// @route   PUT /api/patient/appointments/:id/cancel
// @access  Private/Patient
const cancelAppointment = async (req, res) => {
    try {
        const patient = await req.user.getPatient();
        const appointment = await Appointment.findOne({
            where: { id: req.params.id, patientId: patient.id }
        });

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointment.status === 'completed' || appointment.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Cannot cancel this appointment' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({ success: true, data: appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get patient prescriptions
// @route   GET /api/patient/prescriptions
// @access  Private/Patient
const getPatientPrescriptions = async (req, res) => {
    try {
        const patient = await req.user.getPatient();
        // Prescriptions are linked to appointments, which are linked to patients.
        // We can query Prescriptions including Appointment where patientId matches
        const prescriptions = await Prescription.findAll({
            include: [
                {
                    model: Appointment,
                    where: { patientId: patient.id },
                    include: [
                        {
                            model: Doctor,
                            include: [{ model: User, attributes: ['name'] }]
                        }
                    ]
                },
                {
                    model: require('../models').PrescriptionMedicine,
                    include: [
                        {
                            model: require('../models').Medicine,
                            attributes: ['name', 'genericName']
                        }
                    ]
                }
            ]
        });

        res.json({ success: true, data: prescriptions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get patient lab tests
// @route   GET /api/patient/lab-tests
// @access  Private/Patient
const getPatientLabTests = async (req, res) => {
    try {
        const patient = await req.user.getPatient();
        const labTests = await LabTest.findAll({
            where: { patientId: patient.id },
            include: [
                {
                    model: Doctor,
                    include: [{ model: User, attributes: ['name'] }]
                },
                {
                    model: require('../models').LabTestCatalog,
                    attributes: ['testName', 'testCode', 'category', 'price']
                }
            ]
        });

        res.json({ success: true, data: labTests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get patient bills
// @route   GET /api/patient/bills
// @access  Private/Patient
const getPatientBills = async (req, res) => {
    try {
        const patient = await req.user.getPatient();
        const bills = await Bill.findAll({
            where: { patientId: patient.id },
            include: [
                {
                    model: Appointment,
                    attributes: ['appointmentDate', 'appointmentTime']
                }
            ]
        });

        res.json({ success: true, data: bills });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


// @desc    Pay a bill
// @route   PUT /api/patient/bills/:id/pay
// @access  Private/Patient
const payBill = async (req, res) => {
    try {
        const patient = await req.user.getPatient();
        const bill = await Bill.findOne({
            where: { id: req.params.id, patientId: patient.id }
        });

        if (!bill) {
            return res.status(404).json({ success: false, message: 'Bill not found' });
        }

        if (bill.status === 'paid') {
            return res.status(400).json({ success: false, message: 'Bill is already paid' });
        }

        // Mock payment processing
        bill.status = 'paid';
        bill.paymentDate = new Date();
        bill.paymentMethod = req.body.paymentMethod || 'Online'; // Default to Online if not provided
        await bill.save();

        res.json({ success: true, data: bill });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getPatientAppointments,
    bookAppointment,
    cancelAppointment,
    getPatientPrescriptions,
    getPatientLabTests,
    getPatientBills,
    payBill,
    getAllDoctors
};
