import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const AdminReports = () => {
    const data = [
        { name: 'Jan', revenue: 4000, patients: 240 },
        { name: 'Feb', revenue: 3000, patients: 139 },
        { name: 'Mar', revenue: 2000, patients: 980 },
        { name: 'Apr', revenue: 2780, patients: 390 },
        { name: 'May', revenue: 1890, patients: 480 },
        { name: 'Jun', revenue: 2390, patients: 380 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">System Reports</h2>
                <p className="text-muted-foreground">Analytics and performance metrics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-600 font-medium">+20.1%</span>
                            <span className="ml-1">from last month</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Patients</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-success/10 dark:bg-success/20 flex items-center justify-center">
                            <Users className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-600 font-medium">+180.1%</span>
                            <span className="ml-1">from last month</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-600 font-medium">+19%</span>
                            <span className="ml-1">from last month</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4 shadow-md">
                <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue performance for the current year.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar
                                dataKey="revenue"
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminReports;
