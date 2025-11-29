const express = require('express');
const {
    getPatientAppointments,
    bookAppointment,
    cancelAppointment,
    getPatientPrescriptions,
    getPatientLabTests,
    getPatientBills,
    payBill,
    getAllDoctors
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('patient'));

router.route('/appointments')
    .get(getPatientAppointments)
    .post(bookAppointment);

router.put('/appointments/:id/cancel', cancelAppointment);

router.get('/prescriptions', getPatientPrescriptions);
router.get('/lab-tests', getPatientLabTests);
router.get('/bills', getPatientBills);
router.put('/bills/:id/pay', payBill);
router.get('/doctors', getAllDoctors);

module.exports = router;
