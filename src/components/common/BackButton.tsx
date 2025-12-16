
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    label?: string;
    to?: string;
    className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ label = 'Back', to, className = '' }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`inline-flex items-center space-x-2 text-stone-600 hover:text-forest-600 transition-colors px-4 py-2 rounded-full hover:bg-stone-100 ${className}`}
        >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </button>
    );
};

export default BackButton;
