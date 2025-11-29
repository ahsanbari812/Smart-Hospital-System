import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Download, FlaskConical, FileText, User } from 'lucide-react';
import api from '../../services/api';

const LabResults = () => {
    const [labTests, setLabTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLabTests();
    }, []);

    const fetchLabTests = async () => {
        try {
            const res = await api.get('/patient/lab-tests');
            setLabTests(res.data.data);
        } catch (error) {
            console.error('Error fetching lab tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'ordered':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading lab results...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Lab Results</h2>
                <p className="text-muted-foreground">View and download your laboratory test reports.</p>
            </div>

            <Card className="shadow-md border-t-4 border-t-orange-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="h-5 w-5 text-orange-600" />
                        Test Reports
                    </CardTitle>
                    <CardDescription>A list of all your ordered and completed lab tests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead>Date Ordered</TableHead>
                                    <TableHead>Test Name</TableHead>
                                    <TableHead>Ordered By</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {labTests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                <FlaskConical className="h-12 w-12 text-muted-foreground/20 mb-4" />
                                                <p>No lab tests found.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    labTests.map((test) => (
                                        <TableRow key={test.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">
                                                {test.createdAt ? new Date(test.createdAt).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                                    {test.LabTestCatalog?.testName || 'Unknown Test'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3 text-muted-foreground" />
                                                    {test.Doctor?.User?.name || 'Unknown'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(test.status)}>
                                                    {test.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>${Number(test.LabTestCatalog?.price || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                {test.status === 'completed' && test.resultUrl ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(test.resultUrl, '_blank')}
                                                        className="hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                                                    >
                                                        <Download className="mr-2 h-3 w-3" /> View Result
                                                    </Button>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground italic">Pending</span>
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

export default LabResults;
