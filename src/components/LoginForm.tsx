'use client';

import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, User, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

import { useRouter } from 'next/navigation';

interface FormData {
    email: string;
    password: string;
    remember: boolean;
}

const LoginForm: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        remember: false
    });

    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Limpiar errores cuando el usuario empiece a escribir
        if (errors.length > 0) {
            setErrors([]);
        }
        if (error) {
            setError(null);
        }
    }, [errors.length, error]);

    const validateForm = (): string[] => {
        const newErrors: string[] = [];

        if (!formData.email.trim()) {
            newErrors.push('El email es requerido');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.push('Email inválido');
        }

        if (!formData.password) {
            newErrors.push('La contraseña es requerida');
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setErrors([]);

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Error al iniciar sesión');
                return;
            }

            console.log('✅ Usuario logueado:', data);
            alert('Login exitoso! (En producción redirigiría al dashboard)');
            
        } catch (err) {
            console.error(err);
            setError('Error de conexión con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-20 sm:top-40 left-1/2 w-40 h-40 sm:w-80 sm:h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-sm sm:max-w-md">
                {/* Glassmorphism Card */}
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 transform transition-all duration-300 hover:scale-[1.02]">

                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-3 sm:mb-4 shadow-lg">
                            <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Bienvenido</h1>
                        <p className="text-white/70 text-xs sm:text-sm">Inicia sesión en tu cuenta</p>
                    </div>

                    {/* Error Messages */}
                    {(errors.length > 0 || error) && (
                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                            <div className="flex items-start space-x-2">
                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-300 mt-0.5 flex-shrink-0" />
                                <div className="text-red-300 text-xs sm:text-sm space-y-1">
                                    {error && <div>{error}</div>}
                                    {errors.length > 0 && (
                                        <ul className="space-y-1">
                                            {errors.map((err, index) => (
                                                <li key={index}>{err}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-white/90 text-sm font-medium">
                                Correo electrónico
                            </label>
                            <div className="relative group transform transition-transform duration-200 focus-within:scale-[1.02]">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 text-sm sm:text-base"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-white/90 text-sm font-medium">
                                Contraseña
                            </label>
                            <div className="relative group transform transition-transform duration-200 focus-within:scale-[1.02]">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 text-sm sm:text-base"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/70 transition-colors"
                                >
                                    {showPassword ? 
                                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center text-xs sm:text-sm">
                            <label className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleInputChange}
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-white/20 bg-white/10 text-purple-400 focus:ring-purple-400/50 focus:ring-2"
                                />
                                <span>Recordarme</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            <span className="flex items-center justify-center space-x-2">
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                                        <span>Iniciando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Iniciar Sesión</span>
                                        <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </>
                                )}
                            </span>
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="text-center mt-6 sm:mt-8">
                        <p className="text-white/70 text-xs sm:text-sm">
                            ¿No tienes cuenta?{' '}
        <button
            type="button"
            onClick={() => router.push('/register')} // 🎯 Aquí está el cambio
            className="text-purple-300 hover:text-purple-200 font-semibold transition-colors"
        >
            Regístrate aquí
        </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;