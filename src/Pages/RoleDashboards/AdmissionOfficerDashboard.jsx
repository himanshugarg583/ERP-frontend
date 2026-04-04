import React from "react";
import { getDashboardByKey } from "../../utils/dashboardCatalog";
import RoleDashboardTemplate from "./RoleDashboardTemplate";

const AdmissionOfficerDashboard = () => {
  const dashboard = getDashboardByKey("admission-officer");

  return (
    <RoleDashboardTemplate
      title={dashboard?.label || "Admission Officer"}
      subtitle="Track enquiries, streamline admissions, and monitor intake performance."
      modules={dashboard?.modules || []}
    />
  );
};

export default AdmissionOfficerDashboard;
