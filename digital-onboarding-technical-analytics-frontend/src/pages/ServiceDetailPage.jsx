import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ServiceDetailPage.css";

const metricTemplate = [
  { label: "Uptime (24h)", value: "94.1 %" },
  { label: "P95 Latency", value: "1,200 ms" },
  { label: "5xx Error", value: "5.8 %" },
  { label: "4xx Error", value: "0.8 %" },
  { label: "Throughput", value: "2.4k req/s" }
];

const incidentsTemplate = [
  {
    severity: "P1 Critical",
    title: "5xx spike (5.8%)",
    impacted: "Impacted: /api/v1/{service}/issue",
    time: "2 min ago",
    tone: "critical"
  },
  {
    severity: "P2 Critical",
    title: "latency degradation (8.8%)",
    impacted: "Impacted: /api/v1/{service}/activate",
    time: "12 min ago",
    tone: "critical"
  },
  {
    severity: "Resolved",
    title: "DB pool exhaustion",
    impacted: "Impacted: /api/v1/{service}/issue",
    time: "yesterday",
    tone: "resolved"
  }
];

const endpointsTemplate = Array.from({ length: 7 }).map((_, idx) => ({
  method: "POST",
  endpoint: `/api/v1/{service}/${idx % 2 === 0 ? "activate" : "issue"}`,
  traffic: 620,
  p50: "450ms",
  p95: "1,200ms",
  rate5xx: "2.1 %",
  success: "97.9 %"
}));

function normalizeName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function toPathSlug(name) {
  return String(name || "service").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function ServiceDetailPage() {
  const navigate = useNavigate();
  const { name } = useParams();
  const serviceId = decodeURIComponent(name || "");

  const [service, setService] = useState({ id: serviceId, name: serviceId, status: "Healthy" });

  useEffect(() => {
    let mounted = true;

    const loadService = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) {
          throw new Error("Unable to load static service data");
        }
        const data = await response.json();
        const services = data?.services || [];
        const selected = services.find((item) => normalizeName(item.id) === normalizeName(serviceId));
        if (mounted && selected) {
          setService(selected);
        }
      } catch (error) {
        console.warn(error);
      }
    };

    loadService();

    return () => {
      mounted = false;
    };
  }, [serviceId]);

  const endpointPrefix = useMemo(() => toPathSlug(service.name), [service.name]);

  const incidents = useMemo(
    () => incidentsTemplate.map((item) => ({ ...item, impacted: item.impacted.replaceAll("{service}", endpointPrefix) })),
    [endpointPrefix]
  );

  const endpoints = useMemo(
    () => endpointsTemplate.map((item) => ({ ...item, endpoint: item.endpoint.replaceAll("{service}", endpointPrefix) })),
    [endpointPrefix]
  );

  return (
    <div className="service-detail-page">
      <div className="service-detail-toolbar">
        <button className="service-detail-back" onClick={() => navigate("/")}>Back to dashboard</button>
        <div className="service-detail-live">• Live</div>
      </div>

      <section className="service-detail-banner">
        <p className="service-detail-overline">{service.id} service</p>
        <h1>{service.name} Service</h1>
        <p className="service-detail-subtitle">Part of card application, loan processing and onboarding journeys</p>
      </section>

      <section className="service-detail-metrics">
        {metricTemplate.map((metric) => (
          <article key={metric.label} className="metric-card">
            <p>{metric.label}</p>
            <h2>{metric.value}</h2>
          </article>
        ))}
      </section>

      <section className="service-detail-incidents">
        <div className="section-title-row">
          <h3>Active incidents</h3>
          <button>View incident history</button>
        </div>
        {incidents.map((incident) => (
          <article key={`${incident.severity}-${incident.title}`} className={`incident-row ${incident.tone}`}>
            <div>
              <div className="incident-headline">
                <span>{incident.severity}</span>
                <strong>{service.name} {incident.title}</strong>
                <small>{incident.time}</small>
              </div>
              <p>{incident.impacted}</p>
            </div>
            <button>View Logs</button>
          </article>
        ))}
      </section>

      <section className="service-detail-endpoints">
        <div className="section-title-row">
          <h3>API Endpoints</h3>
          <input readOnly value="Search Endpoints" />
        </div>
        <div className="endpoint-table-wrap">
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
                  <td><span className="method-pill">{row.method}</span></td>
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

      <section className="service-detail-impact">
        <div className="section-title-row impact">
          <div>
            <h3>Business Impact</h3>
            <p>Real-time correlation of service health to business metrics</p>
          </div>
          <span>$4.2k potential loss/hr</span>
        </div>

        <div className="impact-row">
          <div>
            <strong>Credit Card Application</strong>
            <div className="impact-bar"><div style={{ width: "22%" }} /></div>
          </div>
          <p><strong>842 users affected</strong><br />Impact: 22%</p>
        </div>

        <div className="impact-row">
          <div>
            <strong>Loan Processing Journey</strong>
            <div className="impact-bar"><div style={{ width: "5%" }} /></div>
          </div>
          <p><strong>156 users affected</strong><br />Impact: 5%</p>
        </div>
      </section>
    </div>
  );
}
