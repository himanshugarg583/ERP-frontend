import React from 'react';
import { Printer, X } from 'lucide-react';

const IdCardDisplay = ({ idCard, onClose, type = 'student' }) => {
  if (!idCard) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ID Card - ${idCard.name}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 0.5cm;
              }
              body {
                margin: 0;
                padding: 0;
              }
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Arial', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f5f5f5;
              padding: 20px;
            }
            .id-card-container {
              width: 85.6mm;
              height: 53.98mm;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 8px;
              padding: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              position: relative;
              overflow: hidden;
            }
            .id-card-container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24);
            }
            .id-card-inner {
              background: white;
              border-radius: 6px;
              padding: 10px;
              height: 100%;
              display: flex;
              gap: 10px;
            }
            .id-card-left {
              flex-shrink: 0;
            }
            .id-card-photo {
              width: 60px;
              height: 75px;
              border-radius: 4px;
              object-fit: cover;
              border: 2px solid #e5e7eb;
            }
            .id-card-placeholder {
              width: 60px;
              height: 75px;
              border-radius: 4px;
              background: #e5e7eb;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #9ca3af;
              font-size: 10px;
              text-align: center;
              border: 2px solid #d1d5db;
            }
            .id-card-right {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .id-card-header {
              border-bottom: 2px solid #667eea;
              padding-bottom: 4px;
              margin-bottom: 4px;
            }
            .id-card-title {
              font-size: 10px;
              color: #667eea;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .id-card-name {
              font-size: 14px;
              font-weight: 700;
              color: #1f2937;
              margin-top: 2px;
            }
            .id-card-details {
              font-size: 9px;
              color: #4b5563;
              line-height: 1.4;
            }
            .id-card-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
            }
            .id-card-label {
              font-weight: 600;
              color: #6b7280;
            }
            .id-card-value {
              color: #1f2937;
            }
            .id-card-footer {
              margin-top: auto;
              padding-top: 4px;
              border-top: 1px solid #e5e7eb;
              font-size: 8px;
              color: #9ca3af;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="id-card-container">
            <div class="id-card-inner">
              <div class="id-card-left">
                ${idCard.image 
                  ? `<img src="${idCard.image}" alt="${idCard.name}" class="id-card-photo" />`
                  : `<div class="id-card-placeholder">No<br/>Photo</div>`
                }
              </div>
              <div class="id-card-right">
                <div class="id-card-header">
                  <div class="id-card-title">${type === 'student' ? 'Student' : 'Staff'} ID Card</div>
                  <div class="id-card-name">${idCard.name}</div>
                </div>
                <div class="id-card-details">
                  ${type === 'student' ? `
                    <div class="id-card-row">
                      <span class="id-card-label">Roll No:</span>
                      <span class="id-card-value">${idCard.roll_number || 'N/A'}</span>
                    </div>
                    <div class="id-card-row">
                      <span class="id-card-label">Class:</span>
                      <span class="id-card-value">${idCard.class_display || `${idCard.class_name || ''} ${idCard.section_name || ''}`.trim() || 'N/A'}</span>
                    </div>
                    <div class="id-card-row">
                      <span class="id-card-label">DOB:</span>
                      <span class="id-card-value">${idCard.dob ? new Date(idCard.dob).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div class="id-card-row">
                      <span class="id-card-label">Gender:</span>
                      <span class="id-card-value">${idCard.gender || 'N/A'}</span>
                    </div>
                    <div class="id-card-row">
                      <span class="id-card-label">Phone:</span>
                      <span class="id-card-value">${idCard.phone_no || 'N/A'}</span>
                    </div>
                  ` : `
                    <div class="id-card-row">
                      <span class="id-card-label">Role:</span>
                      <span class="id-card-value">${idCard.role || 'N/A'}</span>
                    </div>
                    <div class="id-card-row">
                      <span class="id-card-label">Qualification:</span>
                      <span class="id-card-value">${idCard.qualification || 'N/A'}</span>
                    </div>
                    <div class="id-card-row">
                      <span class="id-card-label">DOB:</span>
                      <span class="id-card-value">${idCard.dob ? new Date(idCard.dob).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div class="id-card-row">
                      <span class="id-card-label">Gender:</span>
                      <span class="id-card-value">${idCard.gender || 'N/A'}</span>
                    </div>
                    <div class="id-card-row">
                      <span class="id-card-label">Mobile:</span>
                      <span class="id-card-value">${idCard.mobile_no || 'N/A'}</span>
                    </div>
                  `}
                </div>
                <div class="id-card-footer">
                  ${idCard.email || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-slate-800 mb-4">Generated ID Card</h3>

        {/* ID Card Preview */}
        <div className="mb-6 flex justify-center">
          <div className="w-[342px] h-[216px] bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg p-3 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>
            <div className="bg-white rounded-md p-2.5 h-full flex gap-2.5">
              {/* Photo Section */}
              <div className="flex-shrink-0">
                {idCard.image ? (
                  <img
                    src={idCard.image}
                    alt={idCard.name}
                    className="w-[60px] h-[75px] rounded object-cover border-2 border-slate-200"
                  />
                ) : (
                  <div className="w-[60px] h-[75px] rounded bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-[10px] text-slate-400 text-center">
                    No<br />Photo
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="border-b-2 border-violet-500 pb-1 mb-1">
                    <div className="text-[10px] text-violet-600 font-semibold uppercase tracking-wide">
                      {type === 'student' ? 'Student' : 'Staff'} ID Card
                    </div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">{idCard.name}</div>
                  </div>

                  <div className="text-[9px] text-slate-600 space-y-0.5">
                    {type === 'student' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-500">Roll No:</span>
                          <span className="text-slate-700">{idCard.roll_number || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-500">Class:</span>
                          <span className="text-slate-700">
                            {idCard.class_display || `${idCard.class_name || ''} ${idCard.section_name || ''}`.trim() || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-500">DOB:</span>
                          <span className="text-slate-700">
                            {idCard.dob ? new Date(idCard.dob).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-500">Gender:</span>
                          <span className="text-slate-700">{idCard.gender || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-500">Phone:</span>
                          <span className="text-slate-700">{idCard.phone_no || 'N/A'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-500">Role:</span>
                          <span className="text-slate-700">{idCard.role || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-500">Qualification:</span>
                          <span className="text-slate-700">{idCard.qualification || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-500">DOB:</span>
                          <span className="text-slate-700">
                            {idCard.dob ? new Date(idCard.dob).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-500">Gender:</span>
                          <span className="text-slate-700">{idCard.gender || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-500">Mobile:</span>
                          <span className="text-slate-700">{idCard.mobile_no || 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-1 mt-1">
                  <div className="text-[8px] text-slate-400 text-center">{idCard.email || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print ID Card
        </button>
      </div>
    </div>
  );
};

export default IdCardDisplay;

