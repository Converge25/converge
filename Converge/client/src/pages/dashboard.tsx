import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import MetricsCard from "@/components/dashboard/metrics-card";
import ChartCard from "@/components/dashboard/chart-card";
import ChannelPerformance from "@/components/dashboard/channel-performance";
import CampaignsTable, { Campaign } from "@/components/dashboard/campaigns-table";
import TaskList, { Task } from "@/components/dashboard/task-list";
import QuickActions from "@/components/dashboard/quick-actions";
import DateRangeSelector from "@/components/ui/date-range-selector";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("7days");
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  // Fetch dashboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard', dateRange],
  });

  // Fetch tasks
  const { data: tasksData } = useQuery({
    queryKey: ['/api/tasks'],
  });

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData);
    }
  }, [tasksData]);

  const handleTaskToggle = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Actions for quick action buttons
  const handleCreateEmailCampaign = () => {
    toast({
      title: "Feature coming soon",
      description: "Email campaign creation will be available in the next update.",
    });
  };

  const handleCreateSmsCampaign = () => {
    toast({
      title: "Feature coming soon",
      description: "SMS campaign creation will be available in the next update.",
    });
  };

  const handleCreateSocialPost = () => {
    toast({
      title: "Feature coming soon",
      description: "Social post creation will be available in the next update.",
    });
  };

  const handleCreatePopup = () => {
    toast({
      title: "Feature coming soon",
      description: "Pop-up creation will be available in the next update.",
    });
  };

  // Prepare chart data
  const revenueChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Revenue',
      data: [3200, 2800, 3500, 4200, 3800, 4500, 5100],
      borderColor: '#008060',
      backgroundColor: 'rgba(0, 128, 96, 0.1)',
    }]
  };

  // Channel performance data
  const channelPerformanceData = [
    { name: "Email", percentage: 42, color: "bg-primary" },
    { name: "SMS", percentage: 28, color: "bg-secondary" },
    { name: "Social Media", percentage: 18, color: "bg-accent" },
    { name: "Pop-ups", percentage: 12, color: "bg-status-info" }
  ];

  // Campaign data
  const campaignsData: Campaign[] = [
    {
      id: "1",
      name: "Summer Sale Announcement",
      date: "Jun 12, 2023",
      status: "completed",
      channel: "Email",
      performanceValue: "24.8%",
      performanceChange: "3.2%",
      isPositive: true
    },
    {
      id: "2",
      name: "Flash Sale Reminder",
      date: "Jun 18, 2023",
      status: "completed",
      channel: "SMS",
      performanceValue: "18.2%",
      performanceChange: "1.5%",
      isPositive: true
    },
    {
      id: "3",
      name: "New Collection Post",
      date: "Jun 20, 2023",
      status: "active",
      channel: "Social",
      performanceValue: "32.1%",
      performanceChange: "5.4%",
      isPositive: true
    },
    {
      id: "4",
      name: "Newsletter Signup",
      date: "Jun 22, 2023",
      status: "scheduled",
      channel: "Pop-up"
    }
  ];

  // Default tasks if no data is loaded yet
  const defaultTasks: Task[] = [
    {
      id: "1",
      title: "Schedule summer campaign",
      dueDate: "Jun 25, 2023",
      priority: "primary",
      completed: false
    },
    {
      id: "2",
      title: "Design new pop-up template",
      dueDate: "Jun 26, 2023",
      priority: "secondary",
      completed: false
    },
    {
      id: "3",
      title: "Review campaign analytics",
      dueDate: "Jun 28, 2023",
      priority: "accent",
      completed: false
    },
    {
      id: "4",
      title: "Plan holiday promotion strategy",
      dueDate: "Jun 30, 2023",
      priority: "warning",
      completed: false
    }
  ];

  // Quick action buttons configuration
  const quickActions = [
    {
      title: "New Email Campaign",
      icon: "ri-mail-line",
      bgColorClass: "bg-primary-light",
      textColorClass: "text-primary",
      hoverBgClass: "hover:bg-primary-light",
      hoverBorderClass: "hover:border-primary",
      onClick: handleCreateEmailCampaign
    },
    {
      title: "New SMS Campaign",
      icon: "ri-message-2-line",
      bgColorClass: "bg-secondary-light",
      textColorClass: "text-secondary",
      hoverBgClass: "hover:bg-secondary-light",
      hoverBorderClass: "hover:border-secondary",
      onClick: handleCreateSmsCampaign
    },
    {
      title: "Create Social Post",
      icon: "ri-instagram-line",
      bgColorClass: "bg-accent-light",
      textColorClass: "text-accent",
      hoverBgClass: "hover:bg-accent-light",
      hoverBorderClass: "hover:border-accent",
      onClick: handleCreateSocialPost
    },
    {
      title: "Create Pop-up",
      icon: "ri-layout-grid-line",
      bgColorClass: "bg-status-infoLight",
      textColorClass: "text-status-info",
      hoverBgClass: "hover:bg-status-infoLight",
      hoverBorderClass: "hover:border-status-info",
      onClick: handleCreatePopup
    }
  ];

  // Load Remix Icon CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" toggleMobileSidebar={toggleMobileSidebar} />
        
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 pb-6 px-4 md:px-6 lg:px-8 bg-neutral-lightest">
          {/* Dashboard Header Section */}
          <div className="py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-darkest">Marketing Dashboard</h2>
                <p className="mt-1 text-neutral-medium">
                  Overview of your marketing performance
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-3">
                <DateRangeSelector onRangeChange={setDateRange} />
                
                <Button className="bg-primary hover:bg-primary-dark text-white">
                  <i className="ri-add-line mr-1"></i>
                  Create Campaign
                </Button>
              </div>
            </div>
          </div>
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <MetricsCard
              title="Total Revenue"
              value="$24,780"
              icon="ri-money-dollar-circle-line"
              iconBgClass="bg-primary-light"
              iconClass="text-primary"
              changeValue="12.5%"
              isPositive={true}
              comparisonText="vs last period"
            />
            
            <MetricsCard
              title="New Leads"
              value="384"
              icon="ri-user-add-line"
              iconBgClass="bg-secondary-light"
              iconClass="text-secondary"
              changeValue="8.2%"
              isPositive={true}
              comparisonText="vs last period"
            />
            
            <MetricsCard
              title="Email Open Rate"
              value="23.5%"
              icon="ri-mail-open-line"
              iconBgClass="bg-accent-light"
              iconClass="text-accent"
              changeValue="2.1%"
              isPositive={false}
              comparisonText="vs last period"
            />
            
            <MetricsCard
              title="Conversion Rate"
              value="3.8%"
              icon="ri-exchange-funds-line"
              iconBgClass="bg-status-infoLight"
              iconClass="text-status-info"
              changeValue="0.7%"
              isPositive={true}
              comparisonText="vs last period"
            />
          </div>
          
          {/* Performance Charts Section */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Revenue from Marketing"
              chartId="revenue-chart"
              chartType="revenue"
              chartData={revenueChartData}
            />
            
            <ChannelPerformance channels={channelPerformanceData} />
          </div>
          
          {/* Recent Campaigns & Tasks Section */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CampaignsTable campaigns={campaignsData} />
            
            <TaskList 
              tasks={tasks.length ? tasks : defaultTasks} 
              onTaskToggle={handleTaskToggle}
            />
          </div>
          
          {/* Quick Actions Section */}
          <div className="mt-6">
            <QuickActions actions={quickActions} />
          </div>
        </main>
      </div>
    </div>
  );
}
