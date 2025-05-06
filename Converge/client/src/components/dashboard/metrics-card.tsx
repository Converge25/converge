interface MetricsCardProps {
  title: string;
  value: string;
  icon: string;
  iconBgClass: string;
  iconClass: string;
  changeValue: string;
  isPositive: boolean;
  comparisonText: string;
}

export default function MetricsCard({
  title,
  value,
  icon,
  iconBgClass,
  iconClass,
  changeValue,
  isPositive,
  comparisonText,
}: MetricsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-neutral-lightest">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-medium">{title}</h3>
        <div className={`rounded-full p-2 ${iconBgClass}`}>
          <i className={`${icon} ${iconClass}`}></i>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold">{value}</p>
        <div className="flex items-center mt-1">
          <span 
            className={`text-sm flex items-center ${
              isPositive ? 'text-status-success' : 'text-status-error'
            }`}
          >
            <i className={`${isPositive ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}`}></i> {changeValue}
          </span>
          <span className="text-xs text-neutral-medium ml-2">{comparisonText}</span>
        </div>
      </div>
    </div>
  );
}
