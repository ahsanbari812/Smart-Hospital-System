import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Plus, Trash2, Building2, Activity } from 'lucide-react';
import api from '../../services/api';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDept, setNewDept] = useState({ name: '', description: '', image: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/admin/departments');
            setDepartments(res.data.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/departments', newDept);
            alert('Department added successfully');
            setIsModalOpen(false);
            setNewDept({ name: '', description: '', image: '' });
            fetchDepartments();
        } catch (error) {
            console.error('Error adding department:', error);
            alert('Failed to add department');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            // Note: Delete API for department is not explicitly shown in controller but usually exists.
            // If not, we might need to add it. For now, let's assume it's not there or we skip it.
            // Checking adminRoutes.js, there is NO delete route for departments.
            // So I will just alert for now.
            alert('Delete functionality not implemented in backend yet.');
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading departments...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Departments</h2>
                    <p className="text-muted-foreground">Manage hospital departments and services.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="shadow-md hover:shadow-lg transition-all">
                    <Plus className="mr-2 h-4 w-4" /> Add Department
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {departments.map((dept) => (
                    <Card key={dept.id} className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500 group">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(dept.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button> */}
                            </div>
                            <CardTitle className="mt-4 text-xl">{dept.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="line-clamp-3">
                                {dept.description || 'No description provided for this department.'}
                            </CardDescription>
                            <div className="mt-4 flex items-center text-sm text-muted-foreground">
                                <Activity className="mr-2 h-4 w-4 text-green-500" />
                                <span>Active</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Department"
            >
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Department Name</Label>
                        <Input
                            id="name"
                            value={newDept.name}
                            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                            required
                            placeholder="e.g. Cardiology"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={newDept.description}
                            onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                            placeholder="Brief description of services..."
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Add Department</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Departments;
