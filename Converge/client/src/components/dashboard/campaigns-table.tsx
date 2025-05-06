import StatusBadge from "@/components/ui/status-badge";

export interface Campaign {
  id: string;
  name: string;
  date: string;
  status: "completed" | "active" | "scheduled";
  channel: "Email" | "SMS" | "Social" | "Pop-up";
  performanceValue?: string;
  performanceChange?: string;
  isPositive?: boolean;
}

interface CampaignsTableProps {
  campaigns: Campaign[];
}

export default function CampaignsTable({ campaigns }: CampaignsTableProps) {
  // Map channel to icon and color
  const channelIcons = {
    Email: { icon: "ri-mail-line", bgClass: "bg-primary-light", textClass: "text-primary" },
    SMS: { icon: "ri-message-2-line", bgClass: "bg-secondary-light", textClass: "text-secondary" },
    Social: { icon: "ri-instagram-line", bgClass: "bg-accent-light", textClass: "text-accent" },
    "Pop-up": { icon: "ri-layout-grid-line", bgClass: "bg-status-infoLight", textClass: "text-status-info" }
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-5 border border-neutral-lightest">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Recent Campaigns</h3>
        <button className="text-sm text-neutral-medium hover:text-primary flex items-center">
          <span>View All</span>
          <i className="ri-arrow-right-s-line ml-1"></i>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-neutral-lightest">
              <th className="px-2 py-3 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">Campaign</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">Status</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">Channel</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider">Performance</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-neutral-medium uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-lightest">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-neutral-lightest">
                <td className="px-2 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded ${channelIcons[campaign.channel].bgClass} ${channelIcons[campaign.channel].textClass} flex items-center justify-center`}>
                      <i className={channelIcons[campaign.channel].icon}></i>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium">{campaign.name}</div>
                      <div className="text-xs text-neutral-medium">Sent {campaign.date}</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-sm">{campaign.channel}</td>
                <td className="px-2 py-3 whitespace-nowrap">
                  {campaign.performanceValue ? (
                    <div className="text-sm">
                      <div className="flex items-center">
                        <span className="mr-2 font-medium">{campaign.performanceValue}</span>
                        {campaign.performanceChange && (
                          <span className={`text-xs ${campaign.isPositive ? 'text-status-success' : 'text-status-error'}`}>
                            {campaign.isPositive ? '↑' : '↓'} {campaign.performanceChange}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <div className="flex items-center">
                        <span className="mr-2 font-medium">--</span>
                        <span className="text-xs text-neutral-medium">Not started</span>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-right text-sm">
                  <button className="text-neutral-medium hover:text-primary">
                    <i className="ri-more-2-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
