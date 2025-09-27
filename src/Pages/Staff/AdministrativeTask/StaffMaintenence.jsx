// components/MaintenanceDashboard.jsx
import React, { useState } from 'react';
import StaffSidebar from '../StaffSidebar';
import StaffHeader from '../StaffHeader';
import { FaPlus, FaCalendar, FaFilter, FaEdit, FaEye, FaTrash, FaChevronLeft, FaChevronRight, FaBuilding, FaDumbbell, FaBook, FaDesktop, FaChevronDown } from 'react-icons/fa';

const StaffMaintenence = () => {
  const [requests] = useState([
    {
      id: '#MR-2023-001',
      requestedBy: { name: 'John Smith', id: 'STF-108' },
      department: 'Science Lab',
      date: 'Oct 15, 2023',
      issue: 'Leaking faucet in Lab 3 causing water damage',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'Robert Jones',
      completion: 'Oct 18, 2023'
    },
    {
      id: '#MR-2023-002',
      requestedBy: { name: 'Sarah Johnson', id: 'STF-115' },
      department: 'Library',
      date: 'Oct 14, 2023',
      issue: 'Flickering lights affecting reading areas',
      priority: 'Medium',
      status: 'Completed',
      assignedTo: 'Michael Chen',
      completion: 'Oct 16, 2023'
    },
    {
      id: '#MR-2023-003',
      requestedBy: { name: 'David Miller', id: 'STF-093' },
      department: 'Gymnasium',
      date: 'Oct 16, 2023',
      issue: 'Basketball hoop broken and needs replacement',
      priority: 'Low',
      status: 'Pending',
      assignedTo: 'Unassigned',
      completion: 'TBD'
    }
  ]);

  const [schedules] = useState([
    {
      title: 'HVAC System Maintenance',
      date: 'Oct 20, 2023 | 10:00 AM',
      team: 'Facilities Management',
      status: 'Upcoming'
    },
    {
      title: 'Quarterly Plumbing Inspection',
      date: 'Oct 23, 2023 | 9:00 AM',
      team: 'External Contractors',
      status: 'Upcoming'
    },
    {
      title: 'Fire Safety Equipment Check',
      date: 'Oct 25, 2023 | 2:00 PM',
      team: 'Safety Department',
      status: 'In Progress'
    }
  ]);

  const [facilities] = useState([
    {
      name: 'Science Laboratory',
      icon: <FaBuilding />,
      equipment: 'Microscopes, Chemical Storage, Safety Equipment',
      issues: [
        { text: 'Gas leak reported in Station 3 (Oct 12)', color: 'red' },
        { text: 'Chemical cabinet lock malfunctioning (Oct 14)', color: 'yellow' }
      ],
      lastInspection: 'Sep 30, 2023',
      nextService: 'Oct 30, 2023'
    },
    {
      name: 'Gymnasium',
      icon: <FaDumbbell />,
      equipment: 'Basketball hoops, Exercise machines, Mats',
      issues: [
        { text: 'Broken basketball hoop (Oct 16)', color: 'yellow' },
        { text: 'Treadmill #3 serviced and working properly (Oct 10)', color: 'green' }
      ],
      lastInspection: 'Oct 5, 2023',
      nextService: 'Nov 5, 2023'
    },
    {
      name: 'Library',
      icon: <FaBook />,
      equipment: 'Bookshelves, Computers, Reading areas',
      issues: [
        { text: 'Flickering lights fixed (Oct 15)', color: 'green' },
        { text: 'Computer station #5 needs software update (Oct 17)', color: 'blue' }
      ],
      lastInspection: 'Oct 14, 2023',
      nextService: 'Nov 14, 2023'
    },
    {
      name: 'Computer Lab',
      icon: <FaDesktop />,
      equipment: '30 computers, Projector, Network equipment',
      issues: [
        { text: 'Projector bulb needs replacement (Oct 13)', color: 'yellow' },
        { text: 'Network outage affecting half the lab (Oct 17)', color: 'red' }
      ],
      lastInspection: 'Oct 2, 2023',
      nextService: 'Oct 31, 2023'
    }
  ]);

  return (
    <div className="flex min-h-screen font-sans">
      <StaffSidebar />
      <div className="flex-1 flex flex-col">
        <StaffHeader />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="w-[1200px] bg-white rounded-xl shadow-lg p-6 mx-auto mt-1">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-primary-800">Maintenance Portal</h1>
              <p className="text-gray-600">School Facilities Management Dashboard</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Maintenance Requests */}
              <div className="lg:col-span-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-primary-700">Maintenance Requests</h2>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2">
                    <FaPlus />
                    New Request
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Request ID', 'Requested By', 'Department', 'Request Date', 'Issue', 'Priority', 'Status', 'Assigned To', 'Expected Completion', 'Actions'].map((header) => (
                          <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {requests.map((req) => (
                        <tr key={req?.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{req?.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div>{req?.requestedBy?.name}</div>
                            <div className="text-xs text-gray-500">{req?.requestedBy?.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{req?.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{req?.date}</td>
                          <td className="px-6 py-4 text-sm max-w-xs truncate">{req?.issue}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${req?.priority === 'High' ? 'bg-red-100 text-red-800' : req?.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                              {req?.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${req?.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : req?.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {req?.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{req?.assignedTo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{req?.completion}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <button className="text-primary-600 hover:text-primary-800 mr-2">
                              <FaEdit />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800">
                              <FaEye />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <nav className="flex items-center">
                    <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 mr-1">
                      <FaChevronLeft className="text-sm" />
                    </button>
                    {[1, 2, 3].map((num) => (
                      <button key={num} className={`px-3 py-1 rounded-md ${num === 1 ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} mr-1`}>
                        {num}
                      </button>
                    ))}
                    <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                      <FaChevronRight className="text-sm" />
                    </button>
                  </nav>
                </div>
              </div>

              {/* Maintenance Schedule */}
              <div className="col-span-1 lg:col-span-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-primary-700">Maintenance Schedule</h2>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2">
                    <FaCalendar />
                    View Calendar
                  </button>
                </div>
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <div key={schedule?.title} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{schedule?.title}</h3>
                          <p className="text-sm text-gray-600">{schedule?.date}</p>
                          <p className="text-sm text-gray-600">{schedule?.team}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${schedule?.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'} h-fit`}>
                          {schedule?.status}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-end gap-2">
                        <button className="text-primary-600 hover:text-primary-800 px-2 py-1 rounded text-sm">
                          <FaEdit />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded text-sm">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment & Facility Status */}
              <div className="col-span-1 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-primary-700">Equipment & Facility Status</h2>
                  <details className="relative">
                    <summary className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2 cursor-pointer list-none">
                      <FaFilter />
                      Filter
                    </summary>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg p-3 z-10">
                      <div className="flex flex-col space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="text-primary-600 rounded" defaultChecked />
                          <span>All Facilities</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="text-primary-600 rounded" />
                          <span>Needs Attention</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="text-primary-600 rounded" />
                          <span>Recently Serviced</span>
                        </label>
                      </div>
                    </div>
                  </details>
                </div>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {facilities.map((facility) => (
                    <details key={facility?.name} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden">
                      <summary className="flex justify-between items-center p-4 cursor-pointer list-none">
                        <div className="flex items-center">
                          <span className="text-xl mr-2 text-primary-600">{facility?.icon}</span>
                          <h3 className="font-semibold">{facility?.name}</h3>
                        </div>
                        <FaChevronDown className="text-gray-600" />
                      </summary>
                      <div className="px-4 pb-4 pt-1">
                        <p className="text-sm text-gray-600 mb-3">{facility?.equipment}</p>
                        <div className="space-y-2 mb-3">
                          <p className="text-sm font-medium">Recent Issues:</p>
                          {facility?.issues?.map((issue, index) => (
                            <div key={index} className={`bg-${issue?.color}-50 p-2 rounded-md text-sm`}>
                              <p className={`text-${issue?.color}-700`}>{issue?.text}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <p>Last Inspection: {facility?.lastInspection}</p>
                          <p>Next Service: {facility?.nextService}</p>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffMaintenence;