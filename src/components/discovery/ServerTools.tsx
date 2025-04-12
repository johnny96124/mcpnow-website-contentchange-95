
import { useState, useRef } from 'react';
import { ChevronUp, ChevronDown, Wrench } from 'lucide-react';
import { Tool } from '@/data/mockData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServerToolsProps {
  tools: Tool[];
}

export const ServerTools = ({ tools }: ServerToolsProps) => {
  if (!tools || tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Wrench className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500">No tools available</h3>
        <p className="text-sm text-gray-400 max-w-md mt-2">
          This server doesn't provide any tools yet. Tools enable servers to expose specific functionalities.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">Available Tools</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This server provides the following tools. Each tool represents a specific functionality.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {tools.map((tool) => (
            <AccordionItem 
              key={tool.id} 
              value={tool.id}
              className="border border-gray-200 dark:border-gray-700 rounded-md mb-3 overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 data-[state=open]:bg-blue-50 data-[state=open]:dark:bg-blue-900/20">
                <div className="flex items-center text-left">
                  <Wrench className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">{tool.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 bg-gray-50 dark:bg-gray-800/30">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p>{tool.description}</p>
                  
                  {tool.parameters && tool.parameters.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Parameters</h4>
                      <div className="space-y-2">
                        {tool.parameters.map((param, idx) => (
                          <div key={idx} className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                                {param.name}
                                {param.required && <span className="text-red-500 ml-0.5">*</span>}
                              </span>
                              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                {param.type}
                              </span>
                            </div>
                            {param.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{param.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ScrollArea>
  );
};
