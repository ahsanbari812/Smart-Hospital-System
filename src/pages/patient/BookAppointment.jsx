import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Calendar as CalendarIcon, Clock, User, Stethoscope } from 'lucide-react';
import api from '../../services/api';

const BookAppointment = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/patient/doctors');
            setDoctors(res.data.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/patient/appointments', formData);
            alert('Appointment booked successfully!');
            navigate('/patient');
        } catch (error) {
            console.error('Error booking appointment:', error);
            setError(error.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center p-4 animate-in fade-in duration-500">
            <Card className="w-full max-w-2xl shadow-lg border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <CalendarIcon className="h-6 w-6 text-primary" />
                        Book New Appointment
                    </CardTitle>
                    <CardDescription>Schedule a consultation with one of our specialists.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="doctor" className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                Select Doctor
                            </Label>
                            <select
                                id="doctor"
                                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all hover:border-primary/50"
                                value={formData.doctorId}
                                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                required
                            >
                                <option value="">Select a doctor</option>
                                {doctors.map((doc) => (
                                    <option key={doc.id} value={doc.id}>
                                        {doc.User?.name} - {doc.specialization}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="date" className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    Date
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.appointmentDate}
                                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time" className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    Time
                                </Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.appointmentTime}
                                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Visit</Label>
                            <textarea
                                id="reason"
                                className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-primary/50"
                                placeholder="Briefly describe your symptoms..."
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => navigate('/patient')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="shadow-md hover:shadow-lg transition-all">
                                {loading ? 'Booking...' : 'Confirm Booking'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default BookAppointment;
