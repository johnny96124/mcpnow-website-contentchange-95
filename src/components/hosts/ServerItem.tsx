
import React, { useState } from "react";
import { ServerInstance, ConnectionStatus, serverDefinitions } from "@/data/mockData";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Info, AlertTriangle, ExternalLink, Trash2, Server, Wrench } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ServerErrorDialog } from "./ServerErrorDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ServerDetailsDialog } from "./ServerDetailsDialog";
import { ServerToolsList } from "@/components/discovery/ServerToolsList";
