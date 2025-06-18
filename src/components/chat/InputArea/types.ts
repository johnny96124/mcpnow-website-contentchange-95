
export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  template: string;
  category: 'Management' | 'Discovery' | 'Troubleshooting' | 'Optimization';
  variables?: string[];
  icon?: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  type: 'Profile' | 'Server' | 'Host' | 'Setting';
  status?: 'active' | 'inactive' | 'error';
  description?: string;
  icon?: string;
}

export interface InputSuggestion {
  type: 'template' | 'resource';
  item: PromptTemplate | ResourceItem;
  matched: string;
}
