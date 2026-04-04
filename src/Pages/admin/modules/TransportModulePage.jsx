import React from "react";
import AdminModulePage from "./AdminModulePage";

const TransportModulePage = () => {
  return (
    <AdminModulePage
      title="Transport Module"
      description="Manage routes, vehicles, drivers, and transport operations from one place."
      links={[{ name: "Transport Manager Dashboard", path: "/transport-manager/dashboard" }]}
    />
  );
};

export default TransportModulePage;
