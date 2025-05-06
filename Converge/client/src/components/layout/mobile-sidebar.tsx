import { Link, useLocation } from "wouter";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const [location] = useLocation();
  
  const navigationItems = [
    { name: "Dashboard", path: "/", icon: "ri-dashboard-line" },
    { name: "Email Marketing", path: "/email-marketing", icon: "ri-mail-line" },
    { name: "SMS Marketing", path: "/sms-marketing", icon: "ri-message-2-line" },
    { name: "Social Media", path: "/social-media", icon: "ri-instagram-line" },
    { name: "Pop-ups & Leads", path: "/popups", icon: "ri-layout-grid-line" },
    { name: "Analytics", path: "/analytics", icon: "ri-line-chart-line" },
  ];
  
  const settingsItems = [
    { name: "User Management", path: "/user-management", icon: "ri-team-line" },
    { name: "Subscription", path: "/subscription", icon: "ri-coin-line" },
    { name: "Settings", path: "/settings", icon: "ri-settings-3-line" },
  ];

  return (
    <div className={`md:hidden fixed inset-0 z-20 bg-neutral-darkest bg-opacity-50 ${isOpen ? "" : "hidden"}`} onClick={onClose}>
      <div 
        className={`absolute top-0 left-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center h-16 border-b border-neutral-lighter px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <i className="ri-bar-chart-box-line text-white text-xl"></i>
            </div>
            <span className="font-bold text-lg text-neutral-darkest">Marketing Hub</span>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`nav-item flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location === item.path
                    ? "bg-primary-light text-primary active"
                    : "text-neutral-dark hover:bg-neutral-lightest hover:text-primary"
                }`}
              >
                <i className={`${item.icon} mr-3 text-lg`}></i>
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 pb-2">
              <div className="px-2">
                <h3 className="text-xs font-semibold text-neutral-medium uppercase tracking-wider">Settings</h3>
              </div>
            </div>
            
            {settingsItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`nav-item flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location === item.path
                    ? "bg-primary-light text-primary active"
                    : "text-neutral-dark hover:bg-neutral-lightest hover:text-primary"
                }`}
              >
                <i className={`${item.icon} mr-3 text-lg`}></i>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="border-t border-neutral-lighter p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-primary-light text-primary flex items-center justify-center">
                <span className="font-medium text-sm">JS</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-darkest">Jane Smith</p>
              <p className="text-xs text-neutral-medium">jane@examplestore.com</p>
            </div>
            <button className="ml-auto flex-shrink-0 text-neutral-medium hover:text-neutral-dark">
              <i className="ri-logout-box-r-line"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
