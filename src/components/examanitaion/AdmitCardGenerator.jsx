import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  listExamTypesV2Thunk,
  listExamEventsV2Thunk,
  generateDocumentV2Thunk,
  getAdmitCardDataV2Thunk,
} from '../../store/slices/examSlice';
import {
  fetchAllClassesForAttendance,
  getAllStudentsByClass,
} from '../../helper/requests-method/apiMethods';

const toArray = (value) => (Array.isArray(value) ? value : []);
const API_BASE_URL = String(import.meta.env.SCHOOL_ERP_BACKEND_URL || '').replace(/\/$/, '');

const getAuthToken = () => localStorage.getItem('authToken') || localStorage.getItem('token') || '';

const toAbsoluteFileUrl = (fileUrl) => {
  if (!fileUrl) return '';
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;

  const base = String(API_BASE_URL || '').replace(/\/$/, '');
  if (String(fileUrl).startsWith('/')) {
    return `${base}${fileUrl}`;
  }

  return `${base}/${fileUrl}`;
};

const triggerBlobDownload = (blob, filename) => {
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};

const printBlob = (blob) => {
  const objectUrl = window.URL.createObjectURL(blob);
  const printWindow = window.open(objectUrl, '_blank');
  if (!printWindow) {
    window.URL.revokeObjectURL(objectUrl);
    throw new Error('Popup blocked. Please allow popups and try again.');
  }

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 15000);
  };
};

const fetchFileBlobFromUrl = async (fileUrl) => {
  const absoluteUrl = toAbsoluteFileUrl(fileUrl);
  if (!absoluteUrl) {
    throw new Error('Generated file url is missing');
  }

  const token = getAuthToken();
  const response = await fetch(absoluteUrl, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error('Unable to fetch generated file');
  }

  const blob = await response.blob();
  return {
    blob,
    contentType: response.headers.get('content-type') || blob.type || '',
  };
};

const normalizeStudentRows = (rows) =>
  toArray(rows).map((student, index) => ({
    id: student.id || student.student_id || student.user_id || `${index + 1}`,
    name: student.name || student.student_name || student.User?.name || 'N/A',
    roll_number: student.roll_number || student.roll_no || 'N/A',
    gender: student.gender || 'N/A',
  }));

const buildAdmitCardHtml = (admitCardData) => {
  const student = admitCardData?.student || {};
  const admitCard = admitCardData?.admit_card || {};
  const examEvents = toArray(admitCard.exam_events);

  const papersHtml = examEvents
    .map((examEvent) => {
      const papers = toArray(examEvent?.papers);
      const rows = papers
        .map(
          (paper, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${paper.subject_name || 'N/A'}</td>
              <td>${paper.subject_code || 'N/A'}</td>
              <td>${paper.exam_date || 'N/A'}</td>
              <td>${paper.start_time || 'N/A'} - ${paper.end_time || 'N/A'}</td>
              <td>${paper.room_label || student.room_no || 'N/A'}</td>
            </tr>
          `
        )
        .join('');

      return `
        <section style="margin-top:20px;">
          <h3 style="margin:0 0 8px; font-size:18px;">${examEvent.exam_event_name || 'Exam Event'}</h3>
          <p style="margin:0 0 10px; color:#475569;">Academic Year: ${examEvent.academic_year || 'N/A'} | ${examEvent.start_date || 'N/A'} to ${examEvent.end_date || 'N/A'}</p>
          <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead>
              <tr style="background:#ede9fe;">
                <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">#</th>
                <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Subject</th>
                <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Code</th>
                <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Date</th>
                <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Time</th>
                <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Room</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </section>
      `;
    })
    .join('');

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Admit Card</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
          .card { border: 2px solid #7c3aed; border-radius: 12px; padding: 16px; }
          .title { font-size: 24px; font-weight: 700; margin: 0 0 8px; color: #6d28d9; }
          .muted { color: #475569; margin: 0; }
          .student-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 14px; }
          .student-grid div { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; }
          td, th { border: 1px solid #cbd5e1; padding: 8px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1 class="title">Admit Card</h1>
          <p class="muted">Generated At: ${admitCard.generated_at || 'N/A'}</p>
          <div class="student-grid">
            <div><strong>Name:</strong> ${student.student_name || 'N/A'}</div>
            <div><strong>Roll No:</strong> ${student.roll_number || 'N/A'}</div>
            <div><strong>Class:</strong> ${student.class_name || 'N/A'}</div>
            <div><strong>Section:</strong> ${student.section_name || 'N/A'}</div>
            <div><strong>Room:</strong> ${student.room_no || 'N/A'}</div>
            <div><strong>Phone:</strong> ${student.phone_no || 'N/A'}</div>
          </div>
          ${papersHtml}
        </div>
      </body>
    </html>
  `;
};

const AdmitCardGenerator = () => {
  const dispatch = useDispatch();

  const [loadingBase, setLoadingBase] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [examTypes, setExamTypes] = useState([]);
  const [examEvents, setExamEvents] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedExamTypeId, setSelectedExamTypeId] = useState('');
  const [selectedExamEventId, setSelectedExamEventId] = useState('');
  const [selectedClassSectionId, setSelectedClassSectionId] = useState('');

  const [selectedStudentMap, setSelectedStudentMap] = useState({});
  const [rowGeneratingMap, setRowGeneratingMap] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewStudentId, setPreviewStudentId] = useState(null);
  const [previewActionLoading, setPreviewActionLoading] = useState(false);

  useEffect(() => {
    const loadBase = async () => {
      try {
        setLoadingBase(true);

        const [typesResponse, eventsResponse, classesResponse] = await Promise.all([
          dispatch(listExamTypesV2Thunk()).unwrap(),
          dispatch(listExamEventsV2Thunk({})).unwrap(),
          fetchAllClassesForAttendance(),
        ]);

        const typeRows = toArray(typesResponse?.data).length
          ? toArray(typesResponse.data)
          : toArray(typesResponse);
        const eventRows = toArray(eventsResponse?.data).length
          ? toArray(eventsResponse.data)
          : toArray(eventsResponse);
        const classRows = toArray(classesResponse?.data?.classes).length
          ? toArray(classesResponse.data.classes)
          : toArray(classesResponse?.data);

        setExamTypes(typeRows);
        setExamEvents(eventRows);
        setClassSections(classRows);
      } catch (error) {
        toast.error(error?.message || 'Failed to load exam admit card filters');
      } finally {
        setLoadingBase(false);
      }
    };

    loadBase();
  }, [dispatch]);

  const filteredExamEvents = useMemo(() => {
    if (!selectedExamTypeId) return [];
    return examEvents.filter(
      (eventItem) =>
        String(eventItem.exam_type_id || eventItem.exam_type?.id || '') ===
        String(selectedExamTypeId)
    );
  }, [examEvents, selectedExamTypeId]);

  const allSelected =
    students.length > 0 &&
    students.every((student) => selectedStudentMap[String(student.id)]);

  const selectedCount = useMemo(
    () => Object.values(selectedStudentMap).filter(Boolean).length,
    [selectedStudentMap]
  );

  const resetStudentList = () => {
    setStudents([]);
    setSelectedStudentMap({});
  };

  const handleLoadStudents = async () => {
    if (!selectedExamTypeId || !selectedExamEventId || !selectedClassSectionId) {
      toast.error('Please select exam type, exam event, and class id first');
      return;
    }

    try {
      setLoadingStudents(true);
      const response = await getAllStudentsByClass(selectedClassSectionId);
      const rows = normalizeStudentRows(response?.data);
      setStudents(rows);
      setSelectedStudentMap({});

      if (rows.length === 0) {
        toast.error('No students found for selected class id');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to load students');
      setStudents([]);
      setSelectedStudentMap({});
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleToggleStudent = (studentId) => {
    const key = String(studentId);
    setSelectedStudentMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedStudentMap({});
      return;
    }

    const next = {};
    students.forEach((student) => {
      next[String(student.id)] = true;
    });
    setSelectedStudentMap(next);
  };

  const previewForStudent = async (studentId, isRowAction = false) => {
    if (!selectedExamEventId) {
      toast.error('Please select exam event');
      return { success: false };
    }

    const studentKey = String(studentId);

    try {
      if (isRowAction) {
        setRowGeneratingMap((prev) => ({ ...prev, [studentKey]: true }));
      }

      const admitCardPayload = await dispatch(
        getAdmitCardDataV2Thunk({
          student_id: Number(studentId),
          exam_event_id: Number(selectedExamEventId),
        })
      ).unwrap();

      const admitCardData = admitCardPayload?.data || admitCardPayload || null;
      setPreviewData(admitCardData);
      setPreviewStudentId(Number(studentId));
      setPreviewOpen(true);

      return { success: true, studentId: studentKey };
    } catch (error) {
      return {
        success: false,
        studentId: studentKey,
        error:
          error?.error?.message ||
          error?.message ||
          'Generation failed',
      };
    } finally {
      if (isRowAction) {
        setRowGeneratingMap((prev) => ({ ...prev, [studentKey]: false }));
      }
    }
  };

  const handleGenerateSingleAdmitCard = async (studentId) => {
    const result = await previewForStudent(studentId, true);
    if (result.success) {
      toast.success('Admit card preview loaded for selected student');
    } else {
      toast.error(result.error || 'Failed to load admit card preview for selected student');
    }
  };

  const handlePreviewAdmitCard = async () => {
    const selectedIds = Object.keys(selectedStudentMap).filter(
      (id) => selectedStudentMap[id]
    );

    if (selectedIds.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    if (!selectedExamEventId) {
      toast.error('Please select exam event');
      return;
    }

    if (selectedIds.length > 1) {
      toast.info('Multiple students selected. Previewing first selected student.');
    }

    try {
      setGenerating(true);
      const result = await previewForStudent(selectedIds[0], false);
      if (!result.success) {
        toast.error(result.error || 'Failed to load admit card preview');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to load admit card preview');
    } finally {
      setGenerating(false);
    }
  };

  const handlePreviewAction = async (actionType) => {
    if (!previewData || !previewStudentId) {
      toast.error('No admit card data available');
      return;
    }

    try {
      setPreviewActionLoading(true);

      const generateResponse = await dispatch(
        generateDocumentV2Thunk({
          student_id: Number(previewStudentId),
          document_type: 'admit_card',
          reference_id: selectedExamEventId,
          status: 'final',
          file_url: 'generated://admit-card',
          meta_data: {
            exam_type_id: selectedExamTypeId,
            exam_event_id: selectedExamEventId,
            class_id: selectedClassSectionId,
            admit_card_data: previewData,
            requested_action: actionType,
          },
        })
      ).unwrap();

      const generatedFileUrl =
        generateResponse?.data?.file_url ||
        generateResponse?.file_url ||
        generateResponse?.data?.document?.file_url ||
        '';

      const html = buildAdmitCardHtml(previewData);

      if (actionType === 'print') {
        if (generatedFileUrl) {
          try {
            const { blob } = await fetchFileBlobFromUrl(generatedFileUrl);
            printBlob(blob);
            toast.success('Admit card sent to print');
            return;
          } catch {
            // Fallback to printable HTML view when secured file fetch is unavailable.
          }
        }

        const printWindow = window.open('', '_blank', 'width=900,height=700');
        if (!printWindow) {
          toast.error('Popup blocked. Please allow popups and try again.');
          return;
        }
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        toast.success('Admit card sent to print');
        return;
      }

      if (generatedFileUrl) {
        const { blob, contentType } = await fetchFileBlobFromUrl(generatedFileUrl);
        const extension = String(contentType).includes('pdf') ? 'pdf' : 'bin';
        triggerBlobDownload(blob, `admit-card-${previewStudentId}.${extension}`);
      } else {
        const blob = new Blob([html], { type: 'text/html' });
        triggerBlobDownload(blob, `admit-card-${previewStudentId}.html`);
      }

      toast.success('Admit card downloaded');
    } catch (error) {
      toast.error(error?.message || `Failed to ${actionType} admit card`);
    } finally {
      setPreviewActionLoading(false);
    }
  };

  const previewStudent = previewData?.student || {};
  const previewAdmitCard = previewData?.admit_card || {};
  const previewEvents = toArray(previewAdmitCard?.exam_events);

  return (
    <main className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="container mx-auto max-w-full">
        <div className="bg-white shadow-xl rounded-xl p-4 md:p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-2 text-center">
            Admit Card Generator
          </h2>
          <p className="text-center text-sm text-slate-600 mb-6">
            Select exam type, exam event, and class id. Then choose multiple students and generate admit cards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
              <select
                value={selectedExamTypeId}
                onChange={(event) => {
                  setSelectedExamTypeId(event.target.value);
                  setSelectedExamEventId('');
                  setSelectedClassSectionId('');
                  resetStudentList();
                }}
                disabled={loadingBase}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select exam type</option>
                {examTypes.map((typeItem) => (
                  <option key={typeItem.id || typeItem.uuid} value={typeItem.id || typeItem.uuid}>
                    {typeItem.name || typeItem.term_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Event</label>
              <select
                value={selectedExamEventId}
                onChange={(event) => {
                  setSelectedExamEventId(event.target.value);
                  resetStudentList();
                }}
                disabled={!selectedExamTypeId || loadingBase}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select exam event</option>
                {filteredExamEvents.map((eventItem) => (
                  <option key={eventItem.id || eventItem.uuid} value={eventItem.id || eventItem.uuid}>
                    {eventItem.name || eventItem.exam_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Id</label>
              <select
                value={selectedClassSectionId}
                onChange={(event) => {
                  setSelectedClassSectionId(event.target.value);
                  resetStudentList();
                }}
                disabled={loadingBase}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select class id</option>
                {classSections.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.id} - {classItem.class_name} - {classItem.section_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleLoadStudents}
                disabled={
                  loadingStudents ||
                  !selectedExamTypeId ||
                  !selectedExamEventId ||
                  !selectedClassSectionId
                }
                className="w-full h-10 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {loadingStudents ? 'Loading...' : 'Show Students'}
              </button>
            </div>
          </div>

          {students.length > 0 && (
            <>
              <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleToggleAll}
                    className="w-4 h-4"
                  />
                  Select All Students
                </label>

                <span className="text-sm text-slate-600">
                  Selected: {selectedCount} / {students.length}
                </span>
              </div>

              <div className="overflow-auto border border-slate-200 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-violet-600 text-white">
                    <tr>
                      <th className="px-3 py-2 text-left">Select</th>
                      <th className="px-3 py-2 text-left">Student Name</th>
                      <th className="px-3 py-2 text-left">Roll No</th>
                      <th className="px-3 py-2 text-left">Gender</th>
                      <th className="px-3 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={String(student.id)} className="border-t border-slate-200 even:bg-slate-50">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={Boolean(selectedStudentMap[String(student.id)])}
                            onChange={() => handleToggleStudent(student.id)}
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="px-3 py-2">{student.name}</td>
                        <td className="px-3 py-2">{student.roll_number}</td>
                        <td className="px-3 py-2">{student.gender}</td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => handleGenerateSingleAdmitCard(student.id)}
                            disabled={Boolean(rowGeneratingMap[String(student.id)]) || generating}
                            className="px-3 py-1.5 rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-60"
                          >
                            {rowGeneratingMap[String(student.id)] ? 'Generating...' : 'Generate Single'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handlePreviewAdmitCard}
                  disabled={generating || selectedCount === 0}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {generating ? 'Loading Preview...' : 'Generate Admit Card'}
                </button>
              </div>
            </>
          )}

          {!loadingStudents && students.length === 0 && selectedClassSectionId && (
            <p className="text-sm text-slate-500">No students loaded yet. Click Show Students.</p>
          )}

          {previewOpen && previewData && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto">
                <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-semibold text-violet-700">Admit Card Preview</h3>
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(false)}
                    className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100"
                    disabled={previewActionLoading}
                  >
                    Close
                  </button>
                </div>

                <div className="p-4 md:p-6">
                  <div className="border-2 border-violet-200 rounded-xl p-4 md:p-6 bg-violet-50/30">
                    <h4 className="text-2xl font-bold text-violet-700 mb-1">Admit Card</h4>
                    <p className="text-sm text-slate-600 mb-4">Generated At: {previewAdmitCard.generated_at || 'N/A'}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 text-sm">
                      <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Name:</span> {previewStudent.student_name || 'N/A'}</div>
                      <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Roll No:</span> {previewStudent.roll_number || 'N/A'}</div>
                      <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Class:</span> {previewStudent.class_name || 'N/A'}</div>
                      <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Section:</span> {previewStudent.section_name || 'N/A'}</div>
                      <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Room:</span> {previewStudent.room_no || 'N/A'}</div>
                      <div className="bg-white border border-slate-200 rounded-md px-3 py-2"><span className="font-semibold">Phone:</span> {previewStudent.phone_no || 'N/A'}</div>
                    </div>

                    <div className="space-y-5">
                      {previewEvents.map((examEvent) => (
                        <div key={String(examEvent.exam_event_id)} className="bg-white border border-slate-200 rounded-lg p-3 md:p-4">
                          <h5 className="text-base md:text-lg font-semibold text-slate-800">
                            {examEvent.exam_event_name || 'Exam Event'}
                          </h5>
                          <p className="text-xs md:text-sm text-slate-600 mb-3">
                            Academic Year: {examEvent.academic_year || 'N/A'} | {examEvent.start_date || 'N/A'} to {examEvent.end_date || 'N/A'}
                          </p>

                          <div className="overflow-auto border border-slate-200 rounded-md">
                            <table className="min-w-full text-sm">
                              <thead className="bg-violet-100 text-violet-900">
                                <tr>
                                  <th className="px-3 py-2 text-left">#</th>
                                  <th className="px-3 py-2 text-left">Subject</th>
                                  <th className="px-3 py-2 text-left">Code</th>
                                  <th className="px-3 py-2 text-left">Date</th>
                                  <th className="px-3 py-2 text-left">Time</th>
                                  <th className="px-3 py-2 text-left">Room</th>
                                </tr>
                              </thead>
                              <tbody>
                                {toArray(examEvent.papers).map((paper, index) => (
                                  <tr key={String(paper.exam_paper_id)} className="border-t border-slate-200 even:bg-slate-50">
                                    <td className="px-3 py-2">{index + 1}</td>
                                    <td className="px-3 py-2">{paper.subject_name || 'N/A'}</td>
                                    <td className="px-3 py-2">{paper.subject_code || 'N/A'}</td>
                                    <td className="px-3 py-2">{paper.exam_date || 'N/A'}</td>
                                    <td className="px-3 py-2">{paper.start_time || 'N/A'} - {paper.end_time || 'N/A'}</td>
                                    <td className="px-3 py-2">{paper.room_label || previewStudent.room_no || 'N/A'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handlePreviewAction('download')}
                      disabled={previewActionLoading}
                      className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {previewActionLoading ? 'Processing...' : 'Download'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreviewAction('print')}
                      disabled={previewActionLoading}
                      className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60"
                    >
                      {previewActionLoading ? 'Processing...' : 'Print'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdmitCardGenerator;
