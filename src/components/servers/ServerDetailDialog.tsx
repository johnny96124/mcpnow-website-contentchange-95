
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { X, Globe2, Calendar, Download, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ServerDefinition, Tool } from "@/data/mockData";
import { Button } from "@/components/ui/button";

interface ServerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerDefinition | null;
}

export function ServerDetailDialog({ open, onOpenChange, server }: ServerDetailDialogProps) {
  const [tab, setTab] = useState<"overview" | "tools">("overview");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    setTab("overview");
  }, [open, server]);

  if (!server) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 bg-transparent shadow-none border-none overflow-hidden relative" style={{background: "none"}}>
        {/* 顶部蓝色渐变头部 */}
        <div className="relative p-8 pb-0" style={{background: "linear-gradient(90deg, #5078F2 45%, #887DF4 100%)"}}>
          <div className="text-white flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="size-16 rounded bg-white/10 flex items-center justify-center font-bold text-2xl uppercase select-none" style={{minWidth: 64}}>{server.name?.[0] || "S"}</div>
              <div>
                <div className="flex items-center gap-2 text-2xl font-bold">
                  {server.name}
                  <Badge variant="secondary" className="bg-white/80 text-indigo-800 font-medium text-xs ml-2 rounded px-2 py-0.5">{server.type}</Badge>
                  {server.isOfficial && (
                    <Badge className="bg-green-100 text-green-700 font-medium text-xs ml-2 rounded px-2 py-0.5 border-0">Official</Badge>
                  )}
                </div>
                <div className="mt-1 text-white/90 text-base">{server.description}</div>
              </div>
            </div>
            {/* 关闭按钮 */}
            <button
              aria-label="Close"
              onClick={() => onOpenChange(false)}
              className="absolute right-6 top-6 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <Tabs value={tab} onValueChange={(v) => setTab(v as "overview" | "tools")} className="mt-8">
            <TabsList className="bg-white/10 rounded-md">
              <TabsTrigger value="overview" className="text-white/90 data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur">{/*icon*/}<span className="mr-2"><Globe2 className="inline size-4" /></span>Overview</TabsTrigger>
              <TabsTrigger value="tools" className="text-white/90 data-[state=active]:bg-white/20 data-[state=active]:backdrop-blur">{/*icon*/}<span className="mr-2"><Download className="inline size-4" /></span>Tools</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* 内容区白色卡片 */}
        <div className="bg-white dark:bg-[#191A1B] rounded-t-2xl -mt-6 px-8 pb-8 pt-8 min-h-[380px]" ref={contentRef}>
          <Tabs value={tab}>
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* 左 - 主要信息 */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-200 mb-4">{server.description}</p>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Features</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-200">
                      <li>Component scaffolding</li>
                      <li>Style generation</li>
                      <li>Accessibility testing</li>
                      <li>Performance optimization</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-700">Web</Badge>
                      <Badge className="bg-indigo-100 text-indigo-700">UI/UX</Badge>
                      <Badge className="bg-violet-100 text-violet-700">Frontend</Badge>
                    </div>
                  </div>
                </div>
                {/* 右 - 其他信息 */}
                <div className="md:col-span-2 flex flex-col gap-8">
                  <div>
                    <h4 className="font-semibold mb-2">Version</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span>{server.version || "1.0.0"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Last Updated</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" /><span>{server.lastUpdated || "2025/4/3"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Repository</h4>
                    <a href={server.repository || "#"} target="_blank" rel="noopener" className="text-blue-600 underline flex items-center gap-1">
                      <Globe2 className="w-4 h-4" /> {server.repository || "https://github.com/webdev/frontend-tools"}
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Usage Statistics</h4>
                    <div className="flex gap-4">
                      <div className="rounded bg-gray-100 dark:bg-gray-900 px-4 py-2 flex flex-col items-center">
                        <span className="font-bold text-lg">762.2K</span>
                        <span className="text-xs text-gray-500">Views</span>
                      </div>
                      <div className="rounded bg-gray-100 dark:bg-gray-900 px-4 py-2 flex flex-col items-center">
                        <span className="font-bold text-lg">4.2K</span>
                        <span className="text-xs text-gray-500">Downloads</span>
                      </div>
                      <div className="rounded bg-gray-100 dark:bg-gray-900 px-4 py-2 flex flex-col items-center">
                        <span className="font-bold text-lg">1.0K</span>
                        <span className="text-xs text-gray-500">Stars</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tools">
              <div>
                <h3 className="text-lg font-semibold mb-3">Available Tools</h3>
                {/* Tool 列表 */}
                {!server.tools || server.tools.length === 0 ? (
                  <p className="text-gray-400 text-sm">No tools available for this server.</p>
                ) : (
                  <ul className="space-y-2">
                    {server.tools.map((tool: Tool, idx: number) => (
                      <li key={tool.id || idx} className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-md">
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-xs text-muted-foreground">{tool.description}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>
          </Tabs>
          {/* 底部按钮 */}
          <div className="flex justify-end mt-10">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg px-8 py-2">Install Server</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
