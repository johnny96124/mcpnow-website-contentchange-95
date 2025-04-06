
import { Outlet } from "react-router-dom";
import { MainSidebar } from "@/components/sidebar/MainSidebar";

const DefaultLayout = () => {
  return (
    <div className="flex min-h-screen">
      <MainSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
