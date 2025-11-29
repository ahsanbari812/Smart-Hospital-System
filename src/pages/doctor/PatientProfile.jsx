import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';
import { User, Calendar, Phone, FileText, Activity, Pill } from 'lucide-react';

const PatientProfile = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await api.get(`/doctor/patients/${id}`);
                const data = response.data.data;

                // Calculate age from DOB
                const calculateAge = (dob) => {
                    if (!dob) return 'N/A';
                    const birthDate = new Date(dob);
                    const difference = Date.now() - birthDate.getTime();
                    const ageDate = new Date(difference);
                    return Math.abs(ageDate.getUTCFullYear() - 1970);
                };

                const patientData = {
                    name: data.User.name,
                    gender: data.gender || 'N/A',
                    age: calculateAge(data.dob),
                    phone: data.User.phone || 'N/A',
                    lastVisit: data.Appointments && data.Appointments.length > 0
                        ? data.Appointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))[0].appointmentDate
                        : 'N/A',
                };

                const historyData = (data.Appointments || [])
                    .filter(app => app.Prescription)
                    .map(app => ({
                        date: app.appointmentDate,
                        diagnosis: app.Prescription.diagnosis || 'N/A',
                        prescription: app.Prescription.PrescriptionMedicines
                            ? app.Prescription.PrescriptionMedicines.map(pm => pm.Medicine ? pm.Medicine.name : 'Unknown').join(', ')
                            : 'N/A',
                        doctor: app.Doctor && app.Doctor.User ? `Dr. ${app.Doctor.User.name}` : 'Unknown'
                    }))
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                setPatient(patientData);
                setHistory(historyData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching patient details:", err);
                setError("Failed to load patient details.");
                setLoading(false);
            }
        };

        fetchPatientDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500">
                {error}
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex items-center justify-center h-screen">
                Patient not found
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Patient Profile</h2>
                <p className="text-muted-foreground">Detailed medical history and personal information.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 shadow-md border-t-4 border-t-blue-500 h-fit">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Personal Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center text-center pb-4 border-b">
                            <div className="h-24 w-24 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-blue-600 mb-4">
                                <User className="h-12 w-12" />
                            </div>
                            <div className="font-bold text-xl">{patient.name}</div>
                            <div className="text-sm text-muted-foreground capitalize">{patient.gender}, {patient.age} years</div>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{patient.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Last Visit: <span className="font-medium">{patient.lastVisit}</span></span>
                            </div>
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <Activity className="h-4 w-4 text-muted-foreground" />
                                <span>Status: <Badge variant="success" className="ml-1">Active</Badge></span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card className="shadow-md border-t-4 border-t-purple-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-purple-600" />
                                Medical History
                            </CardTitle>
                            <CardDescription>Past diagnoses and treatments.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border shadow-sm overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                                            <TableHead>Date</TableHead>
                                            <TableHead>Diagnosis</TableHead>
                                            <TableHead>Prescription</TableHead>
                                            <TableHead>Doctor</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {history.length > 0 ? (
                                            history.map((record, index) => (
                                                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                                                    <TableCell className="font-medium">{record.date}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                                                            {record.diagnosis}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Pill className="h-3 w-3 text-muted-foreground" />
                                                            {record.prescription}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{record.doctor}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                                                    No medical history found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md border-t-4 border-t-orange-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-orange-600" />
                                Lab Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
                                <FileText className="mb-2 h-10 w-10 opacity-20" />
                                <p>No recent lab reports found for this patient.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
