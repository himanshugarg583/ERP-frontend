import React from "react";
import { getDashboardByKey } from "../../utils/dashboardCatalog";
import RoleDashboardTemplate from "./RoleDashboardTemplate";

const HRDashboard = () => {
  const dashboard = getDashboardByKey("hr-dashboard");

  return (
    <RoleDashboardTemplate
      title={dashboard?.label || "HR Dashboard"}
      subtitle="Centralize teacher staffing, credentials, salary, and HR insights."
      modules={dashboard?.modules || []}
    />
  );
};

export default HRDashboard;
