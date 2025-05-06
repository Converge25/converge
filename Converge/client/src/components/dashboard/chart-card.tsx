import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

interface ChartCardProps {
  title: string;
  chartId: string;
  chartType: "revenue" | "leads" | "engagement";
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

export default function ChartCard({ title, chartId, chartData }: ChartCardProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "#f4f6f8"
                }
              }
            }
          }
        });
      }
    }

    // Cleanup chart on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-neutral-lightest">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{title}</h3>
        <div className="flex space-x-2">
          <button className="px-2 py-1 text-xs font-medium rounded bg-primary-light text-primary">Day</button>
          <button className="px-2 py-1 text-xs font-medium rounded text-neutral-medium hover:bg-neutral-lightest">Week</button>
          <button className="px-2 py-1 text-xs font-medium rounded text-neutral-medium hover:bg-neutral-lightest">Month</button>
        </div>
      </div>
      <div className="h-[200px] w-full">
        <canvas id={chartId} ref={chartRef}></canvas>
      </div>
    </div>
  );
}
