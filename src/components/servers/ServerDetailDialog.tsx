
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ExternalLink, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// 可根据需要传完整 ServerDefinition 类型
export interface ServerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: any | null; // 兼容mock data, 可更精准 typing
}

export const ServerDetailDialog: React.FC<ServerDetailDialogProps> = ({
  open,
  onOpenChange,
  server,
}) => {
  if (!server) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white dark:bg-gray-900">
        <div className="relative">
          {/* 顶部条 */}
          <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-t-2xl">
            <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-white/10 text-2xl font-bold select-none">
              {/* 简化logo缩写 */}
              {server.icon ? (
                <span className="text-3xl">{server.icon}</span>
              ) : (
                <span>{server.name?.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{server.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs px-2 bg-blue-100 text-blue-700 border-blue-200">
                  {server.type}
                </Badge>
                {server.isOfficial && (
                  <Badge variant="outline" className="text-xs px-2 border-green-500 text-green-600 bg-green-50">
                    Official
                  </Badge>
                )}
              </div>
            </div>
            <DialogClose asChild>
              <button className="ml-auto rounded-full p-1 hover:bg-white/20 transition">
                <X className="h-6 w-6" />
              </button>
            </DialogClose>
          </div>
          {/* 主体Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-gray-900">
            {/* 左列（信息） */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Description</h3>
                <p className="text-base">{server.description}</p>
              </div>
              {/* Author */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Author</h3>
                <div className="flex items-center gap-2">
                  <span className="text-base">{server.author}</span>
                </div>
              </div>
              {/* Features */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Features</h3>
                <ul className="list-disc list-inside text-base space-y-1">
                  {Array.isArray(server.features) &&
                    server.features.map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                </ul>
              </div>
              {/* Categories */}
              {server.categories && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {server.categories.map((cat: string) => (
                      <Badge key={cat} variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* 右列（版本/数据） */}
            <div className="flex flex-col gap-4">
              {/* 版本/更新时间/Repo */}
              <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                  Version
                </h3>
                <p className="font-medium">{server.version}</p>
                {server.lastUpdated && (
                  <>
                    <h3 className="text-sm font-medium mt-2 text-gray-600 dark:text-gray-300">
                      Last Updated
                    </h3>
                    <p className="font-medium">{server.lastUpdated}</p>
                  </>
                )}
                {server.repository && (
                  <>
                    <h3 className="text-sm font-medium mt-2 text-gray-600 dark:text-gray-300">
                      Repository
                    </h3>
                    <a
                      href={server.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      {server.repository}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </>
                )}
              </div>
              {/* 简单数据统计 */}
              <div className="flex flex-col gap-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <h4 className="text-xs text-muted-foreground">Downloads</h4>
                    <p className="font-bold">
                      {server.downloads ? (server.downloads / 1000).toFixed(1) + "k" : "-"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs text-muted-foreground">Stars</h4>
                    <p className="font-bold">
                      {server.stars ?? "-"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs text-muted-foreground">Type</h4>
                    <p className="font-bold uppercase">{server.type}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 安装按钮 */}
          <div className="p-6 border-t flex justify-end bg-white dark:bg-gray-900 rounded-b-2xl">
            <a
              href="/servers"
              className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-base transition"
            >
              <ExternalLink className="h-5 w-5" />
              Install Server
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
