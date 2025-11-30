import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import LoadingFallback from '../components/LoadingFallback';

// Eager imports (landing page and auth - need to load immediately)
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Lazy imports (dashboard routes - load on demand)
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));

// Admin routes
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const Doctors = lazy(() => import('../pages/admin/Doctors'));
const Patients = lazy(() => import('../pages/admin/Patients'));
const Departments = lazy(() => import('../pages/admin/Departments'));
const AdminAppointments = lazy(() => import('../pages/admin/AdminAppointments'));
const AdminReports = lazy(() => import('../pages/admin/AdminReports'));
const LabManager = lazy(() => import('../pages/admin/LabManager'));

// Doctor routes
const DoctorDashboard = lazy(() => import('../pages/doctor/DoctorDashboard'));
const DoctorAppointments = lazy(() => import('../pages/doctor/DoctorAppointments'));
const DoctorPatients = lazy(() => import('../pages/doctor/DoctorPatients'));
const PatientProfile = lazy(() => import('../pages/doctor/PatientProfile'));
const Prescription = lazy(() => import('../pages/doctor/Prescription'));

// Patient routes
const PatientDashboard = lazy(() => import('../pages/patient/PatientDashboard'));
const BookAppointment = lazy(() => import('../pages/patient/BookAppointment'));
const MyAppointments = lazy(() => import('../pages/patient/MyAppointments'));
const MyPrescriptions = lazy(() => import('../pages/patient/MyPrescriptions'));
const LabResults = lazy(() => import('../pages/patient/LabResults'));
const Billing = lazy(() => import('../pages/patient/Billing'));

// Placeholder components for now
const NotFound = () => <div>404 Not Found</div>;

const AppRouter = () => {
    const { user } = useAuth();

    return (
        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
    );
};

export default AppRouter;
