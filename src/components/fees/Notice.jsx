import React from "react";

const Notice = ({ tabletitle, Product_Data, title1, title2, title3, title4 }) => (
  <div style={{ padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #eee' }}>
    <h2 style={{ fontWeight: 600, marginBottom: 16 }}>{tabletitle || "Notice Table"}</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>{title1 || "Column 1"}</th>
          <th>{title2 || "Column 2"}</th>
          <th>{title3 || "Column 3"}</th>
          <th>{title4 || "Column 4"}</th>
        </tr>
      </thead>
      <tbody>
        {(Product_Data || []).map((row, idx) => (
          <tr key={idx}>
            <td>{row[title1?.toLowerCase()] || "-"}</td>
            <td>{row[title2?.toLowerCase()] || "-"}</td>
            <td>{row[title3?.toLowerCase()] || "-"}</td>
            <td>{row[title4?.toLowerCase()] || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Notice;
