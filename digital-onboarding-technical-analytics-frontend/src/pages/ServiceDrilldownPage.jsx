import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServiceHeader from "../components/ServiceDrilldown/ServiceHeader";
import ApiEndpoint from "../components/ServiceDrilldown/ApiEndpoint";
import BusinessImpact from "../components/ServiceDrilldown/BusinessImpact";
import "./ServiceDrilldownPage.css";

const metricsTemplate = [
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

const businessImpactTemplate = {
  potentialLoss: "$4.2k potential loss/hr",
  subtitle: "Real-time correlation of service health to business metrics",
  journeys: [
    {
      name: "Credit Card Application",
      usersAffected: 842,
      impact: 22
    },
    {
      name: "Loan Processing Journey",
      usersAffected: 156,
      impact: 5
    }
  ]
};

function normalizeName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function toPathSlug(name) {
  return String(name || "service").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function ServiceDrilldownPage() {
  const navigate = useNavigate();
  const { name } = useParams();
  const routeParam = decodeURIComponent(name || "");

  const [service, setService] = useState({ id: routeParam, name: routeParam || "Service" });

  useEffect(() => {
    let isMounted = true;

    fetch("/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load data.json (${response.status})`);
        }
        return response.json();
      })
      .then((payload) => {
        if (!isMounted) {
          return;
        }

        const services = Array.isArray(payload?.services) ? payload.services : [];
        const serviceMatch = services.find((entry) => {
          const normalizedId = normalizeName(entry?.id);
          const normalizedName = normalizeName(entry?.name);
          const normalizedRoute = normalizeName(routeParam);
          return (
            normalizedId === normalizedRoute ||
            normalizedName === normalizedRoute ||
            toPathSlug(entry?.id) === routeParam.toLowerCase() ||
            toPathSlug(entry?.name) === routeParam.toLowerCase()
          );
        });

        if (serviceMatch) {
          setService({ id: serviceMatch.id, name: serviceMatch.name });
        }
      })
      .catch(() => {
        // Intentionally keep fallback service values when data fetch fails.
      });

    return () => {
      isMounted = false;
    };
  }, [routeParam]);

  const headerData = useMemo(
    () => ({
      overline: `${service.id} Service Details`,
      title: `${service.name} Service Health`,
      subtitle: `Current operational status for ${service.name}`,
      metrics: metricsTemplate,
      incidents: incidentsTemplate.map((incident) => ({
        ...incident,
        impacted: incident.impacted.replaceAll("{service}", toPathSlug(service.id))
      }))
    }),
    [service.id, service.name]
  );

  const endpointData = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, idx) => ({
        method: "POST",
        endpoint: `/api/v1/${toPathSlug(service.id)}/${idx % 2 === 0 ? "activate" : "issue"}`,
        traffic: 620,
        p50: "450ms",
        p95: "1,200ms",
        rate5xx: "2.1 %",
        success: "97.9 %"
      })),
    [service.id]
  );

  return (
    <div className="service-drilldown-page">
      <div className="service-drilldown-toolbar">
        <button className="service-drilldown-back" onClick={() => navigate(-1)}>
          ← Back to Service Grid
        </button>
        <span className="service-drilldown-live">Live Monitoring</span>
      </div>

      <ServiceHeader serviceName={service.name} data={headerData} />
      <ApiEndpoint endpoints={endpointData} />
      <BusinessImpact data={businessImpactTemplate} />
    </div>
  );
}
