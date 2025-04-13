
import { Outlet } from "react-router-dom";
import { MainSidebar } from "@/components/sidebar/MainSidebar";
import { useState } from "react";
import { GettingStartedDialog } from "@/components/onboarding/GettingStartedDialog";

const DefaultLayout = () => {
  const [showGettingStarted, setShowGettingStarted] = useState(false);

  const handleShowGettingStarted = () => {
    setShowGettingStarted(true);
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 flex-shrink-0">
        <MainSidebar onShowGettingStarted={handleShowGettingStarted} />
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
      
      {/* 引导弹窗 - 由侧边栏按钮触发 */}
      <GettingStartedDialog 
        open={showGettingStarted} 
        onOpenChange={setShowGettingStarted} 
      />
    </div>
  );
};

export default DefaultLayout;
