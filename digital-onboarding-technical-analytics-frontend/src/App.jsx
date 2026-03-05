import { useMemo, useCallback, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { fetchDashboard } from "./api/dashboardApi";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import { useTimeFilter } from "./hooks/useTimeFilter";
import ObservabilityHeader from "./components/ObservabilityHeader";
import {
  ObservabilityHeaderProvider,
  useObservabilityHeader,
} from "./context/ObservabilityHeaderContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import KpiMetricCards from "./components/KpiMetricCards";
import HealthDonut from "./components/HealthDonut";
import BusinessJourneys from "./components/BusinessJourneys";
import ServiceGrid from "./components/ServiceGrid";
import Overview from "./pages/Overview";
import JourneysPage from "./pages/JourneysPage";
import ServicesPage from "./pages/ServicesPage";
import ApiExplorerPage from "./pages/ApiExplorerPage";
import AlertsPage from "./pages/AlertsPage";
import UnderMaintenance from "./pages/UnderMaintenance";
import ServiceDrilldownPage from "./pages/ServiceDrilldownPage";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  return (
    <ThemeProvider>
      <ObservabilityHeaderProvider>
        <div className="appRoot">
          <ObservabilityHeader />

          <main className="content">
            <Routes>
              <Route path="/" element={<DashboardWrapper />} />
              <Route
                path="/techops/journey/:journeyName"
                element={<Overview />}
              />
              <Route path="/pages/journeys" element={<JourneysPage />} />
              <Route path="/pages/services" element={<ServicesPage />} />
              <Route
                path="/pages/api-explorer"
                element={<ApiExplorerPage />}
              />
              <Route path="/pages/alerts" element={<AlertsPage />} />
              <Route
                path="/techops/service/:name"
                element={<ServiceDrilldownPage />}
              />
              <Route
                path="/techops/drilldown/:type/:name"
                element={<UnderMaintenance />}
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </ObservabilityHeaderProvider>
    </ThemeProvider>
  );
}

function DashboardWrapper() {
  const { getTimeRange } = useTimeFilter();

  const refreshData = useCallback(() => {
    const { durationMs } = getTimeRange();

    // Convert milliseconds → hours (minimum 1 hour)
    const windowHours = Math.max(
      1,
      Math.round(durationMs / (1000 * 60 * 60))
    );

    return fetchDashboard(windowHours);
  }, [getTimeRange]);

  const autoRefreshDeps = useMemo(() => [refreshData], [refreshData]);

  const { data, loading, error } = useAutoRefresh(
    refreshData,
    300000,
    autoRefreshDeps
  );

  const { setIsConnected } = useObservabilityHeader();

  useEffect(() => {
    if (!loading) {
      setIsConnected(data?.source === "live" && !!data && !error);
    }
  }, [data, loading, error, setIsConnected]);

  const jh = data?.journeyHealth;

  const donutData = useMemo(
    () => ({
      stableJourneys: jh?.stable || 0,
      degradedJourneys: jh?.degraded || 0,
      criticalJourneys: jh?.critical || 0,
      healthPercentage: jh?.percentage || 0,
    }),
    [jh]
  );

  if (loading)
    return <div className="loading">Loading dashboard...</div>;

  if (!loading && error)
    return <div className="loading error">{error}</div>;

  return (
    <>
      <div id="overview" className="dashboard-layout">
        <div className="layout-left">
          <HealthDonut data={donutData} />
        </div>

        <div className="layout-right">
          {data?.kpis && <KpiMetricCards kpis={data.kpis} />}
        </div>
      </div>

      {data?.journeyCategories && (
        <section id="journeys" className="dashboard-section">
          <BusinessJourneys categories={data.journeyCategories} />
        </section>
      )}

      {data?.services && (
        <section id="services" className="dashboard-section">
          <ServiceGrid services={data.services} />
        </section>
      )}

      <section id="alerts" className="dashboard-section">
        {/* Alert section placeholder */}
      </section>
    </>
  );
}