import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function ScoreTrendChart({ data, isLoading }) {
  if (isLoading) return <div>Loading score trend...</div>;

  if (
    !data ||
    !data.data ||
    !Array.isArray(data.data) ||
    data.data.length === 0
  ) {
    return <div>No score trend data available</div>;
  }

  // Helper to format date as dd/mm/yyyy
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const labels = data.data.map((point) => formatDate(point.createdAt));
  const scores = data.data.map((point) => parseFloat(point.score) || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Average Score Over Time",
        data: scores,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 10 } }
    },
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false }
    }
  };

  return (
    <div className="chart-card">
      <h3>Score Trend</h3>
      <div style={{ height: 250 }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
