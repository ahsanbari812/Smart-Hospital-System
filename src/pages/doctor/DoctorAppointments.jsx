import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';
import { Calendar, Clock, Search, Filter, Stethoscope } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Link } from 'react-router-dom';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get('/doctor/appointments');
                setAppointments(res.data.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter(apt =>
        (apt.Patient?.User?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apt.status || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading appointments...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Appointments</h2>
                    <p className="text-muted-foreground">Manage your schedule and patient consultations.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="shadow-sm">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button size="sm" className="shadow-sm">
                        <Calendar className="mr-2 h-4 w-4" /> Today
                    </Button>
                </div>
            </div>

            <Card className="shadow-md border-t-4 border-t-blue-500">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                            All Appointments
                        </CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search patients..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((apt) => (
                                        <TableRow key={apt.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">
                                                {apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {apt.appointmentTime || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold">{apt.Patient?.User?.name || 'Unknown'}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                    {apt.reason || 'General Checkup'}
                                                </Badge>
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
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild className="hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                                                        <Link to={`/doctor/patient/${apt.Patient?.id}`}>View Profile</Link>
                                                    </Button>
                                                    {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                                                        <Button size="sm" asChild className="shadow-sm hover:shadow-md transition-all">
                                                            <Link to={`/doctor/prescription/${apt.id}`}>Prescribe</Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                                            No appointments found matching your search.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DoctorAppointments;
