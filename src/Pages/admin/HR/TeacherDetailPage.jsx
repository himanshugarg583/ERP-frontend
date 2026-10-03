import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileDetail from "../../../components/profile/ProfileDetail";
import { ArrowLeft, Mail, Phone, MapPin, User } from "lucide-react";
import { getTeacherById } from "../../../helper/requests-method/apiMethods";

const valueOrNA = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  return String(value);
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return valueOrNA(value);
  return parsed.toLocaleDateString("en-GB");
};

const TeacherDetailPage = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetch = async () => {
      if (!teacherId) return;
      try {
        const res = await getTeacherById(teacherId);
        setTeacher(res?.data || res);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [teacherId]);

  const name = useMemo(() => teacher?.name || teacher?.teacherDetails?.name || "Teacher", [teacher]);
  const classInfo = teacher?.teacherDetails?.class_name || teacher?.class_name || "";

  const profileFields = [
    { label: "Teacher ID", value: teacher?.teacher_id || teacher?.id },
    { label: "Qualification", value: teacher?.teacherDetails?.qualification },
    { label: "Experience", value: teacher?.teacherDetails?.experience },
    { label: "Gender", value: teacher?.teacherDetails?.gender || teacher?.gender },
    { label: "DOB", value: formatDate(teacher?.teacherDetails?.dob) },
    { label: "Joining Date", value: formatDate(teacher?.teacherDetails?.joining_date) },
  ];

  const documents = Array.isArray(teacher?.documents) ? teacher.documents : [];

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "payroll", label: "Payroll" },
    { key: "leaves", label: "Leaves" },
    { key: "attendance", label: "Attendance" },
    { key: "library", label: "Library" },
    { key: "documents", label: "Documents" },
  ];

  const renderProfileTab = () => (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
          <h3 className="text-sm font-semibold text-slate-700">Profile Details</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 py-4">
          {profileFields.map((item) => (
            <div key={item.label} className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">{item.label}</span>
              <span className="text-sm text-slate-900 font-semibold">{valueOrNA(item.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <h3 className="text-sm font-semibold text-slate-700">Documents</h3>
      </div>
      {documents.length === 0 ? (
        <div className="px-4 py-5 text-sm text-slate-500">No documents uploaded.</div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Document</th>
                <th className="text-left px-4 py-3 font-semibold">Type</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc, index) => (
                <tr key={doc?.id || index}>
                  <td className="px-4 py-3">{valueOrNA(doc?.name || doc?.title)}</td>
                  <td className="px-4 py-3">{valueOrNA(doc?.type || doc?.document_type)}</td>
                  <td className="px-4 py-3">{valueOrNA(doc?.status || doc?.verification_status)}</td>
                  <td className="px-4 py-3">{formatDate(doc?.uploaded_at || doc?.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "documents":
        return renderDocumentsTab();
      default:
        return <div className="bg-white rounded-xl p-6">No data for this tab.</div>;
    }
  };

  return (
    <ProfileDetail
      breadcrumb="Human Resource / Staff Profile"
      title={name}
      name={name}
      subtitle={classInfo}
      imageUrl={teacher?.teacherDetails?.image}
      summaryFields={profileFields}
      contactFields={[
        { label: "Email", value: teacher?.email },
        { label: "Phone", value: teacher?.teacherDetails?.mobile || teacher?.phone },
        { label: "Address", value: teacher?.teacherDetails?.currentaddress || teacher?.currentaddress },
      ]}
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      renderTabContent={renderTabContent}
    />
  );
};

export default TeacherDetailPage;
