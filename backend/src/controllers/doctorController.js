const { Appointment, Patient, User, Prescription, LabTest, Doctor, Bill, PrescriptionMedicine, Medicine, LabTestCatalog } = require('../models');

// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
// @access  Private/Doctor
const getDoctorAppointments = async (req, res) => {
    try {
        // Find doctor record for current user
        const doctor = await req.user.getDoctor();
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' });
        }

        const appointments = await Appointment.findAll({
            where: { doctorId: doctor.id },
            include: [
                {
                    model: Patient,
                    include: [{ model: User, attributes: ['name', 'email', 'phone'] }]
                }
            ]
        });

        res.json({ success: true, data: appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get patient details
// @route   GET /api/doctor/patients/:id
// @access  Private/Doctor
const getPatientDetails = async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['name', 'email', 'phone'] },
                {
                    model: Appointment,
                    include: [
                        {
                            model: Prescription,
                            include: [
                                {
                                    model: PrescriptionMedicine,
                                    include: [Medicine]
                                }
                            ]
                        },
                        {
                            model: Doctor,
                            include: [
                                { model: User, attributes: ['name'] }
                            ]
                        }
                    ]
                },
                { model: LabTest }
            ]
        });

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        res.json({ success: true, data: patient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create prescription
// @route   POST /api/doctor/prescriptions
// @access  Private/Doctor
const createPrescription = async (req, res) => {
    const { appointmentId, medicines, instructions } = req.body;

    // Start a transaction
    const t = await require('../models').sequelize.transaction();

    try {
        const appointment = await Appointment.findByPk(appointmentId, { transaction: t });
        if (!appointment) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Verify appointment belongs to this doctor
        const doctor = await req.user.getDoctor();
        if (appointment.doctorId !== doctor.id) {
            await t.rollback();
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Extract diagnosis from instructions if present
        let diagnosis = '';
        let cleanInstructions = instructions || '';

        if (instructions) {
            const diagnosisMatch = instructions.match(/Diagnosis:\s*([^.]+)\./);
            if (diagnosisMatch) {
                diagnosis = diagnosisMatch[1].trim();
                // Remove diagnosis from instructions
                cleanInstructions = instructions.replace(/Diagnosis:\s*[^.]+\.\s*/, '').trim();
            }
        }

        // Create prescription
        const prescription = await Prescription.create({
            appointmentId,
            diagnosis: diagnosis || null,
            instructions: cleanInstructions || null
        }, { transaction: t });

        // Save medicines to PrescriptionMedicine table
        if (medicines && Array.isArray(medicines) && medicines.length > 0) {
            for (const med of medicines) {
                // Find or create medicine in catalog (free-text entry, no validation)
                const [medicine] = await Medicine.findOrCreate({
                    where: { name: med.name },
                    defaults: {
                        name: med.name,
                        genericName: null,
                        manufacturer: null,
                        category: null,
                        unitPrice: null,
                        description: null
                    },
                    transaction: t
                });

                // Create PrescriptionMedicine record
                await PrescriptionMedicine.create({
                    prescriptionId: prescription.id,
                    medicineId: medicine.id,
                    dosage: med.dosage || null,
                    frequency: null, // Not provided by frontend
                    duration: med.duration || null,
                    instructions: null
                }, { transaction: t });
            }
        }

        // Mark appointment as completed
        appointment.status = 'completed';
        await appointment.save({ transaction: t });

        // Check if bill exists
        let bill = await Bill.findOne({
            where: { appointmentId: appointment.id }
        }, { transaction: t });

        const doctorDetails = await Doctor.findByPk(doctor.id);
        const consultationFee = Number(doctorDetails.fees) || 50.00;

        if (bill) {
            // If bill exists (maybe from lab tests), add consultation fee
            if (bill.status === 'unpaid') {
                bill.amount = Number(bill.amount) + consultationFee;
                await bill.save({ transaction: t });
            }
        } else {
            // Create new bill
            await Bill.create({
                patientId: appointment.patientId,
                appointmentId: appointment.id,
                amount: consultationFee,
                status: 'unpaid'
            }, { transaction: t });
        }

        // Commit transaction
        await t.commit();

        res.status(201).json({ success: true, data: prescription });
    } catch (error) {
        // Rollback transaction on error
        await t.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Recommend lab test
// @route   POST /api/doctor/lab-tests
// @access  Private/Doctor
const recommendLabTest = async (req, res) => {
    const { patientId, testName, notes } = req.body;

    try {
        const doctor = await req.user.getDoctor();

        // Find or create lab test in catalog (auto-create if doesn't exist)
        const [labTestCatalog] = await LabTestCatalog.findOrCreate({
            where: { testName: testName },
            defaults: {
                testName: testName,
                testCode: null,
                category: null,
                price: 20.00, // Default price
                description: null,
                normalRange: null,
                sampleType: null
            }
        });

        // Create lab test with catalog reference
        const labTest = await LabTest.create({
            patientId,
            doctorId: doctor.id,
            labTestCatalogId: labTestCatalog.id,
            notes,
            status: 'ordered'
        });

        // Get test price from catalog
        const testPrice = Number(labTestCatalog.price) || 20.00;

        // Find or create bill for the appointment associated with this patient/doctor interaction
        const appointment = await Appointment.findOne({
            where: {
                patientId,
                doctorId: doctor.id,
                status: ['pending', 'confirmed', 'completed']
            },
            order: [['createdAt', 'DESC']]
        });

        if (appointment) {
            let bill = await Bill.findOne({
                where: { appointmentId: appointment.id }
            });

            if (bill && bill.status === 'unpaid') {
                bill.amount = Number(bill.amount) + testPrice;
                await bill.save();
            } else if (!bill) {
                // Create bill if not exists (e.g. if lab test ordered before consultation completion)
                await Bill.create({
                    patientId,
                    appointmentId: appointment.id,
                    amount: testPrice,
                    status: 'unpaid'
                });
            }
        }

        res.status(201).json({ success: true, data: labTest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Upload lab test result
// @route   POST /api/doctor/lab-tests/:id/result
// @access  Private/Doctor
const uploadLabResult = async (req, res) => {
    try {
        const labTest = await LabTest.findByPk(req.params.id);

        if (!labTest) {
            return res.status(404).json({ success: false, message: 'Lab test not found' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        labTest.resultUrl = req.file.path;
        labTest.status = 'completed';
        await labTest.save();

        res.json({ success: true, data: labTest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get doctor's patients
// @route   GET /api/doctor/patients
// @access  Private/Doctor
const getDoctorPatients = async (req, res) => {
    try {
        const doctor = await req.user.getDoctor();
        // Find appointments for this doctor, then get unique patients
        const appointments = await Appointment.findAll({
            where: { doctorId: doctor.id },
            include: [
                {
                    model: Patient,
                    include: [{ model: User, attributes: ['name', 'email', 'phone'] }]
                }
            ]
        });

        // Extract unique patients
        const patientsMap = new Map();
        appointments.forEach(app => {
            if (app.Patient && !patientsMap.has(app.Patient.id)) {
                patientsMap.set(app.Patient.id, app.Patient);
            }
        });

        const patients = Array.from(patientsMap.values());

        res.json({ success: true, data: patients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getDoctorAppointments,
    getDoctorPatients,
    getPatientDetails,
    createPrescription,
    recommendLabTest,
    uploadLabResult
};
