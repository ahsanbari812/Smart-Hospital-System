import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, Stethoscope, Calendar, DollarSign, BarChart as BarChartIcon, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import api from '../../services/api';
import { DashboardSkeleton } from '../../components/ui/SkeletonLoaders';
import { RevenueChart, DepartmentDistributionChart } from '../../components/Charts';
import { showError } from '../../utils/toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    // Mock data for charts (backend doesn't provide historical data yet)
    const chartData = [
        { name: 'Mon', patients: 40, revenue: 2400 },
        { name: 'Tue', patients: 30, revenue: 1398 },
        { name: 'Wed', patients: 20, revenue: 9800 },
        { name: 'Thu', patients: 27, revenue: 3908 },
        { name: 'Fri', patients: 18, revenue: 4800 },
        { name: 'Sat', patients: 23, revenue: 3800 },
        { name: 'Sun', patients: 34, revenue: 4300 },
    ];

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data.data);
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            showError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8 page-enter">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover-lift border-l-4 border-l-blue-500 stagger-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.patients}</div>
                        <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card className="hover-lift border-l-4 border-l-green-500 stagger-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Doctors</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-success/10 dark:bg-success/20 flex items-center justify-center">
                            <Stethoscope className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.doctors}</div>
                        <p className="text-xs text-muted-foreground mt-1">Available for consultation</p>
                    </CardContent>
                </Card>
                <Card className="hover-lift border-l-4 border-l-purple-500 stagger-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Appointments</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.appointments}</div>
                        <p className="text-xs text-muted-foreground mt-1">Scheduled this month</p>
                    </CardContent>
                </Card>
                <Card className="hover-lift border-l-4 border-l-yellow-500 stagger-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-yellow-500/10 dark:bg-yellow-500/20 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-yellow-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">${stats.revenue}</div>
                        <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover-glow active-press transition-all cursor-pointer group bg-gradient-to-br from-card to-primary/5 dark:to-primary/10 animate-in fade-in slide-in-from-left duration-500 delay-200" onClick={() => navigate('/admin/reports')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Reports</CardTitle>
                        <BarChartIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">View Analytics</div>
                        <p className="text-xs text-muted-foreground">System performance & stats</p>
                    </CardContent>
                </Card>

                <Card className="hover-glow active-press transition-all cursor-pointer group bg-gradient-to-br from-card to-secondary/5 dark:to-secondary/10 animate-in fade-in slide-in-from-right duration-500 delay-200" onClick={() => navigate('/admin/lab-manager')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium group-hover:text-secondary transition-colors">Lab Manager</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">Manage Labs</div>
                        <p className="text-xs text-muted-foreground">Upload & verify results</p>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue and Department Charts */}
            <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                <RevenueChart />
                <DepartmentDistributionChart />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 shadow-md hover-lift animate-in fade-in slide-in-from-left duration-500 delay-400">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ fill: '#f3f4f6' }}
                                />
                                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3 shadow-md">
                    <CardHeader>
                        <CardTitle>Patient Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line type="monotone" dataKey="patients" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--secondary))' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
