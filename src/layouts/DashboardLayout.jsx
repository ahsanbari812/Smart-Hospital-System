import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-auto p-6 md:p-8 bg-muted/30">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
