'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
interface FormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
}

interface Errors {
    [key: string]: string | undefined;
}

const RegisterForm: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false
    });

    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [passwordMatch, setPasswordMatch] = useState<boolean>(true);

    // Validación en tiempo real de contraseñas
    useEffect(() => {
        if (formData.password_confirmation) {
            setPasswordMatch(formData.password === formData.password_confirmation);
        }
    }, [formData.password, formData.password_confirmation]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Limpiar errores cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
        if (error) {
            setError(null);
        }
    }, [errors, error]);

    const validateForm = (): Errors => {
        const newErrors: Errors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Las contraseñas no coinciden';
        }

        if (!formData.terms) {
            newErrors.terms = 'Debes aceptar los términos y condiciones';
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setErrors({});

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Error al registrarse');
                return;
            }

            console.log('✅ Usuario registrado:', data);
            alert('Usuario registrado exitosamente');
            
        } catch (err) {
            console.error(err);
            setError('Error de conexión con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-md">
                {/* Glassmorphism Card */}
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all duration-300 hover:scale-[1.02]">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-4 shadow-lg">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
                        <p className="text-white/70 text-sm">Únete a nuestra plataforma</p>
                    </div>

                    {/* Error Messages */}
                    {(Object.keys(errors).length > 0 || error) && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                            <div className="flex items-start space-x-2">
                                <AlertCircle className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
                                <div className="text-red-300 text-sm space-y-1">
                                    {error && <div>{error}</div>}
                                    {Object.values(errors).filter(Boolean).map((err, index) => (
                                        <div key={index}>{err}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Register Form */}
                    <div className="space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-white/90 text-sm font-medium">
                                Nombre
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 ${
                                        errors.name ? 'border-red-400' : 'border-white/20'
                                    }`}
                                    placeholder="Tu nombre completo"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-white/90 text-sm font-medium">
                                Correo electrónico
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 ${
                                        errors.email ? 'border-red-400' : 'border-white/20'
                                    }`}
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-white/90 text-sm font-medium">
                                Contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 ${
                                        errors.password ? 'border-red-400' : 'border-white/20'
                                    }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/70 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Confirmation Input */}
                        <div className="space-y-2">
                            <label htmlFor="password_confirmation" className="block text-white/90 text-sm font-medium">
                                Confirmar Contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type={showPasswordConfirm ? "text" : "password"}
                                    name="password_confirmation"
                                    id="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 ${
                                        errors.password_confirmation || (!passwordMatch && formData.password_confirmation)
                                            ? 'border-red-400'
                                            : 'border-white/20'
                                    }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/70 transition-colors"
                                >
                                    {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {!passwordMatch && formData.password_confirmation && !errors.password_confirmation && (
                                <p className="text-red-300 text-xs flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Las contraseñas no coinciden
                                </p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="space-y-2">
                            <div className="flex items-start space-x-3 text-sm">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="terms"
                                    checked={formData.terms}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/10 text-purple-400 focus:ring-purple-400/50 focus:ring-2"
                                />
                                <label htmlFor="terms" className="text-white/70 leading-5">
                                    Acepto los{' '}
                                    <button
                                        type="button"
                                        onClick={() => alert('Términos y condiciones')}
                                        className="text-purple-300 hover:text-purple-200 transition-colors underline"
                                    >
                                        términos y condiciones
                                    </button>{' '}
                                    y la{' '}
                                    <button
                                        type="button"
                                        onClick={() => alert('Política de privacidad')}
                                        className="text-purple-300 hover:text-purple-200 transition-colors underline"
                                    >
                                        política de privacidad
                                    </button>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 disabled:cursor-not-allowed"
                        >
                            <span className="flex items-center justify-center space-x-2">
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Registrando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Registrar</span>
                                        <UserPlus className="w-5 h-5" />
                                    </>
                                )}
                            </span>
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className="text-center mt-8">
                        <p className="text-white/70 text-sm">
                            ¿Ya tienes cuenta?{' '}
            <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-purple-300 hover:text-purple-200 font-semibold transition-colors"
        >
            Ya tienes cuenta? Inicia sesión
        </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;