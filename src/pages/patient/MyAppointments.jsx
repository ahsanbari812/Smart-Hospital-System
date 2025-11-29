import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';
import { Calendar, Clock, User, MapPin, Phone, Plus, Filter, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/patient/appointments');
            setAppointments(response.data.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            await api.put(`/patient/appointments/${id}/cancel`);
            // Re-fetch appointments after cancellation
            fetchAppointments();
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            alert('Failed to cancel appointment. Please try again.');
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        if (filter === 'all') return true;
        return apt.status === filter;
    });

    const getStatusVariant = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'completed': return 'secondary';
            case 'cancelled': return 'destructive';
            case 'pending': return 'warning';
            default: return 'outline';
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading appointments...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">My Appointments</h2>
                    <p className="text-muted-foreground">Manage your upcoming and past appointments.</p>
                </div>
                <Button asChild className="shadow-md hover:shadow-lg transition-all">
                    <Link to="/patient/book-appointment">
                        <Plus className="mr-2 h-4 w-4" /> Book New Appointment
                    </Link>
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 border-b pb-1">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${filter === status
                            ? 'bg-background border-b-2 border-primary text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                    >
                        <span className="capitalize">{status}</span>
                        <span className="ml-2 text-xs opacity-70 bg-muted px-1.5 py-0.5 rounded-full">
                            {status === 'all' ? appointments.length : appointments.filter(a => a.status === status).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {filteredAppointments.length === 0 ? (
                    <Card className="border-dashed border-2 bg-muted/10">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                                <Calendar className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
                            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                                {filter === 'all'
                                    ? "You haven't booked any appointments yet."
                                    : `You don't have any ${filter} appointments.`}
                            </p>
                            {filter === 'all' && (
                                <Button asChild variant="outline">
                                    <Link to="/patient/book-appointment">Book Your First Appointment</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    filteredAppointments.map((appointment) => (
                        <Card key={appointment.id} className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                                    <div className="flex gap-4 flex-1">
                                        {/* Date Box */}
                                        <div className="hidden sm:flex flex-col items-center justify-center h-20 w-20 rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20">
                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString('en-US', { month: 'short' }) : 'N/A'}
                                            </span>
                                            <span className="text-2xl font-bold">
                                                {appointment.appointmentDate ? new Date(appointment.appointmentDate).getDate() : '--'}
                                            </span>
                                            <span className="text-xs text-primary/70">
                                                {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString('en-US', { weekday: 'short' }) : ''}
                                            </span>
                                        </div>

                                        {/* Appointment Details */}
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                                        {appointment.Doctor?.User?.name || 'Doctor Name Not Available'}
                                                    </h3>
                                                    <Badge variant={getStatusVariant(appointment.status)} className="capitalize">
                                                        {appointment.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {appointment.Doctor?.specialization || 'Specialization not specified'}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                    <Calendar className="h-4 w-4 text-primary/70" />
                                                    <span className="font-medium">
                                                        {appointment.appointmentDate
                                                            ? new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })
                                                            : 'Date not set'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                    <Clock className="h-4 w-4 text-primary/70" />
                                                    <span className="font-medium">{appointment.appointmentTime || 'Time not set'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{appointment.Doctor?.Department?.name || 'Department not specified'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{appointment.Doctor?.User?.phone || 'Contact not available'}</span>
                                                </div>
                                            </div>

                                            {appointment.reason && (
                                                <div className="mt-2 text-sm bg-muted/30 p-3 rounded-md border border-muted">
                                                    <span className="font-medium text-foreground">Reason: </span>
                                                    <span className="text-muted-foreground">{appointment.reason}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 min-w-[120px]">
                                        {appointment.status === 'pending' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                                                onClick={() => handleCancelAppointment(appointment.id)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
