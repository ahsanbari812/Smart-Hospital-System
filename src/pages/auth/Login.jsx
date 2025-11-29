import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import ThemeToggle from '../../components/ThemeToggle';
import { Activity, Lock, Mail, ArrowLeft } from 'lucide-react';

const Login = () => {
    const location = useLocation();
    const { role } = location.state || {};

    const getInitialCreds = (role) => {
        switch (role) {
            case 'admin': return { email: 'admin@hospital.com', password: 'password123' };
            case 'doctor': return { email: 'doctor@hospital.com', password: 'password123' };
            case 'patient': return { email: 'patient@hospital.com', password: 'password123' };
            default: return { email: '', password: '' };
        }
    };

    const initialCreds = getInitialCreds(role);
    const [email, setEmail] = useState(initialCreds.email);
    const [password, setPassword] = useState(initialCreds.password);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            navigate(`/${user.role}`);
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 animate-in fade-in duration-500">
            <ThemeToggle />
            <div className="absolute top-4 left-4">
                <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Button>
            </div>

            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                <CardHeader className="space-y-1 text-center pb-6">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-4 shadow-inner">
                            <Activity className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-base">
                        Sign in to your Smart Hospital account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@patient,doctor,admin.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 transition-all hover:border-primary/50 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                    Password
                                </Label>
                                <Link to="#" className="text-sm font-medium text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11 transition-all hover:border-primary/50 focus:border-primary"
                            />
                        </div>
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200 animate-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full h-11 text-base shadow-md hover:shadow-lg transition-all" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground pt-2 pb-6">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                    <div>
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-primary hover:underline transition-all">
                            Create an account
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
