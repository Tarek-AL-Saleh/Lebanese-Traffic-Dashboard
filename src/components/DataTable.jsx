export default function DataTable({ data }) {
  if (!data.length) return <div>No data to display</div>;
  
  return (
    <table border={1} cellPadding={5} style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          {Object.keys(data[0]).map(k => <th key={k}>{k}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {Object.keys(row).map(k => (
              <td key={k}>
                {row[k] instanceof Date ? row[k].toLocaleString() : row[k]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
