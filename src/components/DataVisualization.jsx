import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function DataVisualization({ data, field }) {
  if (!field) return <p>Select a field to see chart</p>;
  const chartData = data.map((row, i) => ({ name: i+1, value: parseFloat(row[field]) }));
  return (
    <BarChart width={600} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
}
