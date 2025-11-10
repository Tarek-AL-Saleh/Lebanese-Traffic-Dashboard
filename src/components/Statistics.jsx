export default function Statistics({ data, field }) {
  if (!field || !data.length) return <div>No stats available</div>;

  const numbers = data.map(row => parseFloat(row[field])).filter(v => !isNaN(v));
  if (!numbers.length) return <div>No numeric data for {field}</div>;

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const avg = (numbers.reduce((a,b)=>a+b,0)/numbers.length).toFixed(2);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Statistics for "{field}"</h3>
      <p>Min: {min}</p>
      <p>Max: {max}</p>
      <p>Average: {avg}</p>
    </div>
  );
}
