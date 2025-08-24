// src/pages/PerformancePage.jsx
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FiltersPanel from "../components/performance/FiltersPanel";
import PerformanceTable from "../components/performance/PerformanceTable";
import ScoreTrendChart from "../components/performance/ScoreTrendChart";
import SkillGapChart from "../components/performance/SkillGapChart";
import StatsSummary from "../components/performance/StatsSummary";
import {
    getSkillGap,
    getTimeReport,
    getUserReport,
} from "../services/reportService";

export default function PerformancePage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    filter: "month", // week | month | custom
    from: null,
    to: null,
    page: 1,
    limit: 10,
  });

  // Queries
  const userPerfQuery = useQuery({
    queryKey: ["userPerformance", filters.page, filters.limit],
    queryFn: () =>
      getUserReport({ page: filters.page, limit: filters.limit }).then(
        (res) => res.data
      ),
  });

  const skillGapQuery = useQuery({
    queryKey: ["skillGap"],
    queryFn: () => getSkillGap().then((res) => res.data),
  });

  const timeReportQuery = useQuery({
    queryKey: ["timeReport", filters.filter, filters.from, filters.to],
    queryFn: () =>
      getTimeReport({
        filter: filters.filter,
        from: filters.from,
        to: filters.to,
      }).then((res) => res.data),
  });

  return (
    <div className="performance-page p-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Performance Overview</h1>
      </div>

      {/* Filters */}
      <FiltersPanel filters={filters} onChange={setFilters} />

      {/* KPIs */}
      <StatsSummary
        userPerf={userPerfQuery.data}
        timeReport={timeReportQuery.data}
      />

      {/* Charts Row */}
      <div className="charts-row grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <SkillGapChart
          data={skillGapQuery.data}
          isLoading={skillGapQuery.isLoading}
        />
        <ScoreTrendChart
          data={timeReportQuery.data}
          isLoading={timeReportQuery.isLoading}
        />
      </div>

      {/* Detailed Table */}
      <PerformanceTable
        data={userPerfQuery.data}
        isLoading={userPerfQuery.isLoading}
        page={filters.page}
        limit={filters.limit}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />
    </div>
  );
}
