import React from "react";
import AdminModulePage from "./AdminModulePage";

const InventoryModulePage = () => {
  return (
    <AdminModulePage
      title="Inventory Module"
      description="Track assets, stock movement, and inventory availability for school operations."
      links={[{ name: "Staff Inventory Dashboard", path: "/StaffDashboard" }]}
    />
  );
};

export default InventoryModulePage;
