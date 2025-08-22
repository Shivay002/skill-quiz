import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../services/userService";

export default function ReportsList() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const navigate = useNavigate();

  async function loadUsers(page = 1) {
    try {
      const { data } = await getAllUsers({ page });
      setUsers(data.data);
      setMeta(data.meta);
    } catch {
      toast.error("Failed to load users");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Reports</h2>

      <table className="table-auto border-collapse border border-gray-400 w-full mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.name}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.role}</td>
                <td className="border p-2">
                  <button
                    onClick={() => navigate(`/reports/${u.id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View Report
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border p-2 text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex space-x-2">
        <button
          onClick={() => loadUsers(meta.page - 1)}
          disabled={meta.page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {meta.page} of {meta.totalPages}</span>
        <button
          onClick={() => loadUsers(meta.page + 1)}
          disabled={meta.page === meta.totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
