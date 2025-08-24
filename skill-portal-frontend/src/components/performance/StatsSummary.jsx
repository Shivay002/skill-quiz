export default function StatsSummary({ userPerf, timeReport }) {
  if (!userPerf || !timeReport) return null;

  const totalAttempts = timeReport.meta?.total || 0;
  const averageScore = timeReport.data?.length
    ? (
        timeReport.data.reduce((acc, a) => acc + a.score, 0) /
        timeReport.data.length
      ).toFixed(1)
    : 0;

  const stats = [
    { label: "Total Attempts", value: totalAttempts },
    { label: "Average Score", value: `${averageScore}%` },
  ];

  return (
    <div className="stats-summary flex flex-col sm:flex-row gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="flex-1 bg-white shadow-md rounded-lg p-4 text-center border border-gray-200"
        >
          <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
