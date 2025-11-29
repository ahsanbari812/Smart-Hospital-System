import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import ThemeToggle from '../components/ThemeToggle';
import { LogOut, User, Bell } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6 shadow-sm z-10">
            <div className="flex-1">
                <h1 className="text-xl font-semibold text-foreground tracking-tight">
                    Welcome back, <span className="text-primary">{user?.name}</span>
                </h1>
                <p className="text-xs text-muted-foreground">Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                </Button>
                <div className="inline-block">
                    <ThemeToggle inline />
                </div>
                <div className="h-8 w-[1px] bg-border mx-2"></div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-sm font-medium">{user?.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </header>
    );
};

export default Navbar;
