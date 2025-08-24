import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SkillGapChart({ data, isLoading }) {
  if (isLoading) return <div>Loading skill gap...</div>;
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No skill gap data available</div>;
  }

  const labels = data.map((s) => s.Skill?.name ?? "Unknown Skill");
  const scores = data.map((s) => parseFloat(s.avgScore) || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Average Score",
        data: scores,
        backgroundColor: "rgba(136, 132, 216, 0.6)",
        borderColor: "rgba(136, 132, 216, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 10 } },
    },
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
  };

  return (
    <div className="chart-card">
      <h3>Skill Gap</h3>
      <div style={{ height: 250 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
