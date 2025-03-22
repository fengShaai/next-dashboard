import React from 'react';

interface HeadingProps {
  title: string;
  description?: string; // Optional prop
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="mb-2">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && <p className="text-gray-600 mt-2">{description}</p>}
    </div>
  );
};

export default Heading;
