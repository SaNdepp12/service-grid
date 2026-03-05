# Project Context: Journey Analytics Frontend

## 1. Project Overview
This represents the Frontend UI for the **HDFC Bank Journey Analytics Dashboard**. 
It is a React application built with Vite. Its primary purpose is to provide a real-time, high-density, observability-style dashboard that visualizes the stability and performance of various business journeys and backend microservices.

## 2. Core Architecture & Routing

- **Framework:** React 18+ (Vite)
- **Routing:** React Router v6
  - `/` (Home): Renders the main `DashboardLayout.jsx` containing `BusinessJourneys`, `KpiMetricCards`, `ServiceGrid`, etc.
  - `/techops/journey/:journeyName`: Renders the `JourneyDetails.jsx` drill-down view for specific business journeys.
- **Styling Strategy (Crucial Context):** 
  - We use **pure vanilla CSS** with zero utility frameworks (no Tailwind). 
  - All styling utilizes centralized CSS variables defined in `/src/App.css` for a comprehensive **Dark / Light mode** toggling system.
  - **Dark Mode** is the primary, premium observation aesthetic requested by the user.

## 3. State Management & Data Flow

- **Theme Context:** A centralized React Context (`ThemeContext.jsx`) manages the global dark/light state, persisting to `localStorage`.
- **API Strategy:**
  - All backend requests route through `/src/api/dashboardApi.js`.
  - The frontend expects to communicate with the FastAPI backend defined at `VITE_API_URL`.
- **The Mock Data Fallback (data.json):**
  - If the backend is unreachable (or for local testing without Kafka/ClickHouse), the app falls back to `public/data.json`.
  - **AI Context Rule:** If you manipulate the backend logic (like altering how failure statuses are calculated), you **MUST** also update the mock structures in `public/data.json` so the frontend doesn't break when running in isolated UI environments.

## 4. Key Components and Design Philosophy

The user expects a highly polished, tight, analytical "Figma-quality" dashboard.
- `BusinessJourneys.jsx`: Maps through the array of journeys. Uses strict CSS grid auto-fit rules.
- `HealthDonut.jsx`: Uses `recharts` to render a PieChart. Its styling is highly specific, utilizing custom drop-shadow SVG filters and tight flex-layouts to match exact Figma spacing specs.
- `Footer.jsx`: Fixed full-width footer matching the `header-bg` color to box in the dashboard.
- `ObservabilityHeader.jsx`: Contains the bank logos, the current localized timestamp, and the Theme Toggle button.

## 5. How the AI/LLM Should Operate In This Codebase

1. **Aesthetics are #1:** The user actively rejects standard bulky web design. Everything must be tight, compact, and resemble a financial trading terminal or advanced observability platform.
2. **Never inline static colors (unless specific to a chart payload).** Always use `var(--bg-card)`, `var(--text-main)`, etc., to ensure the Dark/Light toggle never breaks.
3. **Responsive Grids:** Always use CSS Grid with `repeat(auto-fit, minmax(...))` for lists of cards so they stack gracefully on mobile devices without media query clutter.
4. **Data Mutability:** Do not mutate the backend payloads defensively in the React components. If the data structure is wrong, fix the backend FastAPI responses or the ClickHouse Materialized Views.
