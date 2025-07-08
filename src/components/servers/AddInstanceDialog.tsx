
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { ServerDefinition } from "@/data/mockData";
import { AIInstallDialog } from "./AIInstallDialog";
import { Bot } from "lucide-react";

export interface InstanceFormValues {
  name: string;
  url: string;
  args: string;
  description?: string; // Made description optional
  env?: Record<string, string>;
  headers?: Record<string, string>;
  instanceId?: string;
}

interface AddInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverDefinition: ServerDefinition | null;
  onCreateInstance: (data: InstanceFormValues, selectedHosts?: string[]) => void;
  initialValues?: InstanceFormValues;
  editMode?: boolean;
  instanceId?: string;
  availableHosts?: any[];
  onStartAIChat?: (context: any) => void;
}

export const AddInstanceDialog: React.FC<AddInstanceDialogProps> = ({
  open,
  onOpenChange,
  serverDefinition,
  onCreateInstance,
  initialValues,
  editMode = false,
  instanceId,
  availableHosts,
  onStartAIChat
}) => {
  // Function to get default values based on server definition
  const getDefaultFormData = () => {
    if (initialValues) {
      return {
        name: initialValues.name || "",
        url: initialValues.url || "",
        args: initialValues.args || "",
        description: initialValues.description || "",
        env: initialValues.env || {},
        headers: initialValues.headers || {},
        instanceId: instanceId
      };
    }

    // Pre-fill data based on server definition
    const defaultData: InstanceFormValues = {
      name: serverDefinition?.name || "",
      url: "",
      args: "",
      description: serverDefinition?.description || "",
      env: {},
      headers: {},
      instanceId: instanceId
    };

    // Pre-fill specific configurations based on server type
    if (serverDefinition) {
      switch (serverDefinition.name.toLowerCase()) {
        case 'filesystem':
          defaultData.args = "--allowed-dir /Users/username/Desktop --allowed-dir /path/to/other/allowed/dir";
          defaultData.description = "MCP server for filesystem operations including read/write, directory management, and file searching.";
          break;
        case 'postgres':
          defaultData.url = "postgresql://username:password@localhost:5432/database";
          defaultData.description = "PostgreSQL database connection for MCP operations";
          break;
        case 'sqlite':
          defaultData.args = "--db-path /path/to/database.db";
          defaultData.description = "SQLite database connection for MCP operations";
          break;
        case 'github':
          defaultData.description = "GitHub integration for repository management and operations";
          defaultData.env = { GITHUB_TOKEN: "" };
          break;
        case 'gitlab':
          defaultData.description = "GitLab integration for repository management and operations";
          defaultData.env = { GITLAB_TOKEN: "" };
          break;
        case 'fetch':
          defaultData.description = "HTTP client for making web requests and API calls";
          break;
        case 'puppeteer':
          defaultData.description = "Web automation and scraping capabilities";
          break;
        case 'brave-search':
          defaultData.description = "Brave Search API integration";
          defaultData.env = { BRAVE_SEARCH_API_KEY: "" };
          break;
        case 'google-maps':
          defaultData.description = "Google Maps Platform integration";
          defaultData.env = { GOOGLE_MAPS_API_KEY: "" };
          break;
        case 'slack':
          defaultData.description = "Slack workspace integration";
          defaultData.env = { SLACK_BOT_TOKEN: "", SLACK_SIGNING_SECRET: "" };
          break;
        case 'memory':
          defaultData.description = "Persistent memory storage for conversation context";
          break;
        case 'everart':
          defaultData.description = "EverArt API integration for image generation";
          defaultData.env = { EVERART_API_KEY: "" };
          break;
        case 'codeassistant api':
        case 'codeassistant':
          defaultData.args = "--host localhost --port 8080";
          defaultData.description = "AI-powered code assistant API for development support";
          break;
        default:
          // Keep default values
          break;
      }

      // Set default URL for HTTP_SSE servers
      if (serverDefinition.type === 'HTTP_SSE' && !defaultData.url) {
        defaultData.url = "http://localhost:8080";
      }
    }

    return defaultData;
  };

  const [formData, setFormData] = useState<InstanceFormValues>(getDefaultFormData());

  const [showAIInstallDialog, setShowAIInstallDialog] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (availableHosts && availableHosts.length > 0) {
      // If availableHosts is provided, pass an empty array as selectedHosts
      // In a real implementation, you would collect selected hosts from the UI
      onCreateInstance(formData, []);
    } else {
      onCreateInstance(formData);
    }
  };

  const handleAIInstall = () => {
    setShowAIInstallDialog(true);
  };

  const handleAIInstallComplete = (instanceData: any) => {
    // Convert AI install data to form format
    const aiFormData: InstanceFormValues = {
      name: instanceData.name || serverDefinition?.name || "",
      url: instanceData.url || "",
      args: instanceData.args || "",
      description: `AI assisted installation of ${serverDefinition?.name}`,
    };
    onCreateInstance(aiFormData);
    setShowAIInstallDialog(false);
    onOpenChange(false);
  };

  if (!serverDefinition) return null;

  const isStdio = serverDefinition.type === 'STDIO';
  const isCustom = serverDefinition.isOfficial === false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editMode ? `Edit ${serverDefinition.name}` : `Configure ${serverDefinition.name}`}
            {isCustom && <Badge variant="outline">Custom</Badge>}
          </DialogTitle>
        </DialogHeader>

        {/* AI Install Option - Only show for non-edit mode */}
        {!editMode && onStartAIChat && (
          <div className="px-6 pb-4">
            <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 dark:text-blue-100">AI 辅助安装</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        让AI助手引导您完成服务器的自动化安装和配置
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAIInstall}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    使用AI安装
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Instance Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <Separator />

          {isStdio ? (
            <div className="grid gap-2">
              <Label htmlFor="args">Command Arguments</Label>
              <Textarea
                id="args"
                name="args"
                placeholder="e.g., --host localhost --port 8080"
                value={formData.args}
                onChange={handleInputChange}
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                placeholder="http://localhost:8080"
                type="url"
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe this instance"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name || (!isStdio && !formData.url)}>
            {editMode ? "Update" : "Create"} Instance
          </Button>
        </DialogFooter>
      </DialogContent>

      <AIInstallDialog
        open={showAIInstallDialog}
        onOpenChange={setShowAIInstallDialog}
        serverDefinition={serverDefinition}
        onComplete={handleAIInstallComplete}
        onStartAIChat={onStartAIChat || (() => {})}
      />
    </Dialog>
  );
};
