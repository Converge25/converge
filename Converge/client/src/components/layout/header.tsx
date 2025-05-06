interface HeaderProps {
  title: string;
  toggleMobileSidebar: () => void;
}

export default function Header({ title, toggleMobileSidebar }: HeaderProps) {
  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-neutral-lighter h-16 flex items-center px-4">
        <button 
          className="text-neutral-dark hover:text-neutral-darkest"
          onClick={toggleMobileSidebar}
        >
          <i className="ri-menu-line text-2xl"></i>
        </button>
        <div className="flex items-center ml-4">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <i className="ri-bar-chart-box-line text-white text-xl"></i>
          </div>
          <span className="font-bold text-lg ml-2 text-neutral-darkest">Marketing Hub</span>
        </div>
      </div>

      {/* Desktop Header */}
      <header className="bg-white border-b border-neutral-lighter h-16 flex items-center justify-between px-4 md:px-6 hidden md:flex">
        <div>
          <h1 className="text-xl font-bold text-neutral-darkest">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-3 py-1 text-sm border border-neutral-lighter rounded hover:bg-neutral-lightest flex items-center">
            <i className="ri-question-line mr-1"></i>
            Help
          </button>
          <button className="px-3 py-1 text-sm border border-neutral-lighter rounded hover:bg-neutral-lightest flex items-center">
            <i className="ri-notification-3-line mr-1"></i>
            Notifications
          </button>
          <button className="text-primary hover:text-primary-dark border border-primary hover:border-primary-dark rounded px-4 py-1.5 text-sm font-medium">
            Visit Store
          </button>
        </div>
      </header>
    </>
  );
}
