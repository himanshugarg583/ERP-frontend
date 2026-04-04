import React from "react";
import { getDashboardByKey } from "../../utils/dashboardCatalog";
import RoleDashboardTemplate from "./RoleDashboardTemplate";

const HostelWardenDashboard = () => {
  const dashboard = getDashboardByKey("hostel-warden");

  return (
    <RoleDashboardTemplate
      title={dashboard?.label || "Hostel Warden"}
      subtitle="Manage resident life-cycle, discipline, welfare, and daily hostel operations."
      modules={dashboard?.modules || []}
    />
  );
};

export default HostelWardenDashboard;
