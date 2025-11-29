import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Search, Upload, FileText, FlaskConical } from 'lucide-react';

const LabManager = () => {
    const [labTests, setLabTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadingId, setUploadingId] = useState(null);
    const [resultUrl, setResultUrl] = useState('');

    useEffect(() => {
        fetchLabTests();
    }, []);

    const fetchLabTests = async () => {
        try {
            const res = await api.get('/admin/lab-tests');
            setLabTests(res.data.data);
        } catch (error) {
            console.error('Error fetching lab tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadResult = async (id) => {
        try {
            await api.put(`/admin/lab-tests/${id}`, {
                resultUrl,
                status: 'completed'
            });
            setUploadingId(null);
            setResultUrl('');
            fetchLabTests();
        } catch (error) {
            console.error('Error uploading result:', error);
            alert('Failed to upload result');
        }
    };

    const filteredTests = labTests.filter(test =>
        test.Patient?.User?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Lab Manager</h1>
                    <p className="text-muted-foreground">Manage lab test orders and upload results.</p>
                </div>
            </div>

            <Card className="shadow-md border-t-4 border-t-orange-500">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FlaskConical className="h-5 w-5 text-orange-600" />
                            Lab Test Orders
                        </CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tests or patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
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
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Test Name</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground animate-pulse">Loading lab tests...</TableCell>
                                    </TableRow>
                                ) : filteredTests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No lab tests found</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTests.map((test) => (
                                        <TableRow key={test.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">{new Date(test.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>{test.Patient?.User?.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                                    {test.testName}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{test.Doctor?.User?.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={test.status === 'completed' ? 'success' : 'warning'}>
                                                    {test.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {test.status === 'completed' ? (
                                                    <div className="flex items-center space-x-2">
                                                        <FileText className="h-4 w-4 text-blue-500" />
                                                        <span className="text-sm truncate max-w-[150px] text-muted-foreground">{test.resultUrl}</span>
                                                    </div>
                                                ) : uploadingId === test.id ? (
                                                    <div className="flex items-center space-x-2">
                                                        <Input
                                                            placeholder="Result URL/Text"
                                                            value={resultUrl}
                                                            onChange={(e) => setResultUrl(e.target.value)}
                                                            className="h-8 w-[200px]"
                                                        />
                                                        <Button size="sm" onClick={() => handleUploadResult(test.id)}>Save</Button>
                                                        <Button size="sm" variant="ghost" onClick={() => setUploadingId(null)}>Cancel</Button>
                                                    </div>
                                                ) : (
                                                    <Button size="sm" variant="outline" onClick={() => setUploadingId(test.id)} className="hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Upload Result
                                                    </Button>
                                                )}
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

export default LabManager;
