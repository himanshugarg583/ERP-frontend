import React, { useState, useEffect } from 'react';
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { getAllTeachers, generateStaffIdCard, generateMultipleStaffIdCards } from "../../../helper/requests-method/apiMethods";
import { toast, ToastContainer } from 'react-toastify';
import { IdCard, User, Printer } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const StaffIdCard = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdCards, setGeneratedIdCards] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await getAllTeachers();
      if (response.success && response.data) {
        const mappedTeachers = response.data.map((teacher) => ({
          id: teacher.id,
          user_id: teacher.id, // teacher_id is the user_id for staff
          name: teacher.name || 'Unknown',
          email: teacher.email || '',
          role: teacher.role || 'teacher',
          qualification: teacher.teacherDetails?.qualification || '',
          dob: teacher.teacherDetails?.dob || '',
          gender: teacher.teacherDetails?.gender || '',
          mobile_no: teacher.teacherDetails?.mobile_no || teacher.teacherDetails?.mobile || teacher.teacherDetails?.phone || teacher.mobile_no || '',
          current_address: teacher.teacherDetails?.currentaddress || '',
          permanent_address: teacher.teacherDetails?.permanentaddress || teacher.teacherDetails?.permenantaddress || '',
          joining_date: teacher.teacherDetails?.joining_date || '',
          image: teacher.teacherDetails?.image || null,
        }));
        setTeachers(mappedTeachers);
      } else {
        toast.error('Failed to fetch teachers');
        setTeachers([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching teachers');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeachers((prev) => {
      if (prev.includes(teacherId)) {
        return prev.filter((id) => id !== teacherId);
      } else {
        return [...prev, teacherId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTeachers.length === teachers.length && teachers.length > 0) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(teachers.map((t) => t.user_id));
    }
  };

  const handlePrintIdCard = (idCard) => {
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
                  <div class="id-card-title">Staff ID Card</div>
                  <div class="id-card-name">${idCard.name}</div>
                </div>
                <div class="id-card-details">
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

  const handleGenerateSingle = async (user_id) => {
    try {
      setIsGenerating(true);
      const response = await generateStaffIdCard(user_id);
      if (response.success && response.data) {
        setGeneratedIdCards((prev) => [response.data, ...prev]);
        toast.success(response.message || 'Staff ID card generated successfully!');
      } else {
        toast.error(response.message || 'Failed to generate staff ID card');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error generating staff ID card');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBulk = async () => {
    if (selectedTeachers.length === 0) {
      toast.warning('Please select at least one teacher');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await generateMultipleStaffIdCards(selectedTeachers);
      if (response.success && response.data) {
        if (response.data.id_cards && response.data.id_cards.length > 0) {
          setGeneratedIdCards((prev) => [...response.data.id_cards, ...prev]);
        }
        if (response.data.missing_user_ids && response.data.missing_user_ids.length > 0) {
          toast.warning(
            `Generated ${response.data.total_found} cards. ${response.data.missing_user_ids.length} teacher(s) not found.`
          );
        } else {
          toast.success(response.message || 'Staff ID cards generated successfully!');
        }
        setSelectedTeachers([]);
      } else {
        toast.error(response.message || 'Failed to generate staff ID cards');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error generating staff ID cards');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className='bg-slate-200 flex AddStudent'>
      <Sidebar />
      <div className='overflow-auto relative z-1 flex-col' style={{ height: '95vh', width: '100vw', gap: '10px', display: 'flex', transition: 'margin-left 0.3s ease' }}>
        <Header />
        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <div className="space-y-4 md:space-y-6">
            {/* Teacher List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-slate-800">Staff ID Card Generation</h2>
                  <p className="text-sm text-slate-600 mt-1">Select teachers to generate ID cards</p>
                </div>
                {teachers.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectAll}
                      className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      {selectedTeachers.length === teachers.length && teachers.length > 0 ? 'Deselect All' : 'Select All'}
                    </button>
                    {selectedTeachers.length > 0 && (
                      <button
                        onClick={handleGenerateBulk}
                        disabled={isGenerating}
                        className="px-4 py-1.5 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isGenerating ? 'Generating...' : 'Generate Selected'}
                        <IdCard className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="text-center py-8 text-slate-500">Loading teachers...</div>
              ) : teachers.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No teachers found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700 w-12">
                          <input
                            type="checkbox"
                            checked={selectedTeachers.length === teachers.length && teachers.length > 0}
                            onChange={handleSelectAll}
                            className="cursor-pointer"
                          />
                        </th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Name</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Email</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Role</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Qualification</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Mobile</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((teacher) => (
                        <tr key={teacher.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={selectedTeachers.includes(teacher.user_id)}
                              onChange={() => handleTeacherSelect(teacher.user_id)}
                              className="cursor-pointer"
                            />
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-800">
                            <div className="flex items-center gap-2">
                              {teacher.image ? (
                                <img
                                  src={teacher.image}
                                  alt={teacher.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                  <User className="w-4 h-4 text-slate-400" />
                                </div>
                              )}
                              <span>{teacher.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-600">{teacher.email}</td>
                          <td className="px-3 py-2 text-sm text-slate-600 capitalize">{teacher.role}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{teacher.qualification || 'N/A'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{teacher.mobile_no || 'N/A'}</td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => handleGenerateSingle(teacher.user_id)}
                              disabled={isGenerating}
                              className="px-3 py-1 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Generate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Generated ID Cards Section */}
            {generatedIdCards.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Generated ID Cards</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {generatedIdCards.map((card, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg p-0.5 hover:shadow-lg transition-shadow relative"
                    >
                      <div className="bg-white rounded-md p-2.5 flex gap-2.5">
                        {/* Photo Section */}
                        <div className="flex-shrink-0">
                          {card.image ? (
                            <img
                              src={card.image}
                              alt={card.name}
                              className="w-[60px] h-[75px] rounded object-cover border-2 border-slate-200"
                            />
                          ) : (
                            <div className="w-[60px] h-[75px] rounded bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-[10px] text-slate-400 text-center">
                              No<br />Photo
                            </div>
                          )}
                        </div>

                        {/* Details Section */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="border-b-2 border-violet-500 pb-1 mb-1">
                              <div className="text-[10px] text-violet-600 font-semibold uppercase tracking-wide">
                                Staff ID Card
                              </div>
                              <div className="text-sm font-bold text-slate-800 mt-0.5">{card.name}</div>
                            </div>

                            <div className="text-[9px] text-slate-600 space-y-0.5">
                              <div className="flex justify-between">
                                <span className="font-semibold text-slate-500">Role:</span>
                                <span className="text-slate-700 capitalize">{card.role || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold text-slate-500">Qualification:</span>
                                <span className="text-slate-700">{card.qualification || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold text-slate-500">DOB:</span>
                                <span className="text-slate-700">
                                  {card.dob ? new Date(card.dob).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold text-slate-500">Gender:</span>
                                <span className="text-slate-700">{card.gender || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold text-slate-500">Mobile:</span>
                                <span className="text-slate-700">{card.mobile_no || 'N/A'}</span>
                              </div>
                              {card.current_address && (
                                <div className="flex justify-between">
                                  <span className="font-semibold text-slate-500">Address:</span>
                                  <span className="text-slate-700 text-right max-w-[120px] truncate">{card.current_address}</span>
                                </div>
                              )}
                              {card.joining_date && (
                                <div className="flex justify-between">
                                  <span className="font-semibold text-slate-500">Joining:</span>
                                  <span className="text-slate-700">
                                    {new Date(card.joining_date).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="border-t border-slate-200 pt-1 mt-1">
                            <div className="text-[8px] text-slate-400 text-center">{card.email || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrintIdCard(card);
                        }}
                        className="absolute top-2 right-2 bg-white hover:bg-slate-50 text-violet-600 p-1.5 rounded-full shadow-md transition-colors cursor-pointer z-10"
                        title="Print ID Card"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default StaffIdCard;
