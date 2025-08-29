interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    className?: string;
    variant?: 'primary' | 'secondary';
}

export default function Button({
    children,
    onClick,
    type = 'button',
    className = '',
    variant = 'primary'
}: ButtonProps) {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}