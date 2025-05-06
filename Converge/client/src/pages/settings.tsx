import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { toast } = useToast();

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Settings" toggleMobileSidebar={toggleMobileSidebar} />
        
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 pb-6 px-4 md:px-6 lg:px-8 bg-neutral-lightest">
          <div className="py-6">
            <h2 className="text-2xl font-bold text-neutral-darkest">Application Settings</h2>
            <p className="mt-1 text-neutral-medium">Coming soon...</p>
          </div>
        </main>
      </div>
    </div>
  );
}
