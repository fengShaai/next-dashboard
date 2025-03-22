import React from 'react';

interface SeparatorProps {
  className?: string; // Optional custom styling
}

const Separator: React.FC<SeparatorProps> = ({ className }) => {
  return <hr className={`border-t border-gray-300 ${className}`} />;
};

export default Separator;
