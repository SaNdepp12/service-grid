import "./ApiEndpoint.css";

export default function ApiEndpoint({ endpoints }) {
  return (
    <section className="api-endpoint-section">
      <div className="api-endpoint-title-row">
        <h3>API Endpoints</h3>
        <input readOnly value="Search Endpoints" />
      </div>
      <div className="api-endpoint-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Traffic (RPM)</th>
              <th>P50</th>
              <th>P95</th>
              <th>5XX Rate</th>
              <th>Success Ratio</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((row, index) => (
              <tr key={`${row.endpoint}-${index}`}>
                <td>
                  <span className="method-pill">{row.method}</span>
                </td>
                <td>{row.endpoint}</td>
                <td>{row.traffic}</td>
                <td>{row.p50}</td>
                <td>{row.p95}</td>
                <td>{row.rate5xx}</td>
                <td>
                  {row.success}
                  <div className="success-line" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
