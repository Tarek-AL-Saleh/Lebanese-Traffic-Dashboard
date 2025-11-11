import { useState, useEffect } from "react";
import { fetchTrafficData, processTrafficData } from "./utils/dataUtils";
import DataTable from "./components/DataTable";
import Filters from "./components/Filters";
import Histogram from "./components/Histogram";
import Statistics from "./components/Statistics";

export default function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "2015-01-01",
    endDate: "2019-12-31",
    VelocityMin: 0,
    VelocityMax: 200,
  });

  useEffect(() => {
    async function loadData() {
      const raw = await fetchTrafficData();
      const processed = processTrafficData(raw).slice(0, 100);
      setData(processed);
      setFilteredData(processed);
    }
    loadData();
  }, []);

  const applyFilters = () => {
    const filtered = data.filter((row) => {
      const rowDate = new Date(row.timestamp);
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      const velocity = row.speed;

      return rowDate >= start && rowDate <= end && velocity >= filters.VelocityMin && velocity <= filters.VelocityMax;
    });
    setFilteredData(filtered);
  };

  // Stats
  const numbers = filteredData.map((r) => r.speed).filter((v) => !isNaN(v));
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const avg = (numbers.reduce((a, b) => a + b, 0) / numbers.length || 0).toFixed(2);

  return (
    <div>
      <Filters applyFilters={applyFilters} filters={filters} setFilters={setFilters} />
      <Statistics min={min} max={max} avg={avg} />
      <Histogram filteredData={filteredData} />
      <DataTable filteredData={filteredData} />
    </div>
  );
}
