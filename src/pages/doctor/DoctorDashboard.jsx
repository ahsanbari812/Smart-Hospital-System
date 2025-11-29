import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Clock, User, Activity, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Modal } from '../../components/ui/Modal';
import { DashboardSkeleton } from '../../components/ui/SkeletonLoaders';
import { AppointmentStatsChart } from '../../components/Charts';
import { showError } from '../../utils/toast';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        today: 0,
        totalPatients: 0,
        pendingReports: 0
    });
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/doctor/appointments');
            setAppointments(res.data.data);
            setStats({
                today: res.data.data.length,
                totalPatients: new Set(res.data.data.map(a => a.patientId)).size,
                pendingReports: 0
            });
        } catch (error) {
            console.error('Error fetching appointments:', error);
            showError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleViewHistory = async (patientId) => {
        setHistoryLoading(true);
        setIsHistoryModalOpen(true);
        try {
            const res = await api.get(`/doctor/patients/${patientId}`);
            setSelectedPatient(res.data.data);
        } catch (error) {
            console.error('Error fetching patient history:', error);
            showError('Failed to fetch patient history');
        } finally {
            setHistoryLoading(false);
        }
    };

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8 page-enter">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Doctor Dashboard</h2>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="hover-lift border-l-4 border-l-blue-500 stagger-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.today}</div>
                        <p className="text-xs text-muted-foreground mt-1">Scheduled for today</p>
                    </CardContent>
                </Card>
                <Card className="hover-lift border-l-4 border-l-green-500 stagger-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-success/10 dark:bg-success/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.totalPatients}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Appointment Statistics Chart */}
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                <AppointmentStatsChart />
            </div>

            <Card className="shadow-md hover-lift animate-in fade-in slide-in-from-bottom-6 duration-500 delay-200">
                <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Patient Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.map((apt) => (
                                <TableRow key={apt.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        {apt.appointmentTime}
                                    </TableCell>
                                    <TableCell>{apt.Patient?.User?.name || 'Unknown'}</TableCell>
                                    <TableCell>
                                        <Badge variant={apt.status === 'confirmed' ? 'success' : 'secondary'}>
                                            {apt.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" className="mr-2" onClick={() => handleViewHistory(apt.patientId)}>
                                            History
                                        </Button>
                                        {apt.status !== 'completed' && (
                                            <Button size="sm" asChild>
                                                <Link to={`/doctor/prescription/${apt.id}`}>Complete Consultation</Link>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Modal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                title="Patient Medical History"
            >
                {historyLoading ? (
                    <div className="p-4 text-center text-muted-foreground">Loading history...</div>
                ) : selectedPatient ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                            <div className="rounded-full bg-primary/10 p-3">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{selectedPatient.User?.name}</h3>
                                <p className="text-sm text-muted-foreground">{selectedPatient.User?.email} | {selectedPatient.User?.phone}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" /> Past Appointments
                            </h4>
                            <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto bg-card">
                                {selectedPatient.Appointments && selectedPatient.Appointments.length > 0 ? (
                                    <ul className="space-y-3">
                                        {selectedPatient.Appointments.map((apt) => (
                                            <li key={apt.id} className="text-sm border-b pb-3 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-medium">{apt.appointmentDate}</span>
                                                    <Badge variant="outline" className="text-xs">{apt.status}</Badge>
                                                </div>
                                                <p className="text-muted-foreground text-xs">{apt.reason}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-2">No past appointments.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" /> Lab Reports
                            </h4>
                            <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto bg-card">
                                {selectedPatient.LabTests && selectedPatient.LabTests.length > 0 ? (
                                    <ul className="space-y-3">
                                        {selectedPatient.LabTests.map((test) => (
                                            <li key={test.id} className="text-sm border-b pb-3 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-medium">{test.testName}</span>
                                                    <Badge variant={test.status === 'completed' ? 'success' : 'warning'} className="text-xs">{test.status}</Badge>
                                                </div>
                                                {test.resultUrl && (
                                                    <a href={test.resultUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 mt-1 text-xs font-medium">
                                                        <FileText className="h-3 w-3" /> View Result
                                                    </a>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-2">No lab reports.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground">No patient selected</div>
                )}
            </Modal>
        </div>
    );
};

export default DoctorDashboard;
