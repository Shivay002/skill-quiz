import { useEffect, useState } from "react";

export default function FiltersPanel({ filters, onChange }) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync local state if parent changes it externally
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounce: wait before firing onChange to parent
  useEffect(() => {
    const handler = setTimeout(() => {
      // Anytime a filter changes → reset pagination
      onChange({ ...localFilters, page: 1 });
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [localFilters, onChange]);

  const handleChange = (name, value) => {
    setLocalFilters((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "filter" && value !== "custom") {
        updated.from = null;
        updated.to = null;
      }
      return updated;
    });
  };

  return (
    <div className="filters-panel">
      {/* Filter Dropdown */}
      <select
        value={localFilters.filter}
        onChange={(e) => handleChange("filter", e.target.value)}
      >
        <option value="week">Last 7 days</option>
        <option value="month">Last 30 days</option>
        <option value="custom">Custom Range</option>
      </select>

      {/* Date Inputs */}
      {localFilters.filter === "custom" && (
        <>
          <input
            type="date"
            name="from"
            value={localFilters.from || ""}
            onChange={(e) => handleChange("from", e.target.value)}
          />
          <input
            type="date"
            name="to"
            value={localFilters.to || ""}
            onChange={(e) => handleChange("to", e.target.value)}
          />
        </>
      )}
    </div>
  );
}
