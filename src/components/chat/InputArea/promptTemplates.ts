
import { PromptTemplate } from './types';

export const promptTemplates: PromptTemplate[] = [
  // Management Templates
  {
    id: 'setup-server',
    title: 'Setup New Server',
    description: 'Guide to configure a new MCP server',
    template: 'I want to set up a new MCP server for {purpose}. Please help me with:\n1. Choosing the right server type\n2. Configuration steps\n3. Testing the connection\n4. Best practices for {use_case}',
    category: 'Management',
    variables: ['purpose', 'use_case'],
    icon: 'Server'
  },
  {
    id: 'manage-profiles',
    title: 'Manage Profiles',
    description: 'Create and organize server profiles',
    template: 'Help me organize my MCP servers into profiles for {project_type}. I need to:\n1. Group related servers\n2. Set up proper naming conventions\n3. Configure shared settings\n4. Optimize for {workflow_type}',
    category: 'Management',
    variables: ['project_type', 'workflow_type'],
    icon: 'FolderOpen'
  },
  {
    id: 'host-configuration',
    title: 'Host Configuration',
    description: 'Configure host settings and connections',
    template: 'I need to configure my host for {environment} with the following requirements:\n- {requirement_1}\n- {requirement_2}\n- Security considerations\n- Performance optimization',
    category: 'Management',
    variables: ['environment', 'requirement_1', 'requirement_2'],
    icon: 'Settings'
  },

  // Discovery Templates
  {
    id: 'find-servers',
    title: 'Find Servers',
    description: 'Discover servers for specific use cases',
    template: 'I\'m looking for MCP servers that can help me with {task}. My requirements include:\n- {feature_1}\n- {feature_2}\n- Compatible with {technology}\n- {additional_criteria}',
    category: 'Discovery',
    variables: ['task', 'feature_1', 'feature_2', 'technology', 'additional_criteria'],
    icon: 'Search'
  },
  {
    id: 'compare-options',
    title: 'Compare Server Options',
    description: 'Compare different server alternatives',
    template: 'Help me compare MCP servers for {use_case}. I want to understand:\n1. Feature differences\n2. Performance characteristics\n3. Setup complexity\n4. Community support\n5. Best fit for {specific_requirement}',
    category: 'Discovery',
    variables: ['use_case', 'specific_requirement'],
    icon: 'GitCompare'
  },
  {
    id: 'explore-tools',
    title: 'Explore Available Tools',
    description: 'Discover tools and capabilities',
    template: 'Show me what tools and capabilities are available for {domain}. I\'m particularly interested in:\n- {interest_1}\n- {interest_2}\n- Integration possibilities\n- Advanced features',
    category: 'Discovery',
    variables: ['domain', 'interest_1', 'interest_2'],
    icon: 'Telescope'
  },

  // Troubleshooting Templates
  {
    id: 'connection-issues',
    title: 'Connection Issues',
    description: 'Diagnose and fix connection problems',
    template: 'I\'m experiencing connection issues with {server_name}. The problem is:\n- {symptom_1}\n- {symptom_2}\n- Error message: {error_message}\n- When it occurs: {timing}\n\nPlease help me diagnose and fix this.',
    category: 'Troubleshooting',
    variables: ['server_name', 'symptom_1', 'symptom_2', 'error_message', 'timing'],
    icon: 'AlertTriangle'
  },
  {
    id: 'performance-issues',
    title: 'Performance Issues',
    description: 'Identify and resolve performance problems',
    template: 'My MCP setup is experiencing performance issues. I notice:\n- {performance_issue}\n- Response time: {response_time}\n- Resource usage: {resource_usage}\n- Affecting: {affected_operations}\n\nHow can I optimize this?',
    category: 'Troubleshooting',
    variables: ['performance_issue', 'response_time', 'resource_usage', 'affected_operations'],
    icon: 'Zap'
  },
  {
    id: 'debug-configuration',
    title: 'Debug Configuration',
    description: 'Fix configuration and setup issues',
    template: 'I need help debugging my {component_type} configuration. The issue is:\n- Expected behavior: {expected}\n- Actual behavior: {actual}\n- Configuration: {config_details}\n- Environment: {environment}',
    category: 'Troubleshooting',
    variables: ['component_type', 'expected', 'actual', 'config_details', 'environment'],
    icon: 'Bug'
  },

  // Optimization Templates
  {
    id: 'performance-tuning',
    title: 'Performance Tuning',
    description: 'Optimize system performance',
    template: 'Help me optimize my MCP setup for {goal}. Current metrics:\n- {current_metric_1}: {value_1}\n- {current_metric_2}: {value_2}\n- Target: {target_goal}\n- Constraints: {constraints}',
    category: 'Optimization',
    variables: ['goal', 'current_metric_1', 'value_1', 'current_metric_2', 'value_2', 'target_goal', 'constraints'],
    icon: 'TrendingUp'
  },
  {
    id: 'workflow-optimization',
    title: 'Workflow Optimization',
    description: 'Improve development workflows',
    template: 'I want to optimize my workflow for {workflow_type}. Current process:\n1. {step_1}\n2. {step_2}\n3. {step_3}\n\nPain points: {pain_points}\nGoals: {optimization_goals}',
    category: 'Optimization',
    variables: ['workflow_type', 'step_1', 'step_2', 'step_3', 'pain_points', 'optimization_goals'],
    icon: 'Workflow'
  },
  {
    id: 'resource-efficiency',
    title: 'Resource Efficiency',
    description: 'Optimize resource usage and costs',
    template: 'Help me improve resource efficiency for {resource_type}. Current situation:\n- Usage: {current_usage}\n- Costs: {current_costs}\n- Bottlenecks: {bottlenecks}\n- Optimization target: {target}',
    category: 'Optimization',
    variables: ['resource_type', 'current_usage', 'current_costs', 'bottlenecks', 'target'],
    icon: 'BarChart3'
  }
];
