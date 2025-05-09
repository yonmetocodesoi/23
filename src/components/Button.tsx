import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  primary = true, 
  onClick, 
  type = 'button',
  className = '',
  disabled = false
}) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 shadow-lg";
  
  const primaryClasses = "bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:from-indigo-700 hover:to-purple-800 focus:ring-indigo-500";
  
  const secondaryClasses = "bg-gray-800 bg-opacity-50 text-white border border-indigo-400 hover:bg-gray-700 hover:bg-opacity-70 focus:ring-gray-500";
  
  const disabledClasses = "opacity-50 cursor-not-allowed transform-none hover:scale-100";
  
  const buttonClasses = `
    ${baseClasses} 
    ${primary ? primaryClasses : secondaryClasses}
    ${disabled ? disabledClasses : ''}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;