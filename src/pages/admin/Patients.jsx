import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Search, Users } from 'lucide-react';
import api from '../../services/api';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await api.get('/admin/patients');
            setPatients(res.data.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(patient =>
        (patient.User?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.User?.phone || '').includes(searchTerm)
    );

    const handleAddEdit = (e) => {
        e.preventDefault();
        alert("Add/Edit functionality requires backend implementation.");
        setIsModalOpen(false);
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading patients...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Patients</h2>
                    <p className="text-muted-foreground">View and manage registered patients.</p>
                </div>
            </div>

            <Card className="shadow-md border-t-4 border-t-green-500">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-green-600" />
                            Patient List
                        </CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name or phone..."
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
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Phone</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPatients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No patients found matching your search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPatients.map((patient) => (
                                        <TableRow key={patient.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-success/10 dark:bg-success/20 flex items-center justify-center text-green-700 font-bold text-xs">
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
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentPatient?.id ? 'Edit Patient' : 'Add Patient'}
            >
                <form onSubmit={handleAddEdit} className="space-y-4">
                    <p className="text-muted-foreground">Feature coming soon.</p>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Patients;
