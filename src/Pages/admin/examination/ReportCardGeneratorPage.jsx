import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import {
  getExamTermDropdown,
  getExamDropdown,
  getExamScheduleByExam,
  getClassSectionDropdown,
  getAllStudentsByClass,
  getPublishedResultsByExamTypes,
  getPublishedResultsByEventStudents,
  generateExamDocument,
} from "../../../helper/requests-method/apiMethods";
import { toast } from "react-toastify";
import { buildReportTemplateDocument } from "../../../templates/reportCardTemplate";

const REPORT_TABS = {
  TERM_WISE: "term-wise",
  EXAM_WISE: "exam-wise",
};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const extractClassKey = (classItem) => classItem?.id ?? classItem?.class_section_id ?? null;

const getClassLabel = (classItem) => {
  if (!classItem) return "N/A";
  const className = classItem.class_name || classItem.class || "Class";
  const sectionName = classItem.section_name || classItem.section || "";
  return `${className}${sectionName ? ` - ${sectionName}` : ""}`;
};

const getTermLabel = (term) => term?.term_name || term?.name || term?.title || "Term";

const getTermKey = (term) => String(term?.id || term?.term_id || term?.uuid || "");

const getExamLabel = (exam) => exam?.exam_name || exam?.name || exam?.title || "Exam";

const getStudentId = (student) => student?.id ?? student?.student_id ?? null;

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : String(value);
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeStudents = (students) => {
  return normalizeArray(students).map((student) => ({
    ...student,
    id: student?.id ?? student?.student_id ?? null,
    student_name: student?.student_name || student?.name || "N/A",
    roll_number: student?.roll_number || student?.roll_no || student?.rollNo || "N/A",
    admission_number:
      student?.admission_number || student?.admission_no || student?.admissionNo || "N/A",
  }));
};

const ReportCardGeneratorPage = () => {
  const [activeTab, setActiveTab] = useState(REPORT_TABS.TERM_WISE);

  const [examTerms, setExamTerms] = useState([]);
  const [classes, setClasses] = useState([]);

  const [termWiseTermIds, setTermWiseTermIds] = useState([]);
  const [termWiseClassId, setTermWiseClassId] = useState("");
  const [termWiseExamCount, setTermWiseExamCount] = useState(0);
  const [termWiseEventIds, setTermWiseEventIds] = useState([]);

  const [examWiseTermId, setExamWiseTermId] = useState("");
  const [examWiseExamId, setExamWiseExamId] = useState("");
  const [examWiseClassId, setExamWiseClassId] = useState("");
  const [examWiseExams, setExamWiseExams] = useState([]);
  const [examWiseEventIds, setExamWiseEventIds] = useState([]);

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [previewReport, setPreviewReport] = useState(null);
  const [downloadingDocumentId, setDownloadingDocumentId] = useState(null);
  const [termSearchQuery, setTermSearchQuery] = useState("");
  const [termDropdownOpen, setTermDropdownOpen] = useState(false);
  const termDropdownRef = useRef(null);

  const [initialLoading, setInitialLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [termWiseLoading, setTermWiseLoading] = useState(false);
  const [examWiseLoading, setExamWiseLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const loadInitialDropdowns = async () => {
      try {
        setInitialLoading(true);
        const [termsResp, classesResp] = await Promise.all([
          getExamTermDropdown(),
          getClassSectionDropdown(),
        ]);
        setExamTerms(normalizeArray(termsResp?.data));
        setClasses(normalizeArray(classesResp?.data));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load report card filters");
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialDropdowns();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (termDropdownRef.current && !termDropdownRef.current.contains(event.target)) {
        setTermDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (activeTab !== REPORT_TABS.TERM_WISE) {
      setTermDropdownOpen(false);
    }
  }, [activeTab]);

  const loadEventsForExamIds = async (examIds = []) => {
    const validIds = normalizeArray(examIds).filter(Boolean);
    if (!validIds.length) return [];

    const scheduleResponses = await Promise.all(validIds.map((id) => getExamScheduleByExam(id)));
    const allEntries = scheduleResponses.flatMap((resp) => normalizeArray(resp?.data));

    const eventIdSet = new Set(
      allEntries
        .map((entry) => Number(entry.exam_event_id ?? entry.id ?? entry.exam_schedule_id ?? entry.uuid))
        .filter((id) => Number.isFinite(id) && id > 0)
    );

    return Array.from(eventIdSet);
  };

  const handleTermWiseTermChange = async (termIds) => {
    const normalizedTermIds = normalizeArray(termIds).map((id) => String(id)).filter(Boolean);
    setTermWiseTermIds(normalizedTermIds);
    setTermWiseEventIds([]);
    setTermWiseExamCount(0);
    setStudents([]);
    setSelectedStudents([]);
    setPreviewReport(null);

    if (!normalizedTermIds.length) return;

    try {
      setTermWiseLoading(true);
      const examResponses = await Promise.all(normalizedTermIds.map((termId) => getExamDropdown(termId)));

      const allTermExams = examResponses.flatMap((resp) => normalizeArray(resp?.data));
      const uniqueExamsById = new Map();

      allTermExams.forEach((exam) => {
        const examKey = String(exam?.id || exam?.exam_id || exam?.uuid || "");
        if (examKey) {
          uniqueExamsById.set(examKey, exam);
        }
      });

      const uniqueTermExams = Array.from(uniqueExamsById.values());
      setTermWiseExamCount(uniqueTermExams.length);

      const examIds = uniqueTermExams.map((exam) => exam.id || exam.exam_id || exam.uuid).filter(Boolean);
      const eventIds = await loadEventsForExamIds(examIds);
      setTermWiseEventIds(eventIds);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load term-wise report data");
    } finally {
      setTermWiseLoading(false);
    }
  };

  const handleExamWiseTermChange = async (termId) => {
    const normalizedTermId = String(termId || "");
    setExamWiseTermId(normalizedTermId);
    setExamWiseExamId("");
    setExamWiseExams([]);
    setExamWiseEventIds([]);
    setStudents([]);
    setSelectedStudents([]);
    setPreviewReport(null);

    if (!normalizedTermId) return;

    try {
      setExamWiseLoading(true);
      const examsResp = await getExamDropdown(normalizedTermId);
      setExamWiseExams(normalizeArray(examsResp?.data));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load exams for selected term");
    } finally {
      setExamWiseLoading(false);
    }
  };

  const handleExamWiseExamChange = async (examId) => {
    const normalizedExamId = String(examId || "");
    setExamWiseExamId(normalizedExamId);
    setExamWiseEventIds([]);
    setStudents([]);
    setSelectedStudents([]);
    setPreviewReport(null);

    if (!normalizedExamId) return;

    try {
      setExamWiseLoading(true);
      const eventIds = await loadEventsForExamIds([normalizedExamId]);
      setExamWiseEventIds(eventIds);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load exam-wise schedule entries");
    } finally {
      setExamWiseLoading(false);
    }
  };

  const currentClassId = activeTab === REPORT_TABS.TERM_WISE ? termWiseClassId : examWiseClassId;

  const currentExamTypeIds = useMemo(() => {
    if (activeTab === REPORT_TABS.TERM_WISE) {
      return termWiseTermIds
        .map((termId) => Number(termId))
        .filter((termId) => Number.isFinite(termId) && termId > 0);
    }

    const numericTermId = Number(examWiseTermId);
    return Number.isFinite(numericTermId) && numericTermId > 0 ? [numericTermId] : [];
  }, [activeTab, termWiseTermIds, examWiseTermId]);

  const filteredTermOptions = useMemo(() => {
    const query = termSearchQuery.trim().toLowerCase();
    if (!query) return examTerms;
    return examTerms.filter((term) => getTermLabel(term).toLowerCase().includes(query));
  }, [examTerms, termSearchQuery]);

  const selectedTermText = useMemo(() => {
    if (!termWiseTermIds.length) return "Select terms";

    const selectedLabels = examTerms
      .filter((term) => termWiseTermIds.includes(getTermKey(term)))
      .map((term) => getTermLabel(term));

    if (!selectedLabels.length) return "Select terms";
    if (selectedLabels.length <= 2) return selectedLabels.join(", ");
    return `${selectedLabels.slice(0, 2).join(", ")} +${selectedLabels.length - 2} more`;
  }, [examTerms, termWiseTermIds]);

  const allFilteredTermIds = useMemo(
    () => filteredTermOptions.map((term) => getTermKey(term)).filter(Boolean),
    [filteredTermOptions]
  );

  const allFilteredSelected =
    allFilteredTermIds.length > 0 && allFilteredTermIds.every((termId) => termWiseTermIds.includes(termId));

  const toggleSingleTermSelection = (termId) => {
    const normalizedTermId = String(termId || "");
    if (!normalizedTermId) return;

    const nextSelected = termWiseTermIds.includes(normalizedTermId)
      ? termWiseTermIds.filter((id) => id !== normalizedTermId)
      : [...termWiseTermIds, normalizedTermId];

    handleTermWiseTermChange(nextSelected);
  };

  const toggleSelectAllFilteredTerms = () => {
    const nextSelected = allFilteredSelected
      ? termWiseTermIds.filter((id) => !allFilteredTermIds.includes(id))
      : Array.from(new Set([...termWiseTermIds, ...allFilteredTermIds]));

    handleTermWiseTermChange(nextSelected);
  };

  const currentEventIds = useMemo(() => {
    return activeTab === REPORT_TABS.TERM_WISE ? termWiseEventIds : examWiseEventIds;
  }, [activeTab, termWiseEventIds, examWiseEventIds]);

  const activeClassInfo = useMemo(() => {
    return classes.find((classItem) => String(extractClassKey(classItem)) === String(currentClassId));
  }, [classes, currentClassId]);

  const fetchStudentsList = async () => {
    if (!currentClassId) {
      toast.warning("Please select class first");
      return;
    }

    try {
      setStudentsLoading(true);
      const classIdForApi =
        activeClassInfo?.class_id ??
        activeClassInfo?.classId ??
        activeClassInfo?.id ??
        activeClassInfo?.class_section_id ??
        currentClassId;

      const response = await getAllStudentsByClass(classIdForApi);
      const studentPayload = normalizeStudents(response?.data);

      setStudents(studentPayload);
      setSelectedStudents([]);
      setPreviewReport(null);

      if (!studentPayload.length) {
        toast.info("No students found for selected class");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch students list");
    } finally {
      setStudentsLoading(false);
    }
  };

  const toggleStudentSelection = (studentId) => {
    if (!studentId) return;
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) return prev.filter((id) => id !== studentId);
      return [...prev, studentId];
    });
  };

  const handleSelectAllStudents = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map((student) => getStudentId(student)).filter(Boolean));
    } else {
      setSelectedStudents([]);
    }
  };

  const generateReportCards = async (studentIdsInput = null) => {
    const targetStudentIds = Array.isArray(studentIdsInput) && studentIdsInput.length
      ? studentIdsInput
      : selectedStudents;
    const targetExamEventId =
      activeTab === REPORT_TABS.EXAM_WISE ? Number(currentEventIds?.[0]) : null;

    if (!currentClassId) {
      toast.warning("Please select class first");
      return;
    }

    if (!currentExamTypeIds.length) {
      toast.warning("Please select term first");
      return;
    }

    if (!currentEventIds.length) {
      toast.warning(
        activeTab === REPORT_TABS.TERM_WISE
          ? "No exam events found for selected term"
          : "No exam schedule found for selected exam"
      );
      return;
    }

    if (!targetStudentIds.length) {
      toast.warning("Please select at least one student");
      return;
    }

    if (
      activeTab === REPORT_TABS.EXAM_WISE &&
      (!Number.isFinite(targetExamEventId) || targetExamEventId <= 0)
    ) {
      toast.warning("No valid exam event found for selected exam");
      return;
    }

    try {
      setGenerating(true);
      let publishedResults = [];

      if (activeTab === REPORT_TABS.EXAM_WISE) {
        const response = await getPublishedResultsByEventStudents({
          examEventId: targetExamEventId,
          studentIds: targetStudentIds,
        });

        const payload = response?.data?.data || response?.data || {};
        const eventInfo = payload?.exam_event || {};
        const matchedTerm = examTerms.find(
          (term) => String(getTermKey(term)) === String(examWiseTermId)
        );

        publishedResults = normalizeArray(payload?.students).map((studentItem) => {
          const resultInfo = studentItem?.result || {};
          return {
            result_id: resultInfo?.result_id,
            student_id: studentItem?.student_id,
            student_name: studentItem?.student_name,
            roll_number: studentItem?.roll_number,
            total_marks: resultInfo?.total_marks,
            max_marks: resultInfo?.max_marks,
            percentage: resultInfo?.percentage,
            grade: resultInfo?.grade,
            rank: resultInfo?.rank,
            is_pass: resultInfo?.is_pass,
            published_at: resultInfo?.published_at,
            exam_type_id: examWiseTermId,
            exam_type_name: matchedTerm?.term_name || matchedTerm?.name || "Exam Wise",
            exam_event_id: eventInfo?.exam_event_id,
            exam_event_name: eventInfo?.exam_event_name,
            subject_wise_breakdown: normalizeArray(studentItem?.details_breakdown),
          };
        });
      } else {
        const response = await getPublishedResultsByExamTypes({
          examTypeIds: currentExamTypeIds,
          studentIds: targetStudentIds,
        });

        const apiData = normalizeArray(response?.data?.data || response?.data);
        publishedResults = apiData.flatMap((examTypeItem) =>
          normalizeArray(examTypeItem?.exam_events).flatMap((eventItem) =>
            normalizeArray(eventItem?.published_results).map((resultItem) => ({
              ...resultItem,
              exam_type_id: examTypeItem?.exam_type_id,
              exam_type_name: examTypeItem?.exam_type_name,
              exam_event_id: eventItem?.exam_event_id,
              exam_event_name: eventItem?.exam_event_name,
            }))
          )
        );
      }

      if (!publishedResults.length) {
        toast.info("No published report card results found for selected students");
        return;
      }

      setPreviewReport(publishedResults[0]);
      if (publishedResults.length > 1) {
        toast.info(`Showing first report card preview out of ${publishedResults.length} records`);
      }

      toast.success(`Report card data generated for ${targetStudentIds.length} students`);
      console.log("Published results:", publishedResults);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report cards");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReportCard = async (reportItem) => {
    const resultId = reportItem?.result_id || reportItem?.student_id;
    if (!resultId) return;

    try {
      setDownloadingDocumentId(resultId);

      const payload = {
        student_id: Number(reportItem?.student_id),
        document_type: "report_card",
        reference_id: String(reportItem?.exam_event_id || examWiseExamId || termWiseTermIds?.[0] || ""),
        status: "final",
        file_url: "generated://report-card",
        meta_data: {
          exam_type_id: String(reportItem?.exam_type_id || currentExamTypeIds?.[0] || ""),
          exam_event_id: String(reportItem?.exam_event_id || ""),
          class_id: String(currentClassId || ""),
          exam_event_name: reportItem?.exam_event_name || "",
          student_name: reportItem?.student_name || "",
          roll_number: reportItem?.roll_number || "",
          generated_from: activeTab,
        },
      };

      await generateExamDocument(payload);

      const templateDoc = buildReportTemplateDocument(reportItem);
      const fileBlob = new Blob([templateDoc], {
        type: "text/html;charset=utf-8",
      });
      const blobUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${(reportItem?.student_name || "student").replace(/\s+/g, "-")}-report-card.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      toast.success(`Downloaded report for ${reportItem?.student_name || "student"}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download report card document");
    } finally {
      setDownloadingDocumentId(null);
    }
  };

  const handlePrintReportCard = (reportItem) => {
    const printWindow = window.open("", "_blank", "width=1000,height=700");
    if (!printWindow) {
      toast.error("Unable to open print window");
      return;
    }

    printWindow.document.write(buildReportTemplateDocument(reportItem));

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 150);
  };

  const closeReportPreview = () => {
    setPreviewReport(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Report Card Generator" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-violet-700">Report Card Generator</h1>
              <p className="text-slate-600 mt-3 max-w-3xl mx-auto">
                Select term, exam flow, class, and students. Then generate single or multiple report cards with download and print support.
              </p>
            </div>

            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 inline-flex gap-2">
              <button
                onClick={() => {
                  setActiveTab(REPORT_TABS.TERM_WISE);
                  setStudents([]);
                  setSelectedStudents([]);
                  setPreviewReport(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === REPORT_TABS.TERM_WISE
                    ? "bg-violet-600 text-white"
                    : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                }`}
              >
                Term Wise Report
              </button>
              <button
                onClick={() => {
                  setActiveTab(REPORT_TABS.EXAM_WISE);
                  setStudents([]);
                  setSelectedStudents([]);
                  setPreviewReport(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === REPORT_TABS.EXAM_WISE
                    ? "bg-violet-600 text-white"
                    : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                }`}
              >
                Exam Wise Report
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {activeTab === REPORT_TABS.TERM_WISE ? "Term Wise Filters" : "Exam Wise Filters"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Term</label>
                  {activeTab === REPORT_TABS.TERM_WISE ? (
                    <div className="relative" ref={termDropdownRef}>
                      <button
                        type="button"
                        disabled={initialLoading}
                        onClick={() => setTermDropdownOpen((prev) => !prev)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none disabled:bg-gray-100"
                      >
                        <span className={termWiseTermIds.length ? "text-gray-800" : "text-gray-500"}>
                          {selectedTermText}
                        </span>
                      </button>

                      {termDropdownOpen && (
                        <div className="absolute z-30 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-xl">
                          <div className="p-2 border-b border-gray-200">
                            <input
                              type="text"
                              value={termSearchQuery}
                              onChange={(e) => setTermSearchQuery(e.target.value)}
                              placeholder="Search term"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                          </div>
                          <div className="max-h-56 overflow-auto p-2 space-y-1">
                            <label className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 text-sm font-medium text-gray-700">
                              <input
                                type="checkbox"
                                checked={allFilteredSelected}
                                onChange={toggleSelectAllFilteredTerms}
                                className="w-4 h-4 text-violet-600 rounded border-gray-300"
                              />
                              Select all
                            </label>

                            {filteredTermOptions.map((term) => {
                              const termKey = getTermKey(term);
                              return (
                                <label
                                  key={termKey}
                                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 text-sm text-gray-700"
                                >
                                  <input
                                    type="checkbox"
                                    checked={termWiseTermIds.includes(termKey)}
                                    onChange={() => toggleSingleTermSelection(termKey)}
                                    className="w-4 h-4 text-violet-600 rounded border-gray-300"
                                  />
                                  {getTermLabel(term)}
                                </label>
                              );
                            })}

                            {!filteredTermOptions.length && (
                              <p className="px-2 py-2 text-sm text-gray-500">No terms found</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <select
                      value={examWiseTermId}
                      onChange={(e) => handleExamWiseTermChange(e.target.value)}
                      disabled={initialLoading}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none"
                    >
                      <option value="">Select term</option>
                      {examTerms.map((term) => {
                        const termKey = getTermKey(term);
                        return (
                          <option key={termKey} value={termKey}>
                            {getTermLabel(term)}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>

                {activeTab === REPORT_TABS.EXAM_WISE && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Exam</label>
                    <select
                      value={examWiseExamId}
                      onChange={(e) => handleExamWiseExamChange(e.target.value)}
                      disabled={!examWiseTermId || examWiseLoading}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none"
                    >
                      <option value="">{examWiseTermId ? "Select exam" : "Select term first"}</option>
                      {examWiseExams.map((exam) => {
                        const examKey = exam.id || exam.exam_id || exam.uuid;
                        return (
                          <option key={examKey} value={examKey}>
                            {getExamLabel(exam)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Class</label>
                  <select
                    value={activeTab === REPORT_TABS.TERM_WISE ? termWiseClassId : examWiseClassId}
                    onChange={(e) => {
                      if (activeTab === REPORT_TABS.TERM_WISE) {
                        setTermWiseClassId(e.target.value);
                      } else {
                        setExamWiseClassId(e.target.value);
                      }
                      setStudents([]);
                      setSelectedStudents([]);
                      setPreviewReport(null);
                    }}
                    disabled={initialLoading}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none"
                  >
                    <option value="">Select class id</option>
                    {classes.map((classItem) => {
                      const classKey = extractClassKey(classItem);
                      return (
                        <option key={classKey} value={classKey}>
                          {getClassLabel(classItem)}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={fetchStudentsList}
                    disabled={!currentClassId || studentsLoading}
                    className="w-full px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg shadow-sm transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {studentsLoading ? "Loading..." : "Show Students"}
                  </button>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
                {activeTab === REPORT_TABS.TERM_WISE ? (
                  <p>
                    {termWiseLoading ? "Loading term details..." : `Exams found: ${termWiseExamCount} | Event IDs prepared: ${termWiseEventIds.length}`}
                  </p>
                ) : (
                  <p>
                    {examWiseLoading
                      ? "Loading exam details..."
                      : `Selected exam events prepared: ${examWiseEventIds.length}`}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-violet-100 text-violet-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Select Students
              </h2>

              {!!students.length && (
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 border border-violet-100 rounded-lg bg-violet-50/40">
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === students.length && students.length > 0}
                      onChange={handleSelectAllStudents}
                      className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                    />
                    Select All Students
                  </label>
                  <p className="text-sm text-slate-600">
                    Selected: <span className="font-semibold text-slate-800">{selectedStudents.length}</span> / {students.length}
                  </p>
                  <button
                    onClick={() => generateReportCards(selectedStudents)}
                    disabled={generating || selectedStudents.length === 0}
                    className="px-6 py-2.5 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                  >
                    {generating ? "Processing..." : `Generate Report Cards (${selectedStudents.length})`}
                  </button>
                </div>
              )}

              {studentsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                </div>
              ) : students.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-linear-to-r from-violet-600 to-purple-600 text-white font-medium">
                      <tr>
                        <th className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedStudents.length === students.length}
                            onChange={handleSelectAllStudents}
                            className="w-4 h-4 text-violet-600 rounded border-white/40 focus:ring-violet-300"
                          />
                        </th>
                        <th className="p-3">Roll No</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Admission No</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {students.map(student => (
                        <tr key={getStudentId(student)} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(getStudentId(student))}
                              onChange={() => toggleStudentSelection(getStudentId(student))}
                              className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                            />
                          </td>
                          <td className="p-3">{student.roll_number}</td>
                          <td className="p-3 font-medium text-gray-800">{student.student_name}</td>
                          <td className="p-3 text-gray-500">{student.admission_number || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : currentClassId ? (
                <p className="text-center py-8 text-gray-500">No students found in this class</p>
              ) : null}
            </div>

          </div>
        </main>

        {previewReport && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold text-violet-700">Report Card Preview</h3>
                <button
                  type="button"
                  onClick={closeReportPreview}
                  className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>

              <div className="p-4 md:p-6">
                <div className="border-2 border-violet-200 rounded-xl p-4 md:p-6 bg-violet-50/30">
                  <h4 className="text-2xl font-bold text-violet-700 mb-1">Student Report Card</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Published At: {formatDateTime(previewReport?.published_at)}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 text-sm">
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Student:</span> {previewReport?.student_name || "N/A"}</div>
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Roll No:</span> {previewReport?.roll_number || "N/A"}</div>
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Exam Type:</span> {previewReport?.exam_type_name || "N/A"}</div>
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Exam Event:</span> {previewReport?.exam_event_name || "N/A"}</div>
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Total / Max:</span> {formatNumber(previewReport?.total_marks)} / {formatNumber(previewReport?.max_marks)}</div>
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Percentage:</span> {formatNumber(previewReport?.percentage)}%</div>
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Grade:</span> {previewReport?.grade || "N/A"}</div>
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Rank:</span> {previewReport?.rank ?? "N/A"}</div>
                    <div className="bg-white border border-slate-200 rounded-md px-3 py-2 md:col-span-2">
                      <span className="font-semibold">Status:</span>{" "}
                      <span className={previewReport?.is_pass ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
                        {previewReport?.is_pass ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-3 md:p-4">
                    <h5 className="text-base md:text-lg font-semibold text-slate-800 mb-3">Subject Breakdown</h5>
                    <div className="overflow-auto border border-slate-200 rounded-md">
                      <table className="min-w-full text-sm">
                        <thead className="bg-violet-100 text-violet-900">
                          <tr>
                            <th className="px-3 py-2 text-left">#</th>
                            <th className="px-3 py-2 text-left">Subject</th>
                            <th className="px-3 py-2 text-left">Code</th>
                            <th className="px-3 py-2 text-left">Marks</th>
                            <th className="px-3 py-2 text-left">Max</th>
                            <th className="px-3 py-2 text-left">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {normalizeArray(previewReport?.subject_wise_breakdown).length ? (
                            normalizeArray(previewReport?.subject_wise_breakdown).map((subject, index) => (
                              <tr key={`${subject?.subject_code || "sub"}-${index}`} className="border-t border-slate-200 even:bg-slate-50">
                                <td className="px-3 py-2">{index + 1}</td>
                                <td className="px-3 py-2">{subject?.subject_name || "N/A"}</td>
                                <td className="px-3 py-2">{subject?.subject_code || "N/A"}</td>
                                <td className="px-3 py-2">{formatNumber(subject?.marks_obtained)}</td>
                                <td className="px-3 py-2">{formatNumber(subject?.max_marks)}</td>
                                <td className="px-3 py-2">{subject?.grade || "N/A"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-3 py-4 text-center text-slate-500">
                                No subject breakdown available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleDownloadReportCard(previewReport)}
                    disabled={downloadingDocumentId === (previewReport?.result_id || previewReport?.student_id)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {downloadingDocumentId === (previewReport?.result_id || previewReport?.student_id) ? "Processing..." : "Download"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrintReportCard(previewReport)}
                    className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCardGeneratorPage;
