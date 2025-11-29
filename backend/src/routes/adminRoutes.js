const express = require('express');
const {
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
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.route('/doctors')
    .get(getAllDoctors)
    .post(createDoctor);

router.route('/doctors/:id')
    .put(updateDoctor)
    .delete(deleteDoctor);

router.route('/patients')
    .get(getAllPatients);

router.route('/departments')
    .get(getAllDepartments)
    .post(createDepartment);

router.get('/stats', getDashboardStats);

router.route('/lab-tests')
    .get(getLabTests);

router.route('/lab-tests/:id')
    .put(updateLabTestResult);

router.get('/appointments', getAllAppointments);

module.exports = router;
