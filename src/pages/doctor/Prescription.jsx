import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Plus, Trash2, Save, FlaskConical, Pill, FileSignature, User } from 'lucide-react';
import api from '../../services/api';

const Prescription = () => {
    const { id } = useParams(); // Appointment ID
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    const [medicines, setMedicines] = useState([]);
    const [currentMed, setCurrentMed] = useState({ name: '', dosage: '', duration: '' });
    const [diagnosis, setDiagnosis] = useState('');
    const [instructions, setInstructions] = useState('');

    // Lab Test State
    const [labTestName, setLabTestName] = useState('');
    const [labTestNotes, setLabTestNotes] = useState('');

    useEffect(() => {
        fetchAppointmentDetails();
    }, [id]);

    const fetchAppointmentDetails = async () => {
        try {
            // We don't have a direct "get appointment by id" for doctor in the controller shown, 
            // but we can filter from "getDoctorAppointments" or add a new endpoint.
            // For efficiency, let's assume we can fetch it or find it.
            // Actually, let's just fetch all and find.
            const res = await api.get('/doctor/appointments');
            const apt = res.data.data.find(a => a.id === parseInt(id));
            if (apt) {
                setAppointment(apt);
            } else {
                alert('Appointment not found');
                navigate('/doctor');
            }
        } catch (error) {
            console.error('Error fetching appointment:', error);
        } finally {
            setLoading(false);
        }
    };

    const addMedicine = () => {
        if (currentMed.name && currentMed.dosage) {
            setMedicines([...medicines, { ...currentMed, id: Date.now() }]);
            setCurrentMed({ name: '', dosage: '', duration: '' });
        }
    };

    const removeMedicine = (id) => {
        setMedicines(medicines.filter(m => m.id !== id));
    };

    const handleSavePrescription = async () => {
        try {
            await api.post('/doctor/prescriptions', {
                appointmentId: id,
                medicines,
                instructions: `${diagnosis ? 'Diagnosis: ' + diagnosis + '. ' : ''}${instructions}`
            });
            alert('Prescription saved and bill generated!');
            navigate('/doctor');
        } catch (error) {
            console.error('Error saving prescription:', error);
            alert('Failed to save prescription');
        }
    };

    const handleOrderLabTest = async () => {
        if (!labTestName) return;
        try {
            await api.post('/doctor/lab-tests', {
                patientId: appointment.patientId,
                testName: labTestName,
                notes: labTestNotes
            });
            alert('Lab test ordered and added to bill!');
            setLabTestName('');
            setLabTestNotes('');
        } catch (error) {
            console.error('Error ordering lab test:', error);
            alert('Failed to order lab test');
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading consultation details...</div>;
    if (!appointment) return <div className="p-8 text-center text-destructive">Appointment not found</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Consultation</h2>
                    <p className="text-muted-foreground">Manage diagnosis, prescription, and lab orders.</p>
                </div>
                <Button onClick={handleSavePrescription} className="shadow-md hover:shadow-lg transition-all" variant="success">
                    <Save className="mr-2 h-4 w-4" /> Complete Consultation
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 h-fit shadow-md border-t-4 border-t-blue-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Patient Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center text-center pb-4 border-b">
                            <div className="h-20 w-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-blue-600 mb-3">
                                <span className="text-2xl font-bold">{appointment.Patient?.User?.name?.charAt(0)}</span>
                            </div>
                            <div className="font-bold text-lg">{appointment.Patient?.User?.name}</div>
                            <div className="text-sm text-muted-foreground">{appointment.Patient?.User?.email}</div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="font-medium">{appointment.Patient?.User?.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Reason:</span>
                                <span className="font-medium">{appointment.reason}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card className="shadow-md border-t-4 border-t-green-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileSignature className="h-5 w-5 text-green-600" />
                                Diagnosis & Medicines
                            </CardTitle>
                            <CardDescription>Record diagnosis and prescribe medication.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="diagnosis">Diagnosis</Label>
                                <Input
                                    id="diagnosis"
                                    placeholder="e.g. Viral Fever"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    className="border-green-200 focus:border-green-500"
                                />
                            </div>

                            <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
                                <h4 className="font-medium flex items-center gap-2">
                                    <Pill className="h-4 w-4 text-primary" />
                                    Add Medicine
                                </h4>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Medicine Name</Label>
                                        <Input
                                            placeholder="e.g. Paracetamol"
                                            value={currentMed.name}
                                            onChange={(e) => setCurrentMed({ ...currentMed, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Dosage</Label>
                                        <Input
                                            placeholder="e.g. 500mg, 1-0-1"
                                            value={currentMed.dosage}
                                            onChange={(e) => setCurrentMed({ ...currentMed, dosage: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Duration</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="e.g. 5 days"
                                                value={currentMed.duration}
                                                onChange={(e) => setCurrentMed({ ...currentMed, duration: e.target.value })}
                                            />
                                            <Button onClick={addMedicine} size="icon" className="shrink-0">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {medicines.length > 0 && (
                                <div className="rounded-lg border shadow-sm overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                                <TableHead>Medicine</TableHead>
                                                <TableHead>Dosage</TableHead>
                                                <TableHead>Duration</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {medicines.map((med) => (
                                                <TableRow key={med.id} className="hover:bg-muted/30 transition-colors">
                                                    <TableCell className="font-medium">{med.name}</TableCell>
                                                    <TableCell>{med.dosage}</TableCell>
                                                    <TableCell>{med.duration}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeMedicine(med.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="notes">Additional Instructions</Label>
                                <textarea
                                    id="notes"
                                    className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-primary/50"
                                    placeholder="Dietary restrictions, follow up date, etc."
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md border-t-4 border-t-orange-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FlaskConical className="h-5 w-5 text-orange-600" />
                                Order Lab Tests
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Test Name</Label>
                                    <Input
                                        placeholder="e.g. CBC, Lipid Profile"
                                        value={labTestName}
                                        onChange={(e) => setLabTestName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Notes for Lab</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Urgent, etc."
                                            value={labTestNotes}
                                            onChange={(e) => setLabTestNotes(e.target.value)}
                                        />
                                        <Button onClick={handleOrderLabTest} variant="outline" className="shrink-0 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200">Order</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Prescription;
