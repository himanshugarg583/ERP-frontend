import React from "react";
import { getDashboardByKey } from "../../utils/dashboardCatalog";
import RoleDashboardTemplate from "./RoleDashboardTemplate";

const TransportManagerDashboard = () => {
  const dashboard = getDashboardByKey("transport-manager");

  return (
    <RoleDashboardTemplate
      title={dashboard?.label || "Transport Manager"}
      subtitle="Oversee route operations, role coordination, and transport service quality."
      modules={dashboard?.modules || []}
    />
  );
};

export default TransportManagerDashboard;
