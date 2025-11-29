import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--destructive))', 'hsl(var(--secondary))', 'hsl(214 100% 75%)', 'hsl(168 76% 50%)'];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                <p className="text-sm font-medium text-foreground mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-xs text-muted-foreground">
                        <span style={{ color: entry.color }}>{entry.name}: </span>
                        <span className="font-semibold">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Patient Health Trends Chart
export const HealthTrendsChart = ({ data }) => {
    const defaultData = data || [
        { month: 'Jan', appointments: 4, labTests: 2 },
        { month: 'Feb', appointments: 3, labTests: 1 },
        { month: 'Mar', appointments: 5, labTests: 3 },
        { month: 'Apr', appointments: 2, labTests: 1 },
        { month: 'May', appointments: 6, labTests: 4 },
        { month: 'Jun', appointments: 4, labTests: 2 },
    ];

    return (
        <Card className="hover-lift">
            <CardHeader>
                <CardTitle>Health Activity Trends</CardTitle>
                <CardDescription>Your medical activity over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={defaultData}>
                        <defs>
                            <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLabTests" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Area type="monotone" dataKey="appointments" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorAppointments)" name="Appointments" />
                        <Area type="monotone" dataKey="labTests" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorLabTests)" name="Lab Tests" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

// Appointment Statistics Chart (for Doctors/Admins)
export const AppointmentStatsChart = ({ data }) => {
    const defaultData = data || [
        { day: 'Mon', completed: 12, pending: 3, cancelled: 1 },
        { day: 'Tue', completed: 15, pending: 5, cancelled: 2 },
        { day: 'Wed', completed: 10, pending: 4, cancelled: 1 },
        { day: 'Thu', completed: 18, pending: 2, cancelled: 0 },
        { day: 'Fri', completed: 14, pending: 6, cancelled: 3 },
        { day: 'Sat', completed: 8, pending: 2, cancelled: 1 },
        { day: 'Sun', completed: 5, pending: 1, cancelled: 0 },
    ];

    return (
        <Card className="hover-lift">
            <CardHeader>
                <CardTitle>Weekly Appointment Statistics</CardTitle>
                <CardDescription>Breakdown of appointments by status</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={defaultData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="completed" fill="hsl(var(--success))" name="Completed" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pending" fill="hsl(var(--primary))" name="Pending" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="cancelled" fill="hsl(var(--destructive))" name="Cancelled" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

// Revenue Chart (for Admins)
export const RevenueChart = ({ data }) => {
    const defaultData = data || [
        { month: 'Jan', revenue: 45000, expenses: 32000 },
        { month: 'Feb', revenue: 52000, expenses: 35000 },
        { month: 'Mar', revenue: 48000, expenses: 33000 },
        { month: 'Apr', revenue: 61000, expenses: 38000 },
        { month: 'May', revenue: 55000, expenses: 36000 },
        { month: 'Jun', revenue: 67000, expenses: 40000 },
    ];

    return (
        <Card className="hover-lift">
            <CardHeader>
                <CardTitle>Revenue & Expenses</CardTitle>
                <CardDescription>Monthly financial overview</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={defaultData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} name="Revenue" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={2} name="Expenses" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

// Department Distribution Chart (for Admins)
export const DepartmentDistributionChart = ({ data }) => {
    const defaultData = data || [
        { name: 'Cardiology', value: 35 },
        { name: 'Neurology', value: 25 },
        { name: 'Pediatrics', value: 20 },
        { name: 'Orthopedics', value: 15 },
        { name: 'Dermatology', value: 5 },
    ];

    return (
        <Card className="hover-lift">
            <CardHeader>
                <CardTitle>Patient Distribution by Department</CardTitle>
                <CardDescription>Current patient load across departments</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={defaultData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {defaultData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default {
    HealthTrendsChart,
    AppointmentStatsChart,
    RevenueChart,
    DepartmentDistributionChart,
};
