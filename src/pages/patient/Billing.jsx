import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';
import { CreditCard, DollarSign, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const Billing = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await api.get('/patient/bills');
            setBills(res.data.data);
        } catch (error) {
            console.error('Error fetching bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (id) => {
        try {
            await api.put(`/patient/bills/${id}/pay`, { paymentMethod: 'Online' });
            // Refresh bills
            fetchBills();
            alert('Payment successful!');
        } catch (error) {
            console.error('Error paying bill:', error);
            alert('Payment failed');
        }
    };

    const totalDue = bills.reduce((acc, bill) => bill.status === 'unpaid' ? acc + Number(bill.amount) : acc, 0);

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading billing information...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Billing & Payments</h2>
                <p className="text-muted-foreground">Manage your invoices and payments.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-md border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Due</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">${totalDue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Outstanding balance</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md border-t-4 border-t-blue-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Invoice History
                    </CardTitle>
                    <CardDescription>View and pay your medical bills.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bills.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No invoices found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bills.map((bill) => (
                                        <TableRow key={bill.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">
                                                {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                            <TableCell>Appointment #{bill.appointmentId}</TableCell>
                                            <TableCell className="font-semibold">${Number(bill.amount).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Badge variant={bill.status === 'paid' ? 'success' : 'destructive'} className="flex w-fit items-center gap-1">
                                                    {bill.status === 'paid' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                                    <span className="capitalize">{bill.status}</span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {bill.status === 'unpaid' ? (
                                                    <Button size="sm" onClick={() => handlePay(bill.id)} className="shadow-sm hover:shadow-md transition-all">
                                                        <CreditCard className="mr-2 h-3 w-3" /> Pay Now
                                                    </Button>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Paid</span>
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

export default Billing;
