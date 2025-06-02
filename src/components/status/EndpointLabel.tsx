
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EndpointType } from '@/data/mockData';

interface EndpointLabelProps {
  type: EndpointType;
  className?: string;
}

export const EndpointLabel: React.FC<EndpointLabelProps> = ({ type, className }) => {
  const getLabel = (type: EndpointType) => {
    switch (type) {
      case 'STDIO':
        return 'STDIO';
      case 'HTTP_SSE':
        return 'SSE';
      case 'WS':
        return 'WebSocket';
      default:
        return type;
    }
  };

  const getVariant = (type: EndpointType) => {
    switch (type) {
      case 'STDIO':
        return 'default';
      case 'HTTP_SSE':
        return 'secondary';
      case 'WS':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getVariant(type)} className={className}>
      {getLabel(type)}
    </Badge>
  );
};
