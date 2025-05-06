
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Home, Settings, Server, Database, Search, Layout, AlertTriangle } from "lucide-react";

const FileNavigator: React.FC = () => {
  const navigate = useNavigate();
  
  // Define all available routes in the application
  const routes = [
    { path: "/", name: "主页 (Hosts)", icon: <Home className="w-5 h-5" /> },
    { path: "/dashboard", name: "仪表盘 (Dashboard)", icon: <Layout className="w-5 h-5" /> },
    { path: "/hosts-new-user", name: "新用户主机页面 (Hosts New User)", icon: <Server className="w-5 h-5" /> },
    { path: "/servers", name: "服务器 (Servers)", icon: <Server className="w-5 h-5" /> },
    { path: "/profiles", name: "配置文件 (Profiles)", icon: <FileText className="w-5 h-5" /> },
    { path: "/discovery", name: "发现 (Discovery)", icon: <Search className="w-5 h-5" /> },
    { path: "/settings", name: "设置 (Settings)", icon: <Settings className="w-5 h-5" /> },
    { path: "/host-new", name: "新布局主机 (Host New Layout)", icon: <Layout className="w-5 h-5" /> },
    { path: "/website-en", name: "英文网站 (Website English)", icon: <FileText className="w-5 h-5" /> },
    { path: "/website-cn", name: "中文网站 (Website Chinese)", icon: <FileText className="w-5 h-5" /> },
    { path: "/tray", name: "托盘弹出窗口 (Tray Popup)", icon: <Database className="w-5 h-5" /> },
    { path: "/tray-new-user", name: "新用户托盘弹出窗口 (New User Tray Popup)", icon: <Database className="w-5 h-5" /> },
    { path: "/file-navigator", name: "文件导航器 (File Navigator)", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">文件导航器 (File Navigator)</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>所有可用路由 (All Available Routes)</CardTitle>
          <CardDescription>
            点击下面的链接导航到相应的页面 (Click on the links below to navigate to the respective pages)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((route, index) => (
              <Link 
                key={index} 
                to={route.path}
                className="block"
              >
                <div className="border rounded-md p-4 hover:bg-muted transition-colors flex items-center">
                  <div className="mr-4 text-primary">
                    {route.icon}
                  </div>
                  <div>
                    <p className="font-medium">{route.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{route.path}</p>
                  </div>
                </div>
              </Link>
            ))}
            
            <div className="border border-dashed rounded-md p-4 flex items-center">
              <div className="mr-4 text-yellow-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">其他页面 (Other Pages)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  不在列表中的页面可能需要特定参数 (Pages not in the list may require specific parameters)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileNavigator;
