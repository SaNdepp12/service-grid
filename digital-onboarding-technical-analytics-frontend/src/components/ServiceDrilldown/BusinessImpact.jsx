import "./BusinessImpact.css";

export default function BusinessImpact({ data }) {
  return (
    <section className="business-impact-section">
      <div className="business-impact-title-row">
        <div>
          <h3>Business Impact</h3>
          <p>{data.subtitle}</p>
        </div>
        <span>{data.potentialLoss}</span>
      </div>

      {data.journeys.map((journey) => (
        <div key={journey.name} className="business-impact-row">
          <div>
            <strong>{journey.name}</strong>
            <div className="business-impact-bar">
              <div style={{ width: `${journey.impact}%` }} />
            </div>
          </div>
          <p>
            <strong>{journey.usersAffected} users affected</strong>
            <br />
            Impact: {journey.impact}%
          </p>
        </div>
      ))}
    </section>
  );
}
