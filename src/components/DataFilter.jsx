import { useState } from 'react';

export default function DataFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    VelocityMin: 0,
    VelocityMax: 200,
    CourseMin: 0,
    CourseMax: 360
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value !== '' ? Number(value) : undefined }));
  };

  const applyFilters = () => onFilterChange(filters);

  return (
    <div style={{ marginBottom: '1em' }}>
      <h3>Filter by Range</h3>

      <div>
        <label>Velocity Min:</label>
        <input type="number" name="VelocityMin" value={filters.VelocityMin} onChange={handleChange} />
        <label>Max:</label>
        <input type="number" name="VelocityMax" value={filters.VelocityMax} onChange={handleChange} />
      </div>

      <div>
        <label>Course Min:</label>
        <input type="number" name="CourseMin" value={filters.CourseMin} onChange={handleChange} />
        <label>Max:</label>
        <input type="number" name="CourseMax" value={filters.CourseMax} onChange={handleChange} />
      </div>

      <button onClick={applyFilters}>Apply Filter</button>
    </div>
  );
}
