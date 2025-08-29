"use client";
import React, { useState, useEffect } from 'react';
import {
    FileText,
    Clock,
    Download,
    User,
    Calendar,
    MapPin,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
    Menu,
    X
} from 'lucide-react';

// Interfaces para TypeScript
interface MenuItem {
    id: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    color: string;
}

interface FormData {
    cedula_solicitante: string;
    nombre_solicitante: string;
    apellidos_solicitante: string;
    telefono_solicitante: string;
    email_solicitante: string;
    cedula_persona: string;
    nombre_persona: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    fecha_nacimiento: string;
    hora_nacimiento: string;
    lugar_nacimiento: string;
    provincia_nacimiento: string;
    distrito_nacimiento: string;
    corregimiento_nacimiento: string;
    nombre_padre: string;
    apellidos_padre: string;
    cedula_padre: string;
    nacionalidad_padre: string;
    nombre_madre: string;
    apellidos_madre: string;
    cedula_madre: string;
    nacionalidad_madre: string;
    sexo: string;
    nacionalidad: string;
    estado_civil_padres: string;
    numero_partida: string;
    folio: string;
    libro: string;
    motivo_solicitud: string;
}

interface Solicitud {
    id: number;
    numero: string;
    persona: string;
    fecha_solicitud: string;
    estado: 'en_proceso' | 'aprobado' | 'rechazado';
    observaciones: string;
    datos_completos: FormData;
}

interface Certificado {
    id: number;
    numero: string;
    persona: string;
    fecha_expedicion: string;
    disponible: boolean;
    datos_completos?: FormData;
}

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isMobile: boolean;
    isOpen: boolean;
    toggleSidebar: () => void;
}

interface SolicitudFormProps {
    onSubmit: (solicitud: Solicitud) => void;
}

interface EstadoSolicitudesProps {
    solicitudes: Solicitud[];
}

interface DescargarPDFProps {
    certificados: Certificado[];
}

// Componente del Sidebar
const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobile, isOpen, toggleSidebar }) => {
    const menuItems: MenuItem[] = [
        { id: 'solicitar', icon: FileText, label: 'Nueva Solicitud', color: 'text-blue-600' },
        { id: 'estado', icon: Clock, label: 'Estado Solicitudes', color: 'text-yellow-600' },
        { id: 'descargar', icon: Download, label: 'Descargar PDF', color: 'text-green-600' }
    ];

    return (
        <>
            {/* Overlay para móvil */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`
                ${isMobile ? 'fixed' : 'sticky'} 
                ${isMobile ? 'top-0 left-0' : 'top-0'}
                ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
                transition-transform duration-300 ease-in-out
                w-64 h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white shadow-xl 
                ${isMobile ? 'z-50' : 'z-10'}
            `}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                            DocuTrack
                        </h2>
                        {isMobile && (
                            <button onClick={toggleSidebar} className="text-white hover:text-purple-200">
                                <X size={24} />
                            </button>
                        )}
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        if (isMobile) toggleSidebar();
                                    }}
                                    className={`
                                        w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                                        ${activeTab === item.id
                                            ? 'bg-white/20 shadow-lg transform scale-105'
                                            : 'hover:bg-white/10'
                                        }
                                    `}
                                >
                                    <Icon size={20} className={activeTab === item.id ? 'text-white' : item.color} />
                                    <span className="font-medium text-white">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
};

// Formulario de Solicitud
const SolicitudForm: React.FC<SolicitudFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<FormData>({
        // Datos del solicitante
        cedula_solicitante: '',
        nombre_solicitante: '',
        apellidos_solicitante: '',
        telefono_solicitante: '',
        email_solicitante: '',

        // Datos de la persona del certificado
        cedula_persona: '',
        nombre_persona: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        fecha_nacimiento: '',
        hora_nacimiento: '',
        lugar_nacimiento: '',
        provincia_nacimiento: '',
        distrito_nacimiento: '',
        corregimiento_nacimiento: '',

        // Datos de los padres
        nombre_padre: '',
        apellidos_padre: '',
        cedula_padre: '',
        nacionalidad_padre: '',
        nombre_madre: '',
        apellidos_madre: '',
        cedula_madre: '',
        nacionalidad_madre: '',

        // Otros datos
        sexo: '',
        nacionalidad: '',
        estado_civil_padres: '',
        numero_partida: '',
        folio: '',
        libro: '',
        motivo_solicitud: 'Primera vez'
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Crear nueva solicitud
        const nuevaSolicitud: Solicitud = {
            id: Date.now(),
            numero: `SOL-${String(Date.now()).slice(-6)}-2024`,
            persona: `${formData.nombre_persona} ${formData.primer_apellido} ${formData.segundo_apellido}`.trim(),
            fecha_solicitud: new Date().toISOString().split('T')[0],
            estado: 'en_proceso',
            observaciones: 'Solicitud recibida, en proceso de revisión',
            datos_completos: formData
        };

        // Llamar a la función onSubmit del componente padre
        onSubmit(nuevaSolicitud);

        // Limpiar formulario
        setFormData({
            cedula_solicitante: '',
            nombre_solicitante: '',
            apellidos_solicitante: '',
            telefono_solicitante: '',
            email_solicitante: '',
            cedula_persona: '',
            nombre_persona: '',
            segundo_nombre: '',
            primer_apellido: '',
            segundo_apellido: '',
            fecha_nacimiento: '',
            hora_nacimiento: '',
            lugar_nacimiento: '',
            provincia_nacimiento: '',
            distrito_nacimiento: '',
            corregimiento_nacimiento: '',
            nombre_padre: '',
            apellidos_padre: '',
            cedula_padre: '',
            nacionalidad_padre: '',
            nombre_madre: '',
            apellidos_madre: '',
            cedula_madre: '',
            nacionalidad_madre: '',
            sexo: '',
            nacionalidad: '',
            estado_civil_padres: '',
            numero_partida: '',
            folio: '',
            libro: '',
            motivo_solicitud: 'Primera vez'
        });

        alert('Solicitud enviada correctamente. Puedes verificar el estado en la pestaña "Estado Solicitudes".');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <FileText className="mr-3" />
                        Nueva Solicitud de Certificado de Nacimiento
                    </h2>
                    <p className="text-blue-100 mt-2">Complete todos los campos requeridos</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Datos del Solicitante */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <User className="mr-2 text-blue-600" />
                            Datos del Solicitante
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="cedula_solicitante"
                                placeholder="Cédula del solicitante *"
                                value={formData.cedula_solicitante}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                required
                            />
                            <input
                                type="text"
                                name="nombre_solicitante"
                                placeholder="Nombres completos *"
                                value={formData.nombre_solicitante}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                required
                            />
                            <input
                                type="text"
                                name="apellidos_solicitante"
                                placeholder="Apellidos completos *"
                                value={formData.apellidos_solicitante}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                required
                            />
                            <input
                                type="tel"
                                name="telefono_solicitante"
                                placeholder="Teléfono"
                                value={formData.telefono_solicitante}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            />
                            <input
                                type="email"
                                name="email_solicitante"
                                placeholder="Correo electrónico *"
                                value={formData.email_solicitante}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2 text-gray-900 placeholder-gray-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Datos de la Persona */}
                    <div className="bg-purple-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FileText className="mr-2 text-purple-600" />
                            Datos de la Persona (Certificado)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                name="cedula_persona"
                                placeholder="Cédula (si tiene)"
                                value={formData.cedula_persona}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            />
                            <input
                                type="text"
                                name="nombre_persona"
                                placeholder="Primer nombre *"
                                value={formData.nombre_persona}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                required
                            />
                            <input
                                type="text"
                                name="segundo_nombre"
                                placeholder="Segundo nombre"
                                value={formData.segundo_nombre}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            />
                            <input
                                type="text"
                                name="primer_apellido"
                                placeholder="Primer apellido *"
                                value={formData.primer_apellido}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                required
                            />
                            <input
                                type="text"
                                name="segundo_apellido"
                                placeholder="Segundo apellido"
                                value={formData.segundo_apellido}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            />
                            <select
                                name="sexo"
                                value={formData.sexo}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                                required
                            >
                                <option value="" className="text-gray-500">Seleccionar sexo *</option>
                                <option value="M" className="text-gray-900">Masculino</option>
                                <option value="F" className="text-gray-900">Femenino</option>
                            </select>
                        </div>
                    </div>

                    {/* Datos de Nacimiento */}
                    <div className="bg-green-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Calendar className="mr-2 text-green-600" />
                            Información de Nacimiento
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <input
                                type="date"
                                name="fecha_nacimiento"
                                value={formData.fecha_nacimiento}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                                required
                            />
                            <input
                                type="time"
                                name="hora_nacimiento"
                                value={formData.hora_nacimiento}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                            />
                            <input
                                type="text"
                                name="lugar_nacimiento"
                                placeholder="Hospital/Lugar *"
                                value={formData.lugar_nacimiento}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                required
                            />
                            <input
                                type="text"
                                name="provincia_nacimiento"
                                placeholder="Provincia *"
                                value={formData.provincia_nacimiento}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                required
                            />
                            <input
                                type="text"
                                name="distrito_nacimiento"
                                placeholder="Distrito *"
                                value={formData.distrito_nacimiento}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                required
                            />
                            <input
                                type="text"
                                name="corregimiento_nacimiento"
                                placeholder="Corregimiento"
                                value={formData.corregimiento_nacimiento}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Datos de los Padres */}
                    <div className="bg-yellow-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Users className="mr-2 text-yellow-600" />
                            Datos de los Padres
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Padre */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700">Información del Padre</h4>
                                <input
                                    type="text"
                                    name="nombre_padre"
                                    placeholder="Nombres del padre"
                                    value={formData.nombre_padre}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                />
                                <input
                                    type="text"
                                    name="apellidos_padre"
                                    placeholder="Apellidos del padre"
                                    value={formData.apellidos_padre}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                />
                                <input
                                    type="text"
                                    name="cedula_padre"
                                    placeholder="Cédula del padre"
                                    value={formData.cedula_padre}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                />
                                <input
                                    type="text"
                                    name="nacionalidad_padre"
                                    placeholder="Nacionalidad del padre"
                                    value={formData.nacionalidad_padre}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                />
                            </div>

                            {/* Madre */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700">Información de la Madre</h4>
                                <input
                                    type="text"
                                    name="nombre_madre"
                                    placeholder="Nombres de la madre"
                                    value={formData.nombre_madre}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                />
                                <input
                                    type="text"
                                    name="apellidos_madre"
                                    placeholder="Apellidos de la madre"
                                    value={formData.apellidos_madre}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                />
                                <input
                                    type="text"
                                    name="cedula_madre"
                                    placeholder="Cédula de la madre"
                                    value={formData.cedula_madre}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                />
                                <input
                                    type="text"
                                    name="nacionalidad_madre"
                                    placeholder="Nacionalidad de la madre"
                                    value={formData.nacionalidad_madre}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Información Adicional */}
                    <div className="bg-indigo-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Adicional</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                name="motivo_solicitud"
                                value={formData.motivo_solicitud}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="Primera vez" className="text-gray-900">Primera vez</option>
                                <option value="Reemplazo" className="text-gray-900">Reemplazo (pérdida/daño)</option>
                                <option value="Corrección" className="text-gray-900">Corrección de datos</option>
                            </select>
                            <input
                                type="text"
                                name="nacionalidad"
                                placeholder="Nacionalidad"
                                value={formData.nacionalidad}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                            Enviar Solicitud
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Estado de Solicitudes
const EstadoSolicitudes: React.FC<EstadoSolicitudesProps> = ({ solicitudes }) => {
    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'aprobado': return 'bg-green-100 text-green-800 border-green-200';
            case 'en_proceso': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rechazado': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getEstadoIcon = (estado: string) => {
        switch (estado) {
            case 'aprobado': return <CheckCircle className="w-5 h-5" />;
            case 'en_proceso': return <AlertCircle className="w-5 h-5" />;
            case 'rechazado': return <XCircle className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <Clock className="mr-3" />
                        Estado de mis Solicitudes
                    </h2>
                    <p className="text-yellow-100 mt-2">Seguimiento en tiempo real de tus solicitudes</p>
                </div>

                <div className="p-6">
                    {solicitudes.length === 0 ? (
                        <div className="text-center py-12">
                            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
                            <p className="text-gray-500">Aún no has creado ninguna solicitud de certificado.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {solicitudes.map((solicitud) => (
                                <div key={solicitud.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <h3 className="text-lg font-semibold text-gray-800">{solicitud.numero}</h3>
                                                <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium border flex items-center ${getEstadoColor(solicitud.estado)}`}>
                                                    {getEstadoIcon(solicitud.estado)}
                                                    <span className="ml-1 capitalize">{solicitud.estado.replace('_', ' ')}</span>
                                                </span>
                                            </div>
                                            <p className="text-gray-600 font-medium">{solicitud.persona}</p>
                                            <p className="text-gray-500 text-sm">Fecha de solicitud: {solicitud.fecha_solicitud}</p>
                                            <p className="text-gray-600 mt-2">{solicitud.observaciones}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Página de Descarga
const DescargarPDF: React.FC<DescargarPDFProps> = ({ certificados }) => {
    const handleDescargar = async (certificado: Certificado) => {
        try {
            // Generar contenido HTML estructurado para convertir a PDF
            const generateHTMLContent = () => {
                const datos = certificado.datos_completos;
                
                const nombreCompleto = [
                    datos?.nombre_persona,
                    datos?.segundo_nombre,
                    datos?.primer_apellido,
                    datos?.segundo_apellido
                ].filter(Boolean).join(' ');

                const fechaFormateada = datos?.fecha_nacimiento ? 
                    new Date(datos.fecha_nacimiento).toLocaleDateString('es-PA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }) : 'N/A';

                const ubicacion = [
                    datos?.corregimiento_nacimiento,
                    datos?.distrito_nacimiento,
                    datos?.provincia_nacimiento
                ].filter(Boolean).join(', ');

                const nombrePadre = [datos?.nombre_padre, datos?.apellidos_padre].filter(Boolean).join(' ');
                const nombreMadre = [datos?.nombre_madre, datos?.apellidos_madre].filter(Boolean).join(' ');

                return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Certificado de Nacimiento</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            color: #000;
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin: 5px 0;
        }
        .subtitle {
            font-size: 20px;
            font-weight: bold;
            margin: 5px 0;
        }
        .document-type {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
        }
        .certificate-info {
            margin: 20px 0;
            padding: 15px;
            background-color: #f5f5f5;
        }
        .section {
            margin: 25px 0;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        .field {
            margin: 8px 0;
            display: flex;
        }
        .field-label {
            font-weight: bold;
            min-width: 150px;
            margin-right: 10px;
        }
        .field-value {
            flex: 1;
        }
        .parent-info {
            margin-left: 20px;
            margin-top: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #000;
            font-style: italic;
        }
        .generated-date {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">REPÚBLICA DE PANAMÁ</div>
        <div class="subtitle">TRIBUNAL ELECTORAL</div>
        <div class="document-type">CERTIFICADO DE NACIMIENTO</div>
    </div>

    <div class="certificate-info">
        <div class="field">
            <span class="field-label">Número de Certificado:</span>
            <span class="field-value">${certificado.numero}</span>
        </div>
        <div class="field">
            <span class="field-label">Fecha de Expedición:</span>
            <span class="field-value">${certificado.fecha_expedicion}</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">DATOS DE LA PERSONA</div>
        ${nombreCompleto ? `<div class="field"><span class="field-label">Nombre completo:</span><span class="field-value">${nombreCompleto}</span></div>` : ''}
        ${datos?.cedula_persona ? `<div class="field"><span class="field-label">Cédula de identidad:</span><span class="field-value">${datos.cedula_persona}</span></div>` : ''}
        ${datos?.fecha_nacimiento ? `<div class="field"><span class="field-label">Fecha de nacimiento:</span><span class="field-value">${fechaFormateada}</span></div>` : ''}
        ${datos?.hora_nacimiento ? `<div class="field"><span class="field-label">Hora de nacimiento:</span><span class="field-value">${datos.hora_nacimiento}</span></div>` : ''}
        ${datos?.sexo ? `<div class="field"><span class="field-label">Sexo:</span><span class="field-value">${datos.sexo === 'M' ? 'Masculino' : 'Femenino'}</span></div>` : ''}
        ${datos?.nacionalidad ? `<div class="field"><span class="field-label">Nacionalidad:</span><span class="field-value">${datos.nacionalidad}</span></div>` : ''}
    </div>

    <div class="section">
        <div class="section-title">LUGAR DE NACIMIENTO</div>
        ${datos?.lugar_nacimiento ? `<div class="field"><span class="field-label">Hospital/Institución:</span><span class="field-value">${datos.lugar_nacimiento}</span></div>` : ''}
        ${ubicacion ? `<div class="field"><span class="field-label">Ubicación:</span><span class="field-value">${ubicacion}</span></div>` : ''}
    </div>

    <div class="section">
        <div class="section-title">DATOS DE LOS PADRES</div>
        
        ${nombrePadre ? `
        <div class="field">
            <span class="field-label">Padre:</span>
            <span class="field-value">${nombrePadre}</span>
        </div>
        <div class="parent-info">
            ${datos?.cedula_padre ? `<div class="field"><span class="field-label">Cédula:</span><span class="field-value">${datos.cedula_padre}</span></div>` : ''}
            ${datos?.nacionalidad_padre ? `<div class="field"><span class="field-label">Nacionalidad:</span><span class="field-value">${datos.nacionalidad_padre}</span></div>` : ''}
        </div>` : ''}
        
        ${nombreMadre ? `
        <div class="field">
            <span class="field-label">Madre:</span>
            <span class="field-value">${nombreMadre}</span>
        </div>
        <div class="parent-info">
            ${datos?.cedula_madre ? `<div class="field"><span class="field-label">Cédula:</span><span class="field-value">${datos.cedula_madre}</span></div>` : ''}
            ${datos?.nacionalidad_madre ? `<div class="field"><span class="field-label">Nacionalidad:</span><span class="field-value">${datos.nacionalidad_madre}</span></div>` : ''}
        </div>` : ''}
    </div>

    <div class="footer">
        <p><strong>Este certificado es válido para todos los efectos legales.</strong></p>
        <div class="generated-date">
            Documento generado el ${new Date().toLocaleDateString('es-PA')}
        </div>
    </div>
</body>
</html>`;
            };

            // Generar el contenido HTML
            const htmlContent = generateHTMLContent();

            // Crear un blob con el contenido HTML
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            // Crear enlace de descarga
            const link = document.createElement('a');
            link.href = url;
            link.download = `Certificado_Nacimiento_${certificado.numero}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Mostrar instrucciones al usuario
            const instrucciones = `
Certificado descargado como archivo HTML.

Para convertir a PDF:
1. Abre el archivo descargado en tu navegador
2. Presiona Ctrl+P (o Cmd+P en Mac)
3. Selecciona "Guardar como PDF" como destino
4. Ajusta los márgenes si es necesario
5. Haz clic en "Guardar"

El documento se verá perfectamente formateado como un certificado oficial.
            `;

            alert(instrucciones);
            
        } catch (error) {
            console.error('Error al generar certificado:', error);
            alert('Error al generar el certificado. Por favor intenta nuevamente.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <Download className="mr-3" />
                        Descargar Certificados
                    </h2>
                    <p className="text-green-100 mt-2">Certificados aprobados listos para descarga</p>
                </div>

                <div className="p-6">
                    {certificados.length === 0 ? (
                        <div className="text-center py-12">
                            <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay certificados disponibles</h3>
                            <p className="text-gray-500">Los certificados aparecerán aquí una vez que sean aprobados por el administrador.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {certificados.map((certificado) => (
                                <div key={certificado.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <FileText className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="font-semibold text-gray-800">{certificado.numero}</h3>
                                            <p className="text-gray-600">{certificado.persona}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm text-gray-500">
                                            <Calendar className="w-4 h-4 inline mr-2" />
                                            Expedido: {certificado.fecha_expedicion}
                                        </p>
                                        <p className="text-sm text-green-600 font-medium">
                                            <CheckCircle className="w-4 h-4 inline mr-2" />
                                            Disponible para descarga
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleDescargar(certificado)}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transform transition-all duration-200 hover:scale-105 shadow-md flex items-center justify-center"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Descargar PDF
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Componente Principal del Dashboard
const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('solicitar');
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleNuevaSolicitud = (nuevaSolicitud: Solicitud) => {
        setSolicitudes(prev => [...prev, nuevaSolicitud]);
        setActiveTab('estado'); // Cambiar automáticamente a la pestaña de estado
    };

    const handleAprobarSolicitud = (solicitudId: number) => {
        setSolicitudes(prev => 
            prev.map(sol => 
                sol.id === solicitudId 
                    ? { ...sol, estado: 'aprobado' as const, observaciones: 'Solicitud aprobada - Certificado listo para descarga' }
                    : sol
            )
        );
    };

    // Filtrar certificados aprobados para la página de descarga
    const certificadosAprobados: Certificado[] = solicitudes
        .filter(sol => sol.estado === 'aprobado')
        .map(sol => ({
            id: sol.id,
            numero: sol.numero.replace('SOL-', 'CN-'),
            persona: sol.persona,
            fecha_expedicion: new Date().toISOString().split('T')[0],
            disponible: true,
            datos_completos: sol.datos_completos
        }));

    const renderContent = () => {
        switch (activeTab) {
            case 'solicitar': 
                return <SolicitudForm onSubmit={handleNuevaSolicitud} />;
            case 'estado': 
                return <EstadoSolicitudes solicitudes={solicitudes} />;
            case 'descargar': 
                return <DescargarPDF certificados={certificadosAprobados} />;
            default: 
                return <SolicitudForm onSubmit={handleNuevaSolicitud} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex h-screen">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isMobile={isMobile}
                    isOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                />

                <div className={`flex-1 flex flex-col ${isMobile ? 'w-full' : 'ml-0'}`}>
                    {/* Header móvil */}
                    {isMobile && (
                        <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
                            <button onClick={toggleSidebar} className="text-gray-600 hover:text-indigo-600">
                                <Menu size={24} />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                            {/* Botón simulado de admin para demostración */}
                            <button
                                onClick={() => {
                                    const solicitudEnProceso = solicitudes.find(s => s.estado === 'en_proceso');
                                    if (solicitudEnProceso) {
                                        handleAprobarSolicitud(solicitudEnProceso.id);
                                        alert('Solicitud aprobada por el administrador!');
                                    } else {
                                        alert('No hay solicitudes en proceso para aprobar');
                                    }
                                }}
                                className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                            >
                                Admin: Aprobar
                            </button>
                        </header>
                    )}

                    {/* Header desktop con botón de admin */}
                    {!isMobile && (
                        <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
                            <h1 className="text-xl font-semibold text-gray-800">
                                {activeTab === 'solicitar' && 'Nueva Solicitud'}
                                {activeTab === 'estado' && 'Estado de Solicitudes'}
                                {activeTab === 'descargar' && 'Descargar Certificados'}
                            </h1>
                            {/* Botón simulado de admin para demostración */}
                            <button
                                onClick={() => {
                                    const solicitudEnProceso = solicitudes.find(s => s.estado === 'en_proceso');
                                    if (solicitudEnProceso) {
                                        handleAprobarSolicitud(solicitudEnProceso.id);
                                        alert('Solicitud aprobada por el administrador!');
                                    } else {
                                        alert('No hay solicitudes en proceso para aprobar');
                                    }
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                🔧 Admin: Aprobar Solicitud
                            </button>
                        </header>
                    )}

                    {/* Contenido principal */}
                    <main className="flex-1 overflow-y-auto bg-gray-50 p-0">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;