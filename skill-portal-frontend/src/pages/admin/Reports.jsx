import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Fragment, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import toast from "react-hot-toast";
import { getUserReport } from "../../services/reportService";
import { getAllUsers } from "../../services/userService";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Reports() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(false);

  const [expandedUserId, setExpandedUserId] = useState(null);
  // Cache shape: { [userId]: { data: Attempt[], meta: { page, totalPages, ... } } }
  const [reportsCache, setReportsCache] = useState({});
  const [reportLoading, setReportLoading] = useState(false);

  async function loadUsers(page = 1) {
    try {
      setLoading(true);
      const { data } = await getAllUsers({ page, limit: meta.limit });
      setUsers(data?.data || []);
      setMeta(data?.meta || { page: 1, totalPages: 1, total: 0, limit: meta.limit });
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUserReport(userId, page = 1, limit = 10) {
    const { data } = await getUserReport({ userId, page, limit });
    return data; // { data: rows, meta }
  }

  async function toggleUser(userId) {
    setExpandedUserId(prev => (prev === userId ? null : userId));
    // If opening and not cached, fetch page 1
    if (!reportsCache[userId]) {
      try {
        setReportLoading(true);
        const data = await fetchUserReport(userId, 1, 10);
        setReportsCache(prev => ({ ...prev, [userId]: data }));
      } catch {
        toast.error("Failed to load user report");
      } finally {
        setReportLoading(false);
      }
    }
  }

  async function loadMoreReport(userId, page) {
    try {
      setReportLoading(true);
      const data = await fetchUserReport(userId, page, 10);
      setReportsCache(prev => ({ ...prev, [userId]: data }));
    } catch {
      toast.error("Failed to paginate user report");
    } finally {
      setReportLoading(false);
    }
  }

  function buildChartData(attempts) {
    // Sort by createdAt ascending for a clean trend line
    const sorted = [...attempts].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return {
      labels: sorted.map(a => new Date(a.createdAt).toLocaleDateString()),
      datasets: [
        {
          label: "Score",
          data: sorted.map(a => a.score),
          borderColor: "rgb(59,130,246)",
          backgroundColor: "rgba(59,130,246,0.4)",
          tension: 0.3,
          fill: true,
          pointRadius: 3,
        },
      ],
    };
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true }, tooltip: { mode: "index", intersect: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 10 } },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Reports</h2>

      <div className="mb-3 text-sm text-gray-600">
        Total: {meta.total} • Page {meta.page} of {meta.totalPages}
      </div>

      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={4} className="border p-4 text-center">Loading users…</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan={4} className="border p-4 text-center">No users found</td></tr>
          ) : (
            users.map(u => {
              const isOpen = expandedUserId === u.id;
              const report = reportsCache[u.id]; // { data, meta }
              const attempts = report?.data || [];
              const rMeta = report?.meta;

              const totalAttempts = attempts.length;
              const avgScore = totalAttempts
                ? Math.round(
                    (attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts) * 10
                  ) / 10
                : 0;

              return (
                <Fragment key={u.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-2">{u.name}</td>
                    <td className="border p-2">{u.email}</td>
                    <td className="border p-2 capitalize">{u.role}</td>
                    <td className="border p-2 text-center">
                      <button
                        className={`px-3 py-1 rounded ${isOpen ? "bg-gray-500 text-white" : "bg-blue-500 text-white"}`}
                        onClick={() => toggleUser(u.id)}
                      >
                        {isOpen ? "Hide" : "View"} Report
                      </button>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr>
                      <td colSpan={4} className="border p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm">
                            <span className="font-semibold mr-2">Summary:</span>
                            <span className="mr-3">Attempts: {totalAttempts}</span>
                            <span className="mr-3">Avg Score: {avgScore}</span>
                          </div>
                          {rMeta && (
                            <div className="text-sm">
                              Page {rMeta.page} of {rMeta.totalPages}
                            </div>
                          )}
                        </div>

                        {reportLoading && attempts.length === 0 ? (
                          <div className="p-3 text-sm text-gray-600">Loading report…</div>
                        ) : attempts.length === 0 ? (
                          <div className="p-3 text-sm text-gray-600">No attempts found for this user</div>
                        ) : (
                          <div>
                            <div className="mb-4" style={{ height: 240 }}>
                              <Line data={buildChartData(attempts)} options={chartOptions} />
                            </div>

                            <div className="overflow-x-auto">
                              <table className="table-auto border-collapse border border-gray-300 w-full mb-3">
                                <thead>
                                  <tr className="bg-gray-200">
                                    <th className="border p-2 text-left">Date</th>
                                    <th className="border p-2 text-left">Skill</th>
                                    <th className="border p-2 text-left">Score</th>
                                    <th className="border p-2 text-left">Time</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {attempts.map((a) => (
                                    <tr key={a.id ?? `${a.skillId}-${a.createdAt}`}>
                                      <td className="border p-2">
                                        {new Date(a.createdAt).toLocaleString()}
                                      </td>
                                      <td className="border p-2">
                                        {a.Skill?.name || a.skill?.name || a.skillId}
                                      </td>
                                      <td className="border p-2">{a.score}</td>
                                      <td className="border p-2">{a.duration ? `${a.duration} sec` : "-"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {rMeta && (
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                              disabled={rMeta.page <= 1 || reportLoading}
                              onClick={() => loadMoreReport(u.id, rMeta.page - 1)}
                            >
                              Prev
                            </button>
                            <button
                              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                              disabled={rMeta.page >= rMeta.totalPages || reportLoading}
                              onClick={() => loadMoreReport(u.id, rMeta.page + 1)}
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>

      <div className="flex items-center gap-2 mt-3">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={meta.page <= 1 || loading}
          onClick={() => loadUsers(meta.page - 1)}
        >
          Prev
        </button>
        <span className="text-sm">Page {meta.page} of {meta.totalPages}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={meta.page >= meta.totalPages || loading}
          onClick={() => loadUsers(meta.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
