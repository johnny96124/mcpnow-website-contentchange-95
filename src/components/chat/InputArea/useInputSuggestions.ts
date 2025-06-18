
import { useState, useEffect, useMemo } from 'react';
import { PromptTemplate, ResourceItem, InputSuggestion } from './types';
import { promptTemplates } from './promptTemplates';

interface UseInputSuggestionsProps {
  inputValue: string;
  cursorPosition: number;
  servers: any[];
  profiles: any[];
  hosts: any[];
}

export const useInputSuggestions = ({
  inputValue,
  cursorPosition,
  servers,
  profiles,
  hosts
}: UseInputSuggestionsProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<InputSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [triggerInfo, setTriggerInfo] = useState<{
    type: 'template' | 'resource' | null;
    startPos: number;
    query: string;
  }>({ type: null, startPos: -1, query: '' });

  const resourceItems = useMemo(() => {
    const items: ResourceItem[] = [];
    
    // Add profiles
    profiles.forEach(profile => {
      items.push({
        id: profile.id,
        name: profile.name,
        type: 'Profile',
        description: `Profile with ${profile.serverInstances?.length || 0} servers`,
        icon: 'FolderOpen'
      });
    });

    // Add servers
    servers.forEach(server => {
      items.push({
        id: server.id,
        name: server.name,
        type: 'Server',
        status: server.status === 'running' ? 'active' : 'inactive',
        description: server.url || server.command,
        icon: 'Server'
      });
    });

    // Add hosts
    hosts.forEach(host => {
      items.push({
        id: host.id,
        name: host.name,
        type: 'Host',
        status: host.connectionStatus,
        description: host.url,
        icon: 'Monitor'
      });
    });

    // Add common settings
    items.push(
      {
        id: 'ai-settings',
        name: 'AI Settings',
        type: 'Setting',
        description: 'AI model and behavior settings',
        icon: 'Bot'
      },
      {
        id: 'app-settings',
        name: 'Application Settings',
        type: 'Setting',
        description: 'General application preferences',
        icon: 'Settings'
      }
    );

    return items;
  }, [servers, profiles, hosts]);

  useEffect(() => {
    const textBeforeCursor = inputValue.slice(0, cursorPosition);
    
    // Find the last occurrence of "/" or "@" before cursor
    const lastSlash = textBeforeCursor.lastIndexOf('/');
    const lastAt = textBeforeCursor.lastIndexOf('@');
    
    const latestTrigger = Math.max(lastSlash, lastAt);
    
    if (latestTrigger === -1) {
      setShowSuggestions(false);
      setTriggerInfo({ type: null, startPos: -1, query: '' });
      return;
    }

    const triggerChar = textBeforeCursor[latestTrigger];
    const afterTrigger = textBeforeCursor.slice(latestTrigger + 1);
    
    // Check if there's a space after the trigger (which would break the suggestion)
    if (afterTrigger.includes(' ')) {
      setShowSuggestions(false);
      setTriggerInfo({ type: null, startPos: -1, query: '' });
      return;
    }

    const type = triggerChar === '/' ? 'template' : 'resource';
    const query = afterTrigger.toLowerCase();

    setTriggerInfo({ type, startPos: latestTrigger, query });

    // Filter suggestions based on type and query
    let filteredSuggestions: InputSuggestion[] = [];

    if (type === 'template') {
      filteredSuggestions = promptTemplates
        .filter(template => 
          template.title.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.category.toLowerCase().includes(query)
        )
        .map(template => ({
          type: 'template',
          item: template,
          matched: query
        }));
    } else {
      filteredSuggestions = resourceItems
        .filter(resource =>
          resource.name.toLowerCase().includes(query) ||
          resource.type.toLowerCase().includes(query) ||
          (resource.description && resource.description.toLowerCase().includes(query))
        )
        .map(resource => ({
          type: 'resource',
          item: resource,
          matched: query
        }));
    }

    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0);
    setSelectedIndex(0);
  }, [inputValue, cursorPosition, resourceItems]);

  const selectSuggestion = (index: number) => {
    if (index < 0 || index >= suggestions.length) return null;
    
    const suggestion = suggestions[index];
    const { startPos } = triggerInfo;
    
    if (suggestion.type === 'template') {
      const template = suggestion.item as PromptTemplate;
      const beforeTrigger = inputValue.slice(0, startPos);
      const afterCursor = inputValue.slice(cursorPosition);
      
      return {
        newValue: beforeTrigger + template.template + afterCursor,
        newCursorPosition: beforeTrigger.length + template.template.length
      };
    } else {
      const resource = suggestion.item as ResourceItem;
      const beforeTrigger = inputValue.slice(0, startPos);
      const afterCursor = inputValue.slice(cursorPosition);
      const insertText = `@${resource.name}`;
      
      return {
        newValue: beforeTrigger + insertText + afterCursor,
        newCursorPosition: beforeTrigger.length + insertText.length
      };
    }
  };

  const moveCursor = (direction: 'up' | 'down') => {
    if (!showSuggestions) return;
    
    if (direction === 'up') {
      setSelectedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
    } else {
      setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
    }
  };

  const closeSuggestions = () => {
    setShowSuggestions(false);
    setTriggerInfo({ type: null, startPos: -1, query: '' });
  };

  return {
    showSuggestions,
    suggestions,
    selectedIndex,
    triggerInfo,
    selectSuggestion,
    moveCursor,
    closeSuggestions
  };
};
