import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Disc3, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Minimum 6 characters required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });

    if (user) {
        return <Navigate to="/" replace />;
    }

    const onSubmit = async (data: LoginForm) => {
        setError('');
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            navigate('/');
        } catch (e: any) {
            setError(e.message || 'Login failed.');
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-dark-900 to-dark-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">

            {/* Background decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-3xl mb-4 backdrop-blur-xl shadow-2xl shadow-cyan-500/20">
                        <Disc3 className="w-12 h-12 text-cyan-400" />
                    </div>
                    <h1 className="text-4xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 uppercase">
                        FragHub
                    </h1>

                    <p className="text-slate-400 font-medium tracking-wide">Gaming Cafe Management System</p>
                </div>

                <div className="glass-card p-8 rounded-3xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                            <Input
                                type="email"
                                placeholder="manager@gameground.com"
                                {...register('email')}
                                error={errors.email?.message}
                                className="h-12 text-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                error={errors.password?.message}
                                className="h-12 text-lg font-mono tracking-widest"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg mt-2 font-bold tracking-wide shadow-cyan-500/30 shadow-xl"
                            isLoading={isSubmitting}
                        >
                            ACCESS SECURE TERMINAL
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> Demo Credentials
                        </h4>
                        <div className="space-y-2 text-sm font-mono text-slate-400 bg-black/20 p-4 rounded-xl border border-white/5">
                            <div>Admin: admin@gameground.com / admin123</div>
                            <div>Manager: manager@gameground.com / manager123</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
