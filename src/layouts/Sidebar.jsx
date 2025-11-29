import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import {
    LayoutDashboard,
    Users,
    Stethoscope,
    Calendar,
    FileText,
    CreditCard,
    Activity,
    Building2
} from 'lucide-react';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const adminLinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
        { name: 'Patients', path: '/admin/patients', icon: Users },
        { name: 'Departments', path: '/admin/departments', icon: Building2 },
        { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
        { name: 'Reports', path: '/admin/reports', icon: FileText },
    ];

    const doctorLinks = [
        { name: 'Dashboard', path: '/doctor', icon: LayoutDashboard },
        { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
        { name: 'My Patients', path: '/doctor/patients', icon: Users },
    ];

    const patientLinks = [
        { name: 'Dashboard', path: '/patient', icon: LayoutDashboard },
        { name: 'My Appointments', path: '/patient/appointments', icon: Calendar },
        { name: 'Prescriptions', path: '/patient/prescriptions', icon: FileText },
        { name: 'Lab Results', path: '/patient/lab-results', icon: Activity },
        { name: 'Billing', path: '/patient/billing', icon: CreditCard },
    ];

    let links = [];
    if (user?.role === 'admin') links = adminLinks;
    else if (user?.role === 'doctor') links = doctorLinks;
    else if (user?.role === 'patient') links = patientLinks;

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground shadow-lg z-10">
            <div className="flex h-16 items-center border-b px-6 bg-primary/5">
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary p-1.5">
                        <Activity className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-primary">Smart Hospital</span>
                </div>
            </div>
            <div className="flex-1 overflow-auto py-6">
                <nav className="grid gap-1.5 px-3">
                    {links.map((link, index) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={index}
                                to={link.path}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md translate-x-1"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                                )}
                            >
                                <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t p-4 bg-muted/20">
                <div className="flex items-center gap-3 rounded-lg bg-card p-3 border shadow-sm">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-medium truncate">{user?.name}</span>
                        <span className="text-[10px] text-muted-foreground capitalize">{user?.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
