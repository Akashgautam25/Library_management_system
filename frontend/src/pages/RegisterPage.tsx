import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validators';
import { 
    Mail, 
    Lock, 
    User, 
    Loader2, 
    Eye, 
    EyeOff, 
    BookOpen, 
    ShieldCheck, 
    GraduationCap 
} from 'lucide-react';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<'student' | 'admin'>('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (name.trim().length < 2) {
            setError('Please enter your full name.');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await register({ name, email, password, role });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Blur Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-lg"
            >
                <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    
                    {/* Header */}
                    <div className="text-center mb-8 relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-accent to-blue-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 shadow-accent/20">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-primaryText mb-2 tracking-tight">Create Account</h1>
                        <p className="text-secondaryText text-sm">Join the next generation of library management</p>
                    </div>

                    {/* Error Toast */}
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center flex items-center justify-center gap-2"
                            >
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                        
                        {/* Role Toggle */}
                        <div className="p-1 bg-black/40 border border-white/10 rounded-2xl flex gap-1 mb-6">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    role === 'student' 
                                    ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                                    : 'text-secondaryText hover:text-primaryText hover:bg-white/5'
                                }`}
                            >
                                <GraduationCap className="w-4 h-4" />
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    role === 'admin' 
                                    ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                                    : 'text-secondaryText hover:text-primaryText hover:bg-white/5'
                                }`}
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Admin
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-secondaryText ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-secondaryText/50" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 text-primaryText text-sm rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent block pl-11 p-3.5 transition-all outline-none"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-secondaryText ml-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-secondaryText/50" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 text-primaryText text-sm rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent block pl-11 p-3.5 transition-all outline-none"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-secondaryText ml-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-secondaryText/50" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 text-primaryText text-sm rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent block pl-11 pr-11 p-3.5 transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondaryText hover:text-primaryText transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-secondaryText ml-1">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-secondaryText/50" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 text-primaryText text-sm rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent block pl-11 p-3.5 transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent/90 text-white font-medium rounded-xl text-sm px-5 py-3.5 text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-accent/20 mt-4"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center relative z-10">
                        <p className="text-sm text-secondaryText">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-accent hover:text-accent/80 hover:underline transition-all">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
