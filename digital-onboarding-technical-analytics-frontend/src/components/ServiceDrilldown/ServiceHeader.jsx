import "./ServiceHeader.css";

export default function ServiceHeader({ serviceName, data }) {
  return (
    <>
      <section className="service-header-banner">
        <p className="service-header-overline">{data.overline}</p>
        <h1>{data.title}</h1>
        <p className="service-header-subtitle">{data.subtitle}</p>
      </section>

      <section className="service-header-metrics">
        {data.metrics.map((metric) => (
          <article key={metric.label} className="service-metric-card">
            <p>{metric.label}</p>
            <h2>{metric.value}</h2>
          </article>
        ))}
      </section>

      <section className="service-header-incidents">
        <div className="service-header-title-row">
          <h3>Active Incidents</h3>
          <button>View All Incidents</button>
        </div>

        {data.incidents.map((incident) => (
          <article key={`${incident.severity}-${incident.title}`} className={`service-incident-row ${incident.tone}`}>
            <div>
              <div className="service-incident-headline">
                <span>{incident.severity}</span>
                <strong>
                  {serviceName} {incident.title}
                </strong>
                <small>{incident.time}</small>
              </div>
              <p>{incident.impacted}</p>
            </div>
            <button>View Logs</button>
          </article>
        ))}
      </section>
    </>
  );
}
