const express = require('express');
const {
    getDoctorAppointments,
    getDoctorPatients,
    getPatientDetails,
    createPrescription,
    recommendLabTest,
    uploadLabResult
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('doctor'));

router.get('/appointments', getDoctorAppointments);
router.get('/patients', getDoctorPatients);
router.get('/patients/:id', getPatientDetails);
router.post('/prescriptions', createPrescription);
router.post('/lab-tests', recommendLabTest);
router.post('/lab-tests/:id/result', upload.single('file'), uploadLabResult);

module.exports = router;
