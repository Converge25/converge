interface QuickAction {
  title: string;
  icon: string;
  bgColorClass: string;
  textColorClass: string;
  hoverBgClass: string;
  hoverBorderClass: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-neutral-lightest">
      <h3 className="font-medium mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 border border-neutral-lightest rounded-lg ${action.hoverBorderClass} ${action.hoverBgClass} flex flex-col items-center justify-center text-center`}
          >
            <div className={`h-10 w-10 rounded-full ${action.bgColorClass} ${action.textColorClass} flex items-center justify-center mb-2`}>
              <i className={`${action.icon} text-lg`}></i>
            </div>
            <span className="text-sm font-medium">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
