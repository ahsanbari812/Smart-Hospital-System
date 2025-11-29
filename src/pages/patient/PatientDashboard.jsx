import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';
import { Calendar, Clock, FileText, Activity, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardSkeleton } from '../../components/ui/SkeletonLoaders';
import { HealthTrendsChart } from '../../components/Charts';
import { showError } from '../../utils/toast';

const PatientDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [appointmentsRes, prescriptionsRes, labTestsRes, billsRes] = await Promise.all([
                api.get('/patient/appointments'),
                api.get('/patient/prescriptions'),
                api.get('/patient/lab-tests'),
                api.get('/patient/bills')
            ]);

            setAppointments(appointmentsRes.data.data);
            setPrescriptions(prescriptionsRes.data.data);
            setLabTests(labTestsRes.data.data);
            setBills(billsRes.data.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            showError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const unpaidBills = bills.filter(bill => bill.status === 'unpaid');
    const totalDue = unpaidBills.reduce((acc, bill) => acc + Number(bill.amount), 0);
    const nextDueDate = unpaidBills.length > 0
        ? new Date(unpaidBills[0].createdAt).toLocaleDateString()
        : '-';

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8 page-enter">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">My Dashboard</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover-lift border-l-4 border-l-blue-500 stagger-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Appointments</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{appointments.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Upcoming</p>
                    </CardContent>
                </Card>
                <Card className="hover-lift border-l-4 border-l-green-500 stagger-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Prescriptions</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-success/10 dark:bg-success/20 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{prescriptions.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total records</p>
                    </CardContent>
                </Card>
                <Card className="hover-lift border-l-4 border-l-purple-500 stagger-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Lab Results</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{labTests.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total tests</p>
                    </CardContent>
                </Card>
                <Card className="hover-lift border-l-4 border-l-red-500 stagger-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Bills</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-destructive/10 dark:bg-destructive/20 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">${totalDue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Due date: {nextDueDate}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Health Trends Chart */}
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                <HealthTrendsChart />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-md hover-lift animate-in fade-in slide-in-from-left duration-500 delay-200">
                    <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {appointments.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments.</p>
                            ) : (
                                appointments.slice(0, 5).map((apt, index) => (
                                    <div key={apt.id} className={`flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors hover-lift stagger-${index + 1} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-primary/10 p-2.5">
                                                <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{apt.Doctor?.User?.name || 'Doctor'}</div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : 'N/A'} at {apt.appointmentTime || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full capitalize">{apt.status}</div>
                                    </div>
                                ))
                            )}
                            <Button className="w-full hover-glow active-press" asChild>
                                <Link to="/patient/book-appointment">Book New Appointment</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md hover-lift animate-in fade-in slide-in-from-right duration-500 delay-200">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button variant="outline" className="justify-start h-14 text-lg hover-glow active-press transition-all stagger-1 animate-in fade-in slide-in-from-bottom-2 duration-300" asChild>
                            <Link to="/patient/prescriptions">
                                <div className="rounded-full bg-success/10 dark:bg-success/20 p-2 mr-3">
                                    <FileText className="h-5 w-5 text-green-600" />
                                </div>
                                View Prescriptions
                            </Link>
                        </Button>
                        <Button variant="outline" className="justify-start h-14 text-lg hover-glow active-press transition-all stagger-2 animate-in fade-in slide-in-from-bottom-2 duration-300" asChild>
                            <Link to="/patient/lab-results">
                                <div className="rounded-full bg-purple-500/10 dark:bg-purple-500/20 p-2 mr-3">
                                    <Activity className="h-5 w-5 text-purple-600" />
                                </div>
                                Lab Test Results
                            </Link>
                        </Button>
                        <Button variant="outline" className="justify-start h-14 text-lg hover-glow active-press transition-all stagger-3 animate-in fade-in slide-in-from-bottom-2 duration-300" asChild>
                            <Link to="/patient/billing">
                                <div className="rounded-full bg-destructive/10 dark:bg-destructive/20 p-2 mr-3">
                                    <CreditCard className="h-5 w-5 text-red-600" />
                                </div>
                                Pay Bills
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PatientDashboard;
