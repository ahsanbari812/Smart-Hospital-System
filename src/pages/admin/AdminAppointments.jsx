import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Clock, User, Stethoscope } from 'lucide-react';
import api from '../../services/api';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/admin/appointments');
            setAppointments(res.data.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading appointments...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Appointments</h2>
                <p className="text-muted-foreground">View all scheduled appointments across the system.</p>
            </div>

            <Card className="shadow-md border-t-4 border-t-purple-500">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        All Appointments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Reason</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No appointments found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    appointments.map((apt) => (
                                        <TableRow key={apt.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                                    {apt.Doctor?.User?.name || 'Unknown'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    {apt.Patient?.User?.name || 'Unknown'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm">
                                                    <span className="font-medium">{apt.appointmentDate}</span>
                                                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> {apt.appointmentTime}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    apt.status === 'confirmed' ? 'success' :
                                                        apt.status === 'completed' ? 'secondary' :
                                                            apt.status === 'cancelled' ? 'destructive' : 'outline'
                                                }>
                                                    {apt.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate text-muted-foreground" title={apt.reason}>
                                                {apt.reason}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAppointments;
