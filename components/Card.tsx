import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const hoverStyle = hover ? 'hover:shadow-2xl hover:scale-[1.02] transition-all duration-300' : '';
  
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${hoverStyle} ${className}`}>
      {children}
    </div>
  );
}
