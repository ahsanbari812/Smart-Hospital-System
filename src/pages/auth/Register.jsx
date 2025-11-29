import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import ThemeToggle from '../../components/ThemeToggle';
import { Activity, User, Mail, Phone, Lock, Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        gender: '',
        dob: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                gender: formData.gender,
                dob: formData.dob,
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 animate-in fade-in duration-500">
                <ThemeToggle />
                <Card className="w-full max-w-md shadow-xl border-t-4 border-t-green-500">
                    <CardHeader className="text-center pb-6">
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-success/10 dark:bg-success/20 p-4 shadow-inner animate-in zoom-in duration-500">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-green-600">Registration Successful!</CardTitle>
                        <CardDescription className="text-base">
                            Your account has been created successfully.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <p className="text-muted-foreground">Redirecting to login page...</p>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div className="bg-green-500 h-full animate-[progress_2s_ease-in-out_forwards] w-full origin-left" />
                        </div>
                        <Button onClick={() => navigate('/login')} className="w-full" variant="success">
                            Go to Login Now
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 py-8 animate-in fade-in duration-500">
            <ThemeToggle />
            <div className="absolute top-4 left-4">
                <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Button>
            </div>

            <Card className="w-full max-w-lg shadow-xl border-t-4 border-t-primary">
                <CardHeader className="space-y-1 text-center pb-6">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-4 shadow-inner">
                            <Activity className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                    <CardDescription className="text-base">
                        Enter your information to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="transition-all hover:border-primary/50 focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@patient,doctor,admin.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="transition-all hover:border-primary/50 focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="1234567890"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="transition-all hover:border-primary/50 focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dob" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    Date of Birth
                                </Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                    className="transition-all hover:border-primary/50 focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                id="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className="transition-all hover:border-primary/50 focus:border-primary"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Select>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="transition-all hover:border-primary/50 focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="transition-all hover:border-primary/50 focus:border-primary"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200 animate-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 text-base shadow-md hover:shadow-lg transition-all" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create account'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground pt-2 pb-6">
                    <div>
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline transition-all">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;
