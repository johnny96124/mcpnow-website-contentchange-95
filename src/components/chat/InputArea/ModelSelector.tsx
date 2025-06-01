
import React, { useState } from 'react';
import { ChevronDown, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Model {
  id: string;
  name: string;
  icon: string;
}

const availableModels: Model[] = [
  { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', icon: '🌟' },
  { id: 'claude-4-opus', name: 'Claude 4 Opus', icon: '🌟' },
  { id: 'gpt-4o', name: 'GPT-4o', icon: '🧠' },
  { id: 'gpt-4.1', name: 'GPT-4.1', icon: '🧠' },
  { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', icon: '🌟' },
  { id: 'claude-3.5-sonnet-v2', name: 'Claude 3.5 Sonnet V2', icon: '🌟' },
  { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', icon: '🔗' },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
}) => {
  const currentModel = availableModels.find(model => model.id === selectedModel) || availableModels[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 px-2 gap-2 text-sm">
          <span className="text-base">{currentModel.icon}</span>
          <span className="font-medium">{currentModel.name}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {availableModels.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelChange(model.id)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-base">{model.icon}</span>
            <span>{model.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
