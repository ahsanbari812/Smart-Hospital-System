import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import ThemeToggle from '../components/ThemeToggle';
import { User, Stethoscope, Shield, Activity, ArrowRight, CheckCircle2, Heart, Clock, Smartphone, Lock, Zap } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogin = (role) => {
        if (user) {
            logout();
        }
        navigate('/login', { state: { role } });
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden relative selection:bg-primary/30">
            <ThemeToggle />

            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-20 pb-16 lg:pt-32 lg:pb-24">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Hero Text */}
                    <div className="flex-1 text-center lg:text-left space-y-8 z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Zap className="h-4 w-4" />
                            <span>Next-Gen Hospital Management</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            Healthcare <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-secondary animate-gradient-xy">
                                Reimagined
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                            Experience the future of medical administration. A seamless, secure, and intelligent platform connecting patients, doctors, and administrators in real-time.
                        </p>

                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Button size="lg" onClick={() => navigate('/register')} className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 border-0">
                                    Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button variant="outline" size="lg" onClick={() => navigate('/login')} className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/10 hover:text-secondary hover:border-secondary/50 transition-all duration-300">
                                    Login to Portal
                                </Button>
                            </div>

                            <div className="text-sm text-muted-foreground bg-card/50 backdrop-blur-sm px-6 py-3 rounded-xl border inline-block shadow-sm">
                                Use email domains to register: <span className="font-mono font-semibold text-primary">@patient.com</span>, <span className="font-mono font-semibold text-success">@doctor.com</span>, or <span className="font-mono font-semibold text-secondary">@admin.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual (Floating Dashboard) */}
                    <div className="flex-1 relative w-full max-w-xl lg:max-w-none animate-in fade-in zoom-in duration-1000 delay-300 hidden md:block">
                        <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                            {/* Main Card */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[2rem] transform rotate-3 scale-95 blur-2xl opacity-50"></div>
                            <Card className="absolute inset-4 glass-card rounded-[2rem] border-t-white/50 border-l-white/50 overflow-hidden z-20 animate-float">
                                <CardHeader className="border-b border-border/50 bg-muted/20 backdrop-blur-md">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="h-2 w-20 rounded-full bg-muted-foreground/20"></div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                            <Activity className="h-8 w-8" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 rounded bg-muted-foreground/20"></div>
                                            <div className="h-3 w-24 rounded bg-muted-foreground/10"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-20 w-full rounded-xl bg-muted/30 animate-pulse"></div>
                                        <div className="h-20 w-full rounded-xl bg-muted/30 animate-pulse delay-75"></div>
                                        <div className="h-20 w-full rounded-xl bg-muted/30 animate-pulse delay-150"></div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Floating Elements */}
                            <Card className="absolute -right-4 top-20 w-48 glass-card rounded-2xl p-4 z-30 animate-float animation-delay-2000 hidden lg:block">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/20 text-green-500">
                                        <Heart className="h-5 w-5 fill-current" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">Vitals Normal</div>
                                        <div className="text-xs text-muted-foreground">Just now</div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="absolute -left-8 bottom-32 w-56 glass-card rounded-2xl p-4 z-30 animate-float animation-delay-4000 hidden lg:block">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">Data Encrypted</div>
                                        <div className="text-xs text-muted-foreground">256-bit SSL Protection</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid (Bento Style) */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold">Everything you need</h2>
                    <p className="text-lg text-muted-foreground">Powerful features designed to streamline hospital operations and enhance patient care.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 bg-gradient-to-br from-card to-muted/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <Smartphone className="h-64 w-64" />
                        </div>
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Clock className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl">24/7 Real-time Access</CardTitle>
                            <CardDescription className="text-base">
                                Access your medical records, appointments, and prescriptions from anywhere, anytime. Our cloud-based system ensures you're always connected.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-32 w-full bg-background/50 rounded-xl border border-border/50 backdrop-blur-sm p-4 mt-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <div className="text-sm font-medium">System Online</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-3/4 rounded-full bg-muted-foreground/10"></div>
                                    <div className="h-2 w-1/2 rounded-full bg-muted-foreground/10"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-card to-muted/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-xl">Bank-Grade Security</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-6">
                                Your health data is protected with enterprise-grade encryption and HIPAA compliant protocols.
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                                <CheckCircle2 className="h-4 w-4" /> End-to-end Encrypted
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-card to-muted/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Activity className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-xl">Smart Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Advanced reporting and insights for hospital administrators to optimize resource allocation.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 bg-gradient-to-br from-card to-muted/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Stethoscope className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl">Integrated Lab Management</CardTitle>
                            <CardDescription className="text-base">
                                Seamlessly manage lab tests, results, and billing in one unified workflow.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            {/* Portals Section */}
            <div className="container mx-auto px-4 py-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10"></div>
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your Portal</h2>
                    <p className="text-lg text-muted-foreground">Dedicated interfaces tailored for every role.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                    {/* Patient Portal */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                        <Card className="relative h-full bg-card/80 backdrop-blur-xl border-t-4 border-t-blue-500 hover:-translate-y-2 transition-all duration-300">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <User className="h-10 w-10 text-blue-600" />
                                </div>
                                <CardTitle className="text-2xl">Patient</CardTitle>
                                <CardDescription>Access your personal health dashboard</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <ul className="space-y-2 text-sm text-muted-foreground mb-6 text-left pl-4">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Book Appointments</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> View Prescriptions</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> Pay Bills Online</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Doctor Portal */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                        <Card className="relative h-full bg-card/80 backdrop-blur-xl border-t-4 border-t-green-500 hover:-translate-y-2 transition-all duration-300">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Stethoscope className="h-10 w-10 text-green-600" />
                                </div>
                                <CardTitle className="text-2xl">Doctor</CardTitle>
                                <CardDescription>Manage patients and consultations</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <ul className="space-y-2 text-sm text-muted-foreground mb-6 text-left pl-4">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Manage Schedule</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Digital Prescriptions</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Patient History</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Admin Portal */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                        <Card className="relative h-full bg-card/80 backdrop-blur-xl border-t-4 border-t-purple-500 hover:-translate-y-2 transition-all duration-300">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="h-10 w-10 text-purple-600" />
                                </div>
                                <CardTitle className="text-2xl">Admin</CardTitle>
                                <CardDescription>System administration & oversight</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <ul className="space-y-2 text-sm text-muted-foreground mb-6 text-left pl-4">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-purple-500" /> User Management</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Financial Reports</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-purple-500" /> System Settings</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-8 text-center text-sm text-muted-foreground border-t bg-muted/30 relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">Smart Hospital System</span>
                </div>
                <p>&copy; 2025 Smart Hospital System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
