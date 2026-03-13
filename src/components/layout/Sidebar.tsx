import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, Disc3, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (e) {
            console.error(e);
        }
    };

    const navItems = [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/customers', label: 'Customers', icon: Users },
        { to: '/reports', label: 'Reports', icon: BarChart3 },
        ...(user?.role === 'admin' ? [{ to: '/settings', label: 'Settings', icon: Settings }] : [])
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-dark-900/80 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col">
            <div className="h-20 flex items-center px-6 border-b border-white/10 gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                    <Disc3 className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
                        FragHub
                    </h1>

                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 group',
                                isActive
                                    ? 'bg-cyan-500/10 text-cyan-400'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={cn('w-5 h-5', isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white')} />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="bg-dark-800/50 rounded-xl p-4 mb-4 flex items-center gap-3 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-white text-lg">
                            {user?.role === 'admin' ? 'A' : 'M'}
                        </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user?.name || 'Authorized User'}</p>
                        <p className="text-xs font-semibold text-cyan-400 flex items-center gap-1 uppercase tracking-wider">
                            {user?.role === 'admin' && <ShieldAlert className="w-3 h-3 text-red-400" />} {user?.role}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 font-semibold hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" /> Logout
                </button>
            </div>
        </aside>
    );
};
