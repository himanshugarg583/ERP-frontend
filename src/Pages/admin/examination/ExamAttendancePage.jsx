import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import { getDemoFileUrl } from '../../../utils/assetUrls';
import {
  approveMarksEntryV2Thunk,
  bulkTeacherAttendanceV2Thunk,
  createDocumentTemplateV2Thunk,
  createExamEventV2Thunk,
  createExamPaperV2Thunk,
  createExamTimetableEntryV2Thunk,
  createExamTypeV2Thunk,
  deleteExamEventV2Thunk,
  deleteExamPaperV2Thunk,
  deleteExamTimetableEntryV2Thunk,
  deleteExamTypeV2Thunk,
  downloadStudentDocumentV2Thunk,
  generateDocumentV2Thunk,
  getExamEventByIdV2Thunk,
  getStudentDocumentsV2Thunk,
  getStudentResultsV2Thunk,
  getStudentTimetableV2Thunk,
  listDocumentTemplatesV2Thunk,
  listDocumentsV2Thunk,
  listExamEventsV2Thunk,
  listExamPapersV2Thunk,
  listExamTimetableEntriesV2Thunk,
  listExamTypesV2Thunk,
  listMarksEntriesV2Thunk,
  listResultsV2Thunk,
  listTeacherAssignedPapersV2Thunk,
  listTeacherPaperMarksV2Thunk,
  listTeacherPaperStudentsV2Thunk,
  listTeacherTimetableV2Thunk,
  lockMarksEntryV2Thunk,
  publishResultsV2Thunk,
  recomputeResultsV2Thunk,
  submitTeacherMarksV2Thunk,
  updateDocumentTemplateV2Thunk,
  updateExamEventV2Thunk,
  updateExamPaperV2Thunk,
  updateExamTimetableEntryV2Thunk,
  updateExamTypeV2Thunk,
  upsertTeacherMarksV2Thunk,
} from '../../../store/slices/examSlice';

const ExamAttendancePage = () => {
  const dispatch = useDispatch();
  const [selectedOperation, setSelectedOperation] = useState('listExamTypesV2');
  const [payloadText, setPayloadText] = useState('{}');
  const [responseText, setResponseText] = useState('Run a V2 operation to see response here.');
  const [running, setRunning] = useState(false);

  const operations = useMemo(
    () => [
      {
        key: 'listExamTypesV2',
        label: 'Admin V2 - List Exam Terms',
        thunk: listExamTypesV2Thunk,
        description: 'GET /api/v2/admin/exam/types',
        sample: {},
      },
      {
        key: 'createExamTypeV2',
        label: 'Admin V2 - Create Exam Term',
        thunk: createExamTypeV2Thunk,
        description: 'POST /api/v2/admin/exam/types',
        sample: {
          name: 'Main Exam',
          description: 'Major exam pattern',
          grading_config: { 'A+': 90, A: 80, B: 70, C: 60 },
          is_active: true,
        },
      },
      {
        key: 'updateExamTypeV2',
        label: 'Admin V2 - Update Exam Term',
        thunk: updateExamTypeV2Thunk,
        description: 'PATCH /api/v2/admin/exam/types/{examTypeId}',
        sample: {
          examTypeUuid: '00000000-0000-0000-0000-000000000001',
          payload: { description: 'Updated exam term', is_active: true },
        },
      },
      {
        key: 'deleteExamTypeV2',
        label: 'Admin V2 - Delete Exam Term',
        thunk: deleteExamTypeV2Thunk,
        description: 'DELETE /api/v2/admin/exam/types/{examTypeId}',
        sample: { examTypeUuid: '00000000-0000-0000-0000-000000000001' },
      },
      {
        key: 'listExamEventsV2',
        label: 'Admin V2 - List Exam Events',
        thunk: listExamEventsV2Thunk,
        description: 'GET /api/v2/admin/exam/events?status=scheduled',
        sample: { status: 'scheduled' },
      },
      {
        key: 'createExamEventV2',
        label: 'Admin V2 - Create Exam Event',
        thunk: createExamEventV2Thunk,
        description: 'POST /api/v2/admin/exam/events',
        sample: {
          name: 'Half Yearly 2026',
          exam_type_id: '00000000-0000-0000-0000-000000000001',
          academic_year: '2026-2027',
          start_date: '2026-09-10',
          end_date: '2026-09-25',
          status: 'scheduled',
          marks_entry_deadline: '2026-09-28T23:59:59.000Z',
          result_publish_at: '2026-10-05T10:00:00.000Z',
        },
      },
      {
        key: 'getExamEventByIdV2',
        label: 'Admin V2 - Get Exam Event By Id',
        thunk: getExamEventByIdV2Thunk,
        description: 'GET /api/v2/admin/exam/events/{examEventId}',
        sample: { examEventUuid: '00000000-0000-0000-0000-000000000002' },
      },
      {
        key: 'updateExamEventV2',
        label: 'Admin V2 - Update Exam Event',
        thunk: updateExamEventV2Thunk,
        description: 'PATCH /api/v2/admin/exam/events/{examEventId}',
        sample: {
          examEventUuid: '00000000-0000-0000-0000-000000000002',
          payload: { status: 'ongoing' },
        },
      },
      {
        key: 'deleteExamEventV2',
        label: 'Admin V2 - Delete Exam Event',
        thunk: deleteExamEventV2Thunk,
        description: 'DELETE /api/v2/admin/exam/events/{examEventId}',
        sample: { examEventUuid: '00000000-0000-0000-0000-000000000002' },
      },
      {
        key: 'listExamPapersV2',
        label: 'Admin V2 - List Exam Papers',
        thunk: listExamPapersV2Thunk,
        description: 'GET /api/v2/admin/exam/papers?exam_event_id={examEventId}',
        sample: { exam_event_id: '00000000-0000-0000-0000-000000000002' },
      },
      {
        key: 'createExamPaperV2',
        label: 'Admin V2 - Create Exam Paper',
        thunk: createExamPaperV2Thunk,
        description: 'POST /api/v2/admin/exam/papers',
        sample: {
          exam_event_id: '00000000-0000-0000-0000-000000000002',
          subject_id: 1,
          class_id: 1,
          max_marks: 100,
          passing_marks: 33,
          marks_config: { theory: 80, practical: 20 },
          assigned_teacher_id: 1,
          is_active: true,
        },
      },
      {
        key: 'updateExamPaperV2',
        label: 'Admin V2 - Update Exam Paper',
        thunk: updateExamPaperV2Thunk,
        description: 'PATCH /api/v2/admin/exam/papers/{examPaperId}',
        sample: {
          examPaperUuid: '00000000-0000-0000-0000-000000000003',
          payload: { passing_marks: 35 },
        },
      },
      {
        key: 'deleteExamPaperV2',
        label: 'Admin V2 - Delete Exam Paper',
        thunk: deleteExamPaperV2Thunk,
        description: 'DELETE /api/v2/admin/exam/papers/{examPaperId}',
        sample: { examPaperUuid: '00000000-0000-0000-0000-000000000003' },
      },
      {
        key: 'listExamTimetableEntriesV2',
        label: 'Admin V2 - List Timetable Entries',
        thunk: listExamTimetableEntriesV2Thunk,
        description: 'GET /api/v2/admin/exam/timetable?exam_event_id={examEventId}',
        sample: { exam_event_id: '00000000-0000-0000-0000-000000000002' },
      },
      {
        key: 'createExamTimetableEntryV2',
        label: 'Admin V2 - Create Timetable Entry',
        thunk: createExamTimetableEntryV2Thunk,
        description: 'POST /api/v2/admin/exam/timetable',
        sample: {
          exam_event_id: '00000000-0000-0000-0000-000000000002',
          exam_paper_id: '00000000-0000-0000-0000-000000000003',
          class_id: 1,
          subject_id: 1,
          exam_date: '2026-09-15',
          start_time: '09:00:00',
          end_time: '12:00:00',
          duration_minutes: 180,
          slot_number: 1,
          room_label: 'A-201',
          invigilator_teacher_id: 1,
          is_rescheduled: false,
          original_date: null,
        },
      },
      {
        key: 'updateExamTimetableEntryV2',
        label: 'Admin V2 - Update Timetable Entry',
        thunk: updateExamTimetableEntryV2Thunk,
        description: 'PATCH /api/v2/admin/exam/timetable/{examTimetableId}',
        sample: {
          examTimetableUuid: '00000000-0000-0000-0000-000000000004',
          payload: { room_label: 'A-202' },
        },
      },
      {
        key: 'deleteExamTimetableEntryV2',
        label: 'Admin V2 - Delete Timetable Entry',
        thunk: deleteExamTimetableEntryV2Thunk,
        description: 'DELETE /api/v2/admin/exam/timetable/{examTimetableId}',
        sample: { examTimetableUuid: '00000000-0000-0000-0000-000000000004' },
      },
      {
        key: 'listMarksEntriesV2',
        label: 'Admin V2 - List Marks Entries',
        thunk: listMarksEntriesV2Thunk,
        description: 'GET /api/v2/admin/exam/marks?exam_paper_id={examPaperId}',
        sample: { exam_paper_id: '00000000-0000-0000-0000-000000000003' },
      },
      {
        key: 'approveMarksEntryV2',
        label: 'Admin V2 - Approve Marks Entry',
        thunk: approveMarksEntryV2Thunk,
        description: 'POST /api/v2/admin/exam/marks/approve',
        sample: {
          exam_paper_id: '00000000-0000-0000-0000-000000000003',
          student_id: 1,
        },
      },
      {
        key: 'lockMarksEntryV2',
        label: 'Admin V2 - Lock Marks Entry',
        thunk: lockMarksEntryV2Thunk,
        description: 'POST /api/v2/admin/exam/marks/lock',
        sample: {
          exam_paper_id: '00000000-0000-0000-0000-000000000003',
          student_id: 1,
        },
      },
      {
        key: 'listResultsV2',
        label: 'Admin V2 - List Results',
        thunk: listResultsV2Thunk,
        description: 'GET /api/v2/admin/exam/results?exam_event_id={examEventId}',
        sample: { exam_event_id: '00000000-0000-0000-0000-000000000002' },
      },
      {
        key: 'recomputeResultsV2',
        label: 'Admin V2 - Recompute Results',
        thunk: recomputeResultsV2Thunk,
        description: 'POST /api/v2/admin/exam/results/recompute',
        sample: { exam_event_id: '00000000-0000-0000-0000-000000000002' },
      },
      {
        key: 'publishResultsV2',
        label: 'Admin V2 - Publish Results',
        thunk: publishResultsV2Thunk,
        description: 'POST /api/v2/admin/exam/results/publish',
        sample: {
          exam_event_id: '00000000-0000-0000-0000-000000000002',
          version_bump: true,
        },
      },
      {
        key: 'listDocumentTemplatesV2',
        label: 'Admin V2 - List Document Templates',
        thunk: listDocumentTemplatesV2Thunk,
        description: 'GET /api/v2/admin/exam/templates?document_type=report_card',
        sample: { document_type: 'report_card' },
      },
      {
        key: 'createDocumentTemplateV2',
        label: 'Admin V2 - Create Document Template',
        thunk: createDocumentTemplateV2Thunk,
        description: 'POST /api/v2/admin/exam/templates',
        sample: {
          name: 'Report Card Template',
          document_type: 'report_card',
          template_config: { layout: 'default' },
          is_active: true,
        },
      },
      {
        key: 'updateDocumentTemplateV2',
        label: 'Admin V2 - Update Document Template',
        thunk: updateDocumentTemplateV2Thunk,
        description: 'PATCH /api/v2/admin/exam/templates/{documentTemplateId}',
        sample: {
          documentTemplateUuid: '00000000-0000-0000-0000-000000000005',
          payload: { is_active: true },
        },
      },
      {
        key: 'generateDocumentV2',
        label: 'Admin V2 - Generate Document',
        thunk: generateDocumentV2Thunk,
        description: 'POST /api/v2/admin/exam/documents/generate',
        sample: {
          student_id: 1,
          document_type: 'report_card',
          reference_id: '00000000-0000-0000-0000-000000000002',
          file_url: getDemoFileUrl('report-card.pdf'),
          status: 'final',
          meta_data: { source: 'postman' },
        },
      },
      {
        key: 'listDocumentsV2',
        label: 'Admin V2 - List Documents',
        thunk: listDocumentsV2Thunk,
        description: 'GET /api/v2/admin/exam/documents?student_id={studentId}',
        sample: { student_id: 1 },
      },
      {
        key: 'listTeacherAssignedPapersV2',
        label: 'Teacher V2 - List Assigned Papers',
        thunk: listTeacherAssignedPapersV2Thunk,
        description: 'GET /api/v2/teacher/exam/papers?exam_event_id={examEventId}',
        sample: { exam_event_id: '00000000-0000-0000-0000-000000000002' },
      },
      {
        key: 'listTeacherTimetableV2',
        label: 'Teacher V2 - List My Timetable',
        thunk: listTeacherTimetableV2Thunk,
        description: 'GET /api/v2/teacher/exam/timetable?exam_event_id={examEventId}',
        sample: { exam_event_id: '00000000-0000-0000-0000-000000000002' },
      },
      {
        key: 'listTeacherPaperStudentsV2',
        label: 'Teacher V2 - List Paper Students',
        thunk: listTeacherPaperStudentsV2Thunk,
        description: 'GET /api/v2/teacher/exam/papers/{examPaperId}/students',
        sample: { examPaperUuid: '00000000-0000-0000-0000-000000000003' },
      },
      {
        key: 'listTeacherPaperMarksV2',
        label: 'Teacher V2 - List Marks By Paper',
        thunk: listTeacherPaperMarksV2Thunk,
        description: 'GET /api/v2/teacher/exam/papers/{examPaperId}/marks',
        sample: { examPaperUuid: '00000000-0000-0000-0000-000000000003' },
      },
      {
        key: 'upsertTeacherMarksV2',
        label: 'Teacher V2 - Upsert Marks',
        thunk: upsertTeacherMarksV2Thunk,
        description: 'POST /api/v2/teacher/exam/papers/{examPaperId}/marks/upsert',
        sample: {
          examPaperUuid: '00000000-0000-0000-0000-000000000003',
          payload: {
            student_id: 1,
            marks: { theory: 65, practical: 18 },
            total_marks: 83,
            is_absent: false,
            is_exempt: false,
            grace_marks: 0,
            meta_data: { remark: 'Good performance' },
            status: 'draft',
          },
        },
      },
      {
        key: 'submitTeacherMarksV2',
        label: 'Teacher V2 - Submit Marks',
        thunk: submitTeacherMarksV2Thunk,
        description: 'POST /api/v2/teacher/exam/papers/{examPaperId}/marks/submit',
        sample: {
          examPaperUuid: '00000000-0000-0000-0000-000000000003',
          payload: {
            student_id: 1,
            marks: { theory: 65, practical: 18 },
            total_marks: 83,
            is_absent: false,
            is_exempt: false,
            grace_marks: 0,
          },
        },
      },
      {
        key: 'bulkTeacherAttendanceV2',
        label: 'Teacher V2 - Bulk Mark Attendance',
        thunk: bulkTeacherAttendanceV2Thunk,
        description: 'POST /api/v2/teacher/exam/papers/{examPaperId}/attendance/bulk',
        sample: {
          examPaperUuid: '00000000-0000-0000-0000-000000000003',
          payload: {
            records: [
              {
                student_id: 1,
                status: 'present',
                remarks: 'On time',
                malpractice_flag: false,
              },
            ],
          },
        },
      },
      {
        key: 'getStudentTimetableV2',
        label: 'Student V2 - Get My Timetable',
        thunk: getStudentTimetableV2Thunk,
        description: 'GET /api/v2/student/exam/timetable?exam_event_id={examEventId}',
        sample: { exam_event_id: '00000000-0000-0000-0000-000000000002' },
      },
      {
        key: 'getStudentResultsV2',
        label: 'Student V2 - Get My Results',
        thunk: getStudentResultsV2Thunk,
        description: 'GET /api/v2/student/exam/results?exam_event_id={examEventId}',
        sample: { exam_event_id: '00000000-0000-0000-0000-000000000002' },
      },
      {
        key: 'getStudentDocumentsV2',
        label: 'Student V2 - Get My Documents',
        thunk: getStudentDocumentsV2Thunk,
        description: 'GET /api/v2/student/exam/documents?document_type=report_card',
        sample: { document_type: 'report_card' },
      },
      {
        key: 'downloadStudentDocumentV2',
        label: 'Student V2 - Download My Document',
        thunk: downloadStudentDocumentV2Thunk,
        description: 'GET /api/v2/student/exam/documents/{documentId}/download',
        sample: { documentUuid: '00000000-0000-0000-0000-000000000006' },
      },
    ],
    []
  );

  const selectedConfig = operations.find((item) => item.key === selectedOperation) || operations[0];

  const handleOperationChange = (nextKey) => {
    const nextOperation = operations.find((item) => item.key === nextKey);
    setSelectedOperation(nextKey);
    setPayloadText(JSON.stringify(nextOperation?.sample || {}, null, 2));
  };

  const runOperation = async () => {
    if (!selectedConfig) {
      return;
    }

    let payload = {};
    try {
      payload = payloadText?.trim() ? JSON.parse(payloadText) : {};
    } catch {
      toast.error('Payload must be valid JSON');
      return;
    }

    setRunning(true);
    try {
      const response = await dispatch(selectedConfig.thunk(payload)).unwrap();
      setResponseText(JSON.stringify(response, null, 2));
      toast.success('Operation completed');
    } catch (error) {
      const message = error?.message || error?.error || error?.response?.data?.message || 'Request failed';
      toast.error(message);
      setResponseText(JSON.stringify(error, null, 2));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className='bg-gray-100 flex AddStudent'>
      <Sidebar />

      <div className=' overflow-auto relative z-1 flex-col' style={{
        height: '95vh',
        width: '100vw',
        gap: '10px',
        display: 'flex',
        transition: 'margin-left 0.3s ease',
      }}>
        <Header />

        <main className="w-full p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 mb-4">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Exam APIs V2 Operations Hub</h1>
            <p className="text-sm text-slate-600 mt-1">
              Active V2 exam routes only. Legacy endpoints were removed from this panel.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Operation</label>
              <select
                value={selectedOperation}
                onChange={(event) => handleOperationChange(event.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3"
              >
                {operations.map((item) => (
                  <option key={item.key} value={item.key}>{item.label}</option>
                ))}
              </select>

              <p className="text-xs text-slate-500 mb-3">{selectedConfig?.description}</p>

              <label className="block text-sm font-medium text-slate-700 mb-2">Payload (JSON)</label>
              <textarea
                value={payloadText}
                onChange={(event) => setPayloadText(event.target.value)}
                rows={20}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 font-mono text-xs"
              />

              <div className="flex gap-3 mt-3">
                <button
                  onClick={runOperation}
                  disabled={running}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                >
                  {running ? 'Running...' : 'Run Operation'}
                </button>
                <button
                  onClick={() => setPayloadText(JSON.stringify(selectedConfig?.sample || {}, null, 2))}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Reset Payload
                </button>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h2 className="text-base font-semibold text-slate-800 mb-2">Response</h2>
              <pre className="bg-slate-950 text-slate-100 rounded-lg p-3 text-xs overflow-auto min-h-140">
                {responseText}
              </pre>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamAttendancePage;