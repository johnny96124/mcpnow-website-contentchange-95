
import React from 'react';

interface EndpointLabelProps {
  type: 'HTTP' | 'STDIO' | 'OFFICIAL';
}

export const EndpointLabel: React.FC<EndpointLabelProps> = ({ type }) => {
  const getClassNames = () => {
    const baseClasses = 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium';
    
    switch (type) {
      case 'HTTP':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case 'STDIO':
        return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`;
      case 'OFFICIAL':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300`;
    }
  };

  return (
    <div className={getClassNames()}>
      {type}
    </div>
  );
};
