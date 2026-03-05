import "./KpiMetricCards.css";
import { useNavigate } from "react-router-dom";

const formatCompact = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
};

const formatPct = (n, digits = 2) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return `${v.toFixed(digits)}%`;
};

const formatMs = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return `${Math.round(v)} ms`;
};

const getTone = (value, { amber, red, higherIsWorse = true }) => {
  const v = Number(value);
  if (!Number.isFinite(v)) return "neutral";

  if (higherIsWorse) {
    if (v >= red) return "red";
    if (v >= amber) return "amber";
    return "green";
  }

  // higher is better
  if (v <= red) return "red";
  if (v <= amber) return "amber";
  return "green";
};
const splitTrend = (text = "") => {
  const trimmed = String(text).trim();
  if (!trimmed) return { highlight: "", rest: "" };
  const firstSpace = trimmed.indexOf(" ");
  if (firstSpace === -1) return { highlight: trimmed, rest: "" };
  return {
    highlight: trimmed.slice(0, firstSpace),
    rest: trimmed.slice(firstSpace + 1),
  };
};

function TrendLine({ direction = "down", text = "", kind = "good" }) {
  const { highlight, rest } = splitTrend(text);
  const cls = kind === "bad" ? "bad" : "good";

  return (
    <div className="kpiTrend">
      <span className={`kpiArrow ${cls}`} aria-hidden>
        {direction === "up" ? "↑" : "↓"}
      </span>

      {highlight && <span className={`kpiTrendHi ${cls}`}>{highlight}</span>}
      {rest && <span className="kpiTrendRest">{rest}</span>}
    </div>
  );
}

function KpiCard({ title, value, tone = "neutral", trend, onClick }) {
  return (
    <div className={`kpiCard tone-${tone}`} onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="kpiTitle">{title}</div>
      <div className="kpiValue">{value}</div>
      {trend && (
        <TrendLine
          direction={trend.direction}
          text={trend.text}
          kind={trend.kind}
        />
      )}
    </div>
  );
}
export default function KpiMetricCards({ kpis }) {
  const navigate = useNavigate();
  const tr = kpis?.totalRequests;
  const lat = kpis?.p95Latency;
  const e5 = kpis?.error5xx;
  const e4 = kpis?.error4xx;

  // --- Trend builders (AC2) ---
  const trendFromDeltaPct = (deltaPct, label, higherIsBad = false) => {
    const d = Number(deltaPct);
    if (!Number.isFinite(d)) return { direction: "down", text: label || "", kind: "good" };

    const direction = d > 0 ? "up" : "down";
    const absText = `${Math.abs(d).toFixed(1)}% ${label || ""}`.trim();

    // if higher is bad (errors), an UP delta is bad
    const kind = higherIsBad ? (direction === "up" ? "bad" : "good") : "good";

    return { direction, text: absText, kind };
  };

  const trendFromDeltaMs = (deltaMs, label) => {
    const d = Number(deltaMs);
    if (!Number.isFinite(d)) return { direction: "down", text: label || "", kind: "good" };

    // latency: increase is bad
    const direction = d > 0 ? "up" : "down";
    const absText = `${Math.abs(Math.round(d))}ms ${label || ""}`.trim();
    const kind = direction === "up" ? "bad" : "good";

    return { direction, text: absText, kind };
  };

  // --- Colors (AC3) ---
  // Change thresholds to match final business rules
  const latencyTone = getTone(lat?.value, { amber: 200, red: 350, higherIsWorse: true });
  const err5Tone = getTone(e5?.value, { amber: 0.2, red: 0.5, higherIsWorse: true });
  const err4Tone = getTone(e4?.value, { amber: 2.0, red: 4.0, higherIsWorse: true });

  return (
    <section className="kpiGrid" aria-label="KPI metrics">
      <KpiCard
        title="Total Requests"
        value={formatCompact(tr?.value)}
        tone="neutral"
        trend={trendFromDeltaPct(tr?.deltaPct, tr?.compareLabel || "vs Yesterday")}
        onClick={() => navigate("/techops/drilldown/kpi/total-requests")}
      />

      <KpiCard
        title="Avg P95 Latency"
        value={formatMs(lat?.value)}
        tone={latencyTone}
        trend={trendFromDeltaMs(lat?.deltaMs, lat?.compareLabel || "improvement")}
        onClick={() => navigate("/techops/drilldown/kpi/avg-p95-latency")}
      />

      <KpiCard
        title="5xx Error Rate"
        value={formatPct(e5?.value, 2)}
        tone={err5Tone}
        trend={trendFromDeltaPct(e5?.deltaPct, e5?.compareLabel || "from baseline", true)}
        onClick={() => navigate("/techops/drilldown/kpi/5xx-error-rate")}
      />

      <KpiCard
        title="4xx Error Rate"
        value={formatPct(e4?.value, 2)}
        tone={err4Tone}
        trend={trendFromDeltaPct(e4?.deltaPct, e4?.compareLabel || "improved", true)}
        onClick={() => navigate("/techops/drilldown/kpi/4xx-error-rate")}
      />
    </section>
  );
}
