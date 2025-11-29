import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Download, Pill, FileSignature, Stethoscope, Calendar } from 'lucide-react';
import api from '../../services/api';

const MyPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const res = await api.get('/patient/prescriptions');
            setPrescriptions(res.data.data);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatMedicines = (prescription) => {
        if (!prescription || !prescription.PrescriptionMedicines || !Array.isArray(prescription.PrescriptionMedicines)) return 'N/A';
        if (prescription.PrescriptionMedicines.length === 0) return 'No medicines prescribed';
        return prescription.PrescriptionMedicines.map(pm => pm.Medicine?.name || 'Unknown').join(', ');
    };

    const extractDiagnosis = (instructions) => {
        if (!instructions) return 'N/A';
        const diagnosisMatch = instructions.match(/Diagnosis:\s*([^.]+)/);
        return diagnosisMatch ? diagnosisMatch[1].trim() : 'General Consultation';
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading prescriptions...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">My Prescriptions</h2>
                <p className="text-muted-foreground">Access your medical prescriptions and history.</p>
            </div>

            <Card className="shadow-md border-t-4 border-t-green-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileSignature className="h-5 w-5 text-green-600" />
                        Prescription History
                    </CardTitle>
                    <CardDescription>Details of medications prescribed by your doctors.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead>Date</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Diagnosis</TableHead>
                                    <TableHead>Medicines</TableHead>
                                    <TableHead>Instructions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prescriptions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                <Pill className="h-12 w-12 text-muted-foreground/20 mb-4" />
                                                <p>No prescriptions found.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    prescriptions.map((prescription) => (
                                        <TableRow key={prescription.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {prescription.date ? new Date(prescription.date).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Stethoscope className="h-3 w-3 text-muted-foreground" />
                                                    {prescription.Appointment?.Doctor?.User?.name || 'Unknown'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    {extractDiagnosis(prescription.instructions)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Pill className="h-4 w-4 text-primary" />
                                                    <span className="text-sm font-medium">{formatMedicines(prescription)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate text-sm text-muted-foreground" title={prescription.instructions}>
                                                {prescription.instructions || 'No additional instructions'}
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

export default MyPrescriptions;
