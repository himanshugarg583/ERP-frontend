import React from "react";
import AdminModulePage from "./AdminModulePage";

const LibraryModulePage = () => {
  return (
    <AdminModulePage
      title="Library Module"
      description="Access library operations including catalog, issue-return, and reporting."
      links={[{ name: "Librarian Dashboard", path: "/LibraryDashboard" }]}
    />
  );
};

export default LibraryModulePage;
