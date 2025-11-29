import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Plus, Search, Edit, Trash2, UserPlus, Stethoscope } from 'lucide-react';
import api from '../../services/api';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctors();
        fetchDepartments();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/admin/doctors');
            setDoctors(res.data.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/admin/departments');
            setDepartments(res.data.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const filteredDoctors = doctors.filter(doctor =>
        doctor.User?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddEdit = async (e) => {
        e.preventDefault();
        try {
            if (currentDoctor?.id) {
                await api.put(`/admin/doctors/${currentDoctor.id}`, currentDoctor);
                alert('Doctor updated successfully');
            } else {
                await api.post('/admin/doctors', currentDoctor);
                alert('Doctor added successfully');
            }
            setIsModalOpen(false);
            setCurrentDoctor(null);
            fetchDoctors();
        } catch (error) {
            console.error('Error saving doctor:', error);
            alert('Failed to save doctor');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await api.delete(`/admin/doctors/${id}`);
                fetchDoctors();
            } catch (error) {
                console.error('Error deleting doctor:', error);
                alert('Failed to delete doctor');
            }
        }
    };

    const openModal = (doctor = null) => {
        if (doctor) {
            setCurrentDoctor({
                id: doctor.id,
                name: doctor.User.name,
                email: doctor.User.email,
                phone: doctor.User.phone,
                specialization: doctor.specialization,
                departmentId: doctor.departmentId,
                fees: doctor.fees,
                schedule: doctor.schedule
            });
        } else {
            setCurrentDoctor({
                name: '',
                email: '',
                password: 'password123',
                phone: '',
                specialization: '',
                departmentId: '',
                fees: '',
                schedule: ''
            });
        }
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading doctors...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Doctors</h2>
                    <p className="text-muted-foreground">Manage medical staff and their schedules.</p>
                </div>
                <Button onClick={() => openModal()} className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Doctor
                </Button>
            </div>

            <Card className="shadow-md border-t-4 border-t-primary">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-primary" />
                            Doctor List
                        </CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name or specialization..."
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
                                    <TableHead>Specialization</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Fees</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDoctors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No doctors found matching your search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredDoctors.map((doctor) => (
                                        <TableRow key={doctor.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {doctor.User?.name?.charAt(0) || 'D'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{doctor.User?.name}</div>
                                                        <div className="text-xs text-muted-foreground">{doctor.User?.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                    {doctor.specialization}
                                                </span>
                                            </TableCell>
                                            <TableCell>{doctor.Department?.name}</TableCell>
                                            <TableCell>${doctor.fees}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openModal(doctor)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(doctor.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
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
                title={currentDoctor?.id ? 'Edit Doctor' : 'Add New Doctor'}
            >
                <form onSubmit={handleAddEdit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={currentDoctor?.name || ''}
                                onChange={(e) => setCurrentDoctor({ ...currentDoctor, name: e.target.value })}
                                required
                                placeholder="Dr. John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={currentDoctor?.email || ''}
                                onChange={(e) => setCurrentDoctor({ ...currentDoctor, email: e.target.value })}
                                required
                                disabled={!!currentDoctor?.id}
                                placeholder="doctor@hospital.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={currentDoctor?.phone || ''}
                                onChange={(e) => setCurrentDoctor({ ...currentDoctor, phone: e.target.value })}
                                required
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="specialization">Specialization</Label>
                            <Input
                                id="specialization"
                                value={currentDoctor?.specialization || ''}
                                onChange={(e) => setCurrentDoctor({ ...currentDoctor, specialization: e.target.value })}
                                required
                                placeholder="Cardiology"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <select
                                id="department"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={currentDoctor?.departmentId || ''}
                                onChange={(e) => setCurrentDoctor({ ...currentDoctor, departmentId: e.target.value })}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fees">Consultation Fees ($)</Label>
                            <Input
                                id="fees"
                                type="number"
                                value={currentDoctor?.fees || ''}
                                onChange={(e) => setCurrentDoctor({ ...currentDoctor, fees: e.target.value })}
                                required
                                placeholder="100"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {currentDoctor?.id ? 'Update Doctor' : 'Save Doctor'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Doctors;
