import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';
import { Search, User, FileText, Users } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Link } from 'react-router-dom';

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get('/doctor/patients');
                setPatients(res.data.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p =>
        p.User?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading patients...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">My Patients</h2>
                    <p className="text-muted-foreground">View and manage your patient records.</p>
                </div>
            </div>

            <Card className="shadow-md border-t-4 border-t-teal-500">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-teal-600" />
                            Patient List
                        </CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name..."
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>DOB</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPatients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No patients found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPatients.map((patient) => (
                                        <TableRow key={patient.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">
                                                        {patient.User?.name?.charAt(0) || 'P'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{patient.User?.name}</div>
                                                        <div className="text-xs text-muted-foreground">{patient.User?.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{patient.dob || 'N/A'}</TableCell>
                                            <TableCell className="capitalize">{patient.gender || 'N/A'}</TableCell>
                                            <TableCell>{patient.User?.phone || 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild className="hover:bg-primary/5 hover:text-primary">
                                                    <Link to={`/doctor/patient/${patient.id}`}>
                                                        <FileText className="mr-2 h-4 w-4" /> History
                                                    </Link>
                                                </Button>
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

export default DoctorPatients;
