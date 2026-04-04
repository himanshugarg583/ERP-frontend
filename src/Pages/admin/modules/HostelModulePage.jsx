import React from "react";
import AdminModulePage from "./AdminModulePage";

const HostelModulePage = () => {
  return (
    <AdminModulePage
      title="Hostel Module"
      description="Monitor room allocation, student residency, discipline, and day-to-day hostel administration."
      links={[{ name: "Hostel Warden Dashboard", path: "/hostel-warden/dashboard" }]}
    />
  );
};

export default HostelModulePage;
