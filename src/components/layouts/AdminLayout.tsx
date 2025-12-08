
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout: React.FC = () => {
    const { user, loading, signOut } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading && !user) {
            navigate('/admin/login');
        }
    }, [user, loading, navigate]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-stone-900 text-white min-h-screen flex-shrink-0">
                <div className="p-6">
                    <h2 className="text-xl font-bold flex items-center space-x-2">
                        <span className="text-forest-400">Admin</span>
                        <span>Panel</span>
                    </h2>
                </div>

                <nav className="px-4 space-y-2">
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        to="/admin/posts"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                        <span>Blog Posts</span>
                    </Link>
                    <a
                        href="/"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Home className="w-5 h-5" />
                        <span>View Site</span>
                    </a>
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors w-full text-left text-red-400 hover:text-red-300"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
