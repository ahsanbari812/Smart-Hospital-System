import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';

import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import AdminDashboard from '../pages/admin/AdminDashboard';
import Doctors from '../pages/admin/Doctors';
import Patients from '../pages/admin/Patients';
import Departments from '../pages/admin/Departments';
import AdminAppointments from '../pages/admin/AdminAppointments';
import AdminReports from '../pages/admin/AdminReports';
import LabManager from '../pages/admin/LabManager';

import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorAppointments from '../pages/doctor/DoctorAppointments';
import DoctorPatients from '../pages/doctor/DoctorPatients';
import PatientProfile from '../pages/doctor/PatientProfile';
import Prescription from '../pages/doctor/Prescription';

import PatientDashboard from '../pages/patient/PatientDashboard';
import BookAppointment from '../pages/patient/BookAppointment';
import MyAppointments from '../pages/patient/MyAppointments';
import MyPrescriptions from '../pages/patient/MyPrescriptions';
import LabResults from '../pages/patient/LabResults';
import Billing from '../pages/patient/Billing';

// Placeholder components for now
const NotFound = () => <div>404 Not Found</div>;

const AppRouter = () => {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}`} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}`} />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<DashboardLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="doctors" element={<Doctors />} />
                    <Route path="patients" element={<Patients />} />
                    <Route path="departments" element={<Departments />} />
                    <Route path="appointments" element={<AdminAppointments />} />
                    <Route path="appointments" element={<AdminAppointments />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="lab-manager" element={<LabManager />} />
                </Route>
            </Route>

            {/* Doctor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                <Route path="/doctor" element={<DashboardLayout />}>
                    <Route index element={<DoctorDashboard />} />
                    <Route path="appointments" element={<DoctorAppointments />} />
                    <Route path="patient/:id" element={<PatientProfile />} />
                    <Route path="prescription/:id" element={<Prescription />} />
                    <Route path="patients" element={<DoctorPatients />} />
                </Route>
            </Route>

            {/* Patient Routes */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                <Route path="/patient" element={<DashboardLayout />}>
                    <Route index element={<PatientDashboard />} />
                    <Route path="appointments" element={<MyAppointments />} />
                    <Route path="book-appointment" element={<BookAppointment />} />
                    <Route path="prescriptions" element={<MyPrescriptions />} />
                    <Route path="lab-results" element={<LabResults />} />
                    <Route path="billing" element={<Billing />} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;
