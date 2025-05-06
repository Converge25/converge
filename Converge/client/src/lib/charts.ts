import { Chart, ChartConfiguration } from 'chart.js/auto';

interface CreateChartOptions {
  chartId: string;
  chartType: 'line' | 'bar' | 'doughnut' | 'pie';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }[];
}

export function createChart(options: CreateChartOptions): Chart | null {
  const canvas = document.getElementById(options.chartId) as HTMLCanvasElement | null;
  if (!canvas) return null;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Destroy existing chart instance if it exists
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  // Configure chart
  const config: ChartConfiguration = {
    type: options.chartType,
    data: {
      labels: options.labels,
      datasets: options.datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: options.chartType !== 'line'
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
            color: '#f4f6f8'
          }
        }
      }
    }
  };

  // Create and return new chart
  return new Chart(ctx, config);
}
