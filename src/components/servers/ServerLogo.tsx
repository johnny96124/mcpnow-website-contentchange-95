
import React from 'react';
import { ServerDefinition } from '@/data/mockData';

const DEFAULT_LOGOS: { [key: string]: string } = {
  'MySQL': 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=300&q=80',
  'MongoDB': 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=300&q=80',
  'PostgreSQL': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300&q=80',
  'Redis': 'https://images.unsplash.com/photo-1555952494-efd681c7e3f9?w=300&q=80',
  'API': 'https://images.unsplash.com/photo-1557853197-aefb550b6fdc?w=300&q=80',
  'Default': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&q=80',
};

export const getServerLogo = (serverName: string): string => {
  for (const [key, value] of Object.entries(DEFAULT_LOGOS)) {
    if (serverName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return DEFAULT_LOGOS.Default;
};

interface ServerLogoProps {
  server: ServerDefinition;
  className?: string;
}

export const ServerLogo: React.FC<ServerLogoProps> = ({ server, className }) => {
  return (
    <div 
      className={`absolute top-4 right-4 w-12 h-12 rounded-lg overflow-hidden opacity-70 transition-opacity ${className}`}
    >
      <img
        src={getServerLogo(server.name)}
        alt={`${server.name} logo`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ServerLogo;
