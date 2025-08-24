
export default function PerformanceTable({ data, isLoading, page, limit, onPageChange }) {
  if (isLoading) return <div>Loading performance data...</div>;
  if (!data) return null;

  return (
    <div className="performance-table">
      <table>
        <thead>
          <tr>
            <th>Skill</th>
            <th>Score</th>
            <th>Total Questions</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.data?.map((attempt) => (
            <tr key={attempt.id}>
              <td>{attempt.Skill.name}</td>
              <td>{attempt.score}%</td>
              <td>{attempt.totalQuestions}</td>
              <td>{new Date(attempt.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {page > 1 && <button onClick={() => onPageChange(page - 1)}>Prev</button>}
        <span>Page {page}</span>
        {page < data.meta.totalPages && (
          <button onClick={() => onPageChange(page + 1)}>Next</button>
        )}
      </div>
    </div>
  );
}
