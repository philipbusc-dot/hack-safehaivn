import CountryReportPage from "../pages/CountryReportPage";

export const countryReportRoutes = [
  {
    // Reachable only via the "See all" link on the map's country panel.
    path: "reports/:countryCode",
    element: <CountryReportPage />,
  },
];
