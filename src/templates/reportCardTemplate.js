const normalizeArray = (value) => (Array.isArray(value) ? value : []);

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

const escapeHtml = (value) => {
  const str = String(value ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const buildReportTemplateContent = (reportItem) => {
  const subjectRows = normalizeArray(reportItem?.subject_wise_breakdown)
    .map(
      (subject, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(subject?.subject_name || "N/A")}</td>
          <td>${escapeHtml(subject?.subject_code || "N/A")}</td>
          <td>${escapeHtml(formatNumber(subject?.marks_obtained))}</td>
          <td>${escapeHtml(formatNumber(subject?.max_marks))}</td>
          <td>${escapeHtml(subject?.grade || "N/A")}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div class="header">
      <h1>Student Report Card</h1>
      <p class="muted">Generated on ${escapeHtml(new Date().toLocaleString())}</p>
    </div>
    <div class="summary">
      <div class="chip"><strong>Student:</strong> ${escapeHtml(reportItem?.student_name || "N/A")}</div>
      <div class="chip"><strong>Roll No:</strong> ${escapeHtml(reportItem?.roll_number || "N/A")}</div>
      <div class="chip"><strong>Exam Type:</strong> ${escapeHtml(reportItem?.exam_type_name || "N/A")}</div>
      <div class="chip"><strong>Exam Event:</strong> ${escapeHtml(reportItem?.exam_event_name || "N/A")}</div>
      <div class="chip"><strong>Total / Max:</strong> ${escapeHtml(formatNumber(reportItem?.total_marks))} / ${escapeHtml(formatNumber(reportItem?.max_marks))}</div>
      <div class="chip"><strong>Percentage:</strong> ${escapeHtml(formatNumber(reportItem?.percentage))}%</div>
      <div class="chip"><strong>Grade:</strong> ${escapeHtml(reportItem?.grade || "N/A")}</div>
      <div class="chip"><strong>Rank:</strong> ${escapeHtml(reportItem?.rank ?? "N/A")}</div>
      <div class="chip"><strong>Status:</strong> ${reportItem?.is_pass ? "PASS" : "FAIL"}</div>
      <div class="chip"><strong>Published At:</strong> ${escapeHtml(formatDateTime(reportItem?.published_at))}</div>
    </div>
    <h3>Subject Breakdown</h3>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Subject</th>
          <th>Code</th>
          <th>Marks</th>
          <th>Max</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        ${subjectRows || '<tr><td colspan="6">No subject breakdown available</td></tr>'}
      </tbody>
    </table>
  `;
};

export const buildReportTemplateDocument = (reportItem) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Report Card - ${escapeHtml(reportItem?.student_name || "Student")}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 24px; color: #1f2937; }
        .header { border-bottom: 2px solid #7c3aed; margin-bottom: 16px; padding-bottom: 8px; }
        .header h1 { margin: 0; color: #6d28d9; font-size: 28px; }
        .summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 16px; }
        .chip { background: #f5f3ff; border: 1px solid #ddd6fe; padding: 10px 12px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #d1d5db; padding: 9px; text-align: left; }
        th { background: #f3f4f6; }
        .muted { color: #6b7280; margin-top: 6px; }
      </style>
    </head>
    <body>
      ${buildReportTemplateContent(reportItem)}
    </body>
  </html>
`;
