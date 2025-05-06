interface ChannelData {
  name: string;
  percentage: number;
  color: string;
}

interface ChannelPerformanceProps {
  channels: ChannelData[];
}

export default function ChannelPerformance({ channels }: ChannelPerformanceProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-neutral-lightest">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Channel Performance</h3>
        <button className="text-sm text-neutral-medium hover:text-primary flex items-center">
          <span>View Details</span>
          <i className="ri-arrow-right-s-line ml-1"></i>
        </button>
      </div>
      
      <div className="space-y-4">
        {channels.map((channel) => (
          <div key={channel.name}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{channel.name}</span>
              <span className="text-sm font-medium">{channel.percentage}%</span>
            </div>
            <div className="w-full bg-neutral-lightest rounded-full h-2">
              <div 
                className={`${channel.color} rounded-full h-2`} 
                style={{ width: `${channel.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
