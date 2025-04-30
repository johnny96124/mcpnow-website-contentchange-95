
import React from "react";
import { Link } from "react-router-dom";
import { Twitter, DiscIcon } from "lucide-react";

const IntroFooter = () => {
  return (
    <footer className="py-12 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/lovable-uploads/bbb3edcf-989e-42ed-a8dd-d5f07f4c632d.png" alt="MCP Now Logo" className="h-8 w-8 rounded-lg shadow" />
              <span className="text-xl font-extrabold tracking-tight font-montserrat">MCP Now</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              简化 AI 模型管理与部署的现代解决方案
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 font-montserrat">产品</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#what-is-mcp" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">什么是 MCP</Link></li>
              <li><Link to="#why-mcp-now" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">为什么选择 MCP Now</Link></li>
              <li><Link to="#download" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">下载</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">更新日志</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 font-montserrat">资源</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">文档</Link></li>
              <li><Link to="#download" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">入门指南</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">API 参考</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">示例</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 font-montserrat">关于我们</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">公司</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">博客</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">联系我们</Link></li>
              <li>
                <div className="flex gap-4 mt-2">
                  <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:scale-110 transition-transform duration-300">
                    <DiscIcon className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:scale-110 transition-transform duration-300">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 MCP Now. 保留所有权利。
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">隐私政策</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">服务条款</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">法律信息</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default IntroFooter;
