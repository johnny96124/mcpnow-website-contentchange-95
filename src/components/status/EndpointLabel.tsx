
import React from 'react';
import { EndpointType } from '@/data/mockData';

interface EndpointLabelProps {
  type: EndpointType;
}

export const EndpointLabel: React.FC<EndpointLabelProps> = ({ type }) => {
  const getDisplayType = (type: EndpointType) => {
    switch (type) {
      case 'HTTP_SSE':
        return 'HTTP';
      case 'STDIO':
        return 'STDIO';
      case 'WS':
        return 'WS';
      default:
        return type;
    }
  };

  const getClassNames = () => {
    const baseClasses = 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium';
    
    switch (type) {
      case 'HTTP_SSE':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case 'STDIO':
        return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`;
      case 'WS':
        return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300`;
    }
  };

  return (
    <div className={getClassNames()}>
      {getDisplayType(type)}
    </div>
  );
};
