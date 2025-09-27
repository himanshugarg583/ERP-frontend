import React, { useState } from 'react';
import StaffSidebar from './StaffSidebar';
import StaffHeader from './StaffHeader';
import { 
  MdDirectionsBus, MdRoute, MdPerson, MdTrendingUp, MdAdd, MdDownload, 
  MdMoreHoriz, MdExpandMore, MdCalendarToday, MdSchedule, MdEdit, 
  MdVisibility, MdAddCircle 
} from 'react-icons/md';

// Reusable Card Component
const DashboardCard = ({ title, subtitle, icon, color, value, trend, stats }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-t-blue-500">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
      <span className={`text-3xl text-${color}-500 bg-${color}-50 p-2 rounded-full`}>{icon}</span>
    </div>
    {value ? (
      <>
        <div className="text-4xl font-bold text-gray-800 mb-3">{value}</div>
        <div className="flex items-center space-x-2 text-green-600">
          <MdTrendingUp size={20} />
          <span>{trend} from last month</span>
        </div>
      </>
    ) : (
      <div className="flex space-x-4 mb-2">
        {stats?.map((stat, i) => (
          <div key={i}>
            <div className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Reusable Form Component
const ModalForm = ({ title, fields, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-xl w-96">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <input key={index} {...field} className="w-full p-2 border rounded" />
        ))}
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
      </div>
    </form>
  </div>
);

const StaffTransport = () => {
  const [showForm, setShowForm] = useState({ request: false, driver: false, vehicle: false, maintenance: false });
  const [requests, setRequests] = useState([
    { title: "Special Trip", dept: "Admin - Workshop", status: "Pending", statusColor: "amber", date: "May 15, 2023", time: "9:00 AM - 4:00 PM", people: 12, actions: ["Reject", "Approve"] },
    { title: "Staff Transport", dept: "IT - Route B", status: "Approved", statusColor: "green", date: "May 10, 2023", time: "Morning & Evening", people: 3, actions: ["View Details"] }
  ]);

  const formConfigs = {
    request: {
      title: "New Transport Request",
      fields: [
        { name: "title", type: "text", placeholder: "Title", required: true },
        { name: "department", type: "text", placeholder: "Department", required: true },
        { name: "date", type: "date", required: true },
        { name: "time", type: "text", placeholder: "Time (e.g., 9:00 AM - 4:00 PM)", required: true },
        { name: "people", type: "number", placeholder: "Number of Staff", required: true }
      ],
      handler: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        setRequests([...requests, {
          title: formData.get('title'),
          dept: formData.get('department'),
          status: "Pending",
          statusColor: "amber",
          date: formData.get('date'),
          time: formData.get('time'),
          people: parseInt(formData.get('people')),
          actions: ["Reject", "Approve"]
        }]);
        setShowForm({ ...showForm, request: false });
      }
    },
    driver: {
      title: "Add New Driver",
      fields: [
        { name: "name", type: "text", placeholder: "Driver Name", required: true },
        { name: "id", type: "text", placeholder: "Driver ID", required: true },
        { name: "route", type: "text", placeholder: "Assigned Route", required: true }
      ],
      handler: (e) => {
        e.preventDefault();
        console.log(Object.fromEntries(new FormData(e.target)));
        setShowForm({ ...showForm, driver: false });
      }
    },
    vehicle: {
      title: "Add New Vehicle",
      fields: [
        { name: "vehicleId", type: "text", placeholder: "Vehicle ID", required: true },
        { name: "capacity", type: "number", placeholder: "Capacity", required: true },
        { name: "type", type: "select", required: true, children: [
          <option key="0" value="">Select Type</option>,
          <option key="1" value="Bus">Bus</option>,
          <option key="2" value="Van">Van</option>
        ] }
      ],
      handler: (e) => {
        e.preventDefault();
        console.log(Object.fromEntries(new FormData(e.target)));
        setShowForm({ ...showForm, vehicle: false });
      }
    },
    maintenance: {
      title: "Add Maintenance Schedule",
      fields: [
        { name: "vehicle", type: "text", placeholder: "Vehicle", required: true },
        { name: "task", type: "text", placeholder: "Maintenance Task", required: true },
        { name: "date", type: "date", required: true }
      ],
      handler: (e) => {
        e.preventDefault();
        console.log(Object.fromEntries(new FormData(e.target)));
        setShowForm({ ...showForm, maintenance: false });
      }
    }
  };

  const handleRequestAction = (index, action) => {
    const updatedRequests = [...requests];
    if (action === "Approve") {
      Object.assign(updatedRequests[index], { status: "Approved", statusColor: "green", actions: ["View Details"] });
    } else if (action === "Reject") {
      updatedRequests.splice(index, 1);
    } else {
      alert(`Details for ${updatedRequests[index].title}:\nDepartment: ${updatedRequests[index].dept}\nDate: ${updatedRequests[index].date}\nTime: ${updatedRequests[index].time}\nPeople: ${updatedRequests[index].people}`);
    }
    setRequests(updatedRequests);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(requests)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transport_requests.json';
    link.click();
  };

  const actionHandler = (type) => () => alert(`${type} functionality...`);

  return (
    <div className="min-h-screen flex overflow-x-hidden font-sans bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="hidden md:block fixed top-0 left-0 w-64 h-full bg-white shadow-xl z-10 transform transition-all duration-300 hover:shadow-2xl">
        <StaffSidebar />
      </div>

      <div className="flex-1 pt-16 md:pl-64">
        <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-lg z-20">
          <StaffHeader />
        </div>

        <main className="px-8 py-8 bg-transparent min-h-screen">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Transport Dashboard
            </h2>
            <div className="flex space-x-4">
              <button onClick={() => setShowForm({ ...showForm, request: true })} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <MdAdd size={20} /><span>New Request</span>
              </button>
              <button onClick={handleExport} className="flex items-center space-x-2 bg-white text-gray-700 border-2 border-gray-200 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <MdDownload size={20} /><span>Export</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { title: "Bus Routes", subtitle: "Active staff routes", icon: <MdRoute />, value: 12, trend: "+2", color: "blue" },
              { title: "Vehicle Status", subtitle: "Fleet availability", icon: <MdDirectionsBus />, stats: [{ value: 18, label: "Total", color: "gray" }, { value: 14, label: "Available", color: "green" }, { value: 4, label: "Maintenance", color: "red" }], color: "purple" },
              { title: "Drivers", subtitle: "Transport operators", icon: <MdPerson />, stats: [{ value: 20, label: "Total", color: "gray" }, { value: 17, label: "On Duty", color: "green" }, { value: 3, label: "On Leave", color: "amber" }], color: "indigo" }
            ].map((card, index) => <DashboardCard key={index} {...card} />)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-purple-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Route Management</h3>
                <button className="text-purple-600 hover:text-purple-800 transition-colors"><MdMoreHoriz size={24} /></button>
              </div>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-700 mb-3">Daily Routes</h4>
                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
                    {["A: Main-Downtown", "B: Main-North", "C: Main-East", "D: Main-West"].map((route, index) => (
                      <div key={index} className={`min-w-[140px] p-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${index === 0 ? 'bg-purple-50 border-l-4 border-purple-500' : 'bg-gray-50 hover:bg-gray-100'}`}>
                        <div className="font-medium text-gray-800">{route.split(':')[0]}</div>
                        <div className="text-xs text-gray-600">{route.split(':')[1]}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <details className="group">
                  <summary className="flex justify-between items-center list-none cursor-pointer">
                    <h4 className="font-medium text-gray-700">Schedule Overview</h4>
                    <span className="transform group-open:rotate-180 transition-transform text-purple-600"><MdExpandMore size={24} /></span>
                  </summary>
                  <div className="pt-4 pl-4 border-l-2 border-purple-200 mt-2 space-y-3">
                    {[{ time: "7:00 AM - 8:30 AM", label: "Morning Pickup", routes: "A, B, C" }, { time: "2:00 PM - 3:30 PM", label: "Afternoon Drop", routes: "A, B, D" }, { time: "5:00 PM - 6:30 PM", label: "Evening Drop", routes: "A, C, D" }].map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center p-3 hover:bg-purple-50 rounded-lg transition-all duration-200">
                        <div><div className="font-medium text-gray-800">{schedule.label}</div><div className="text-xs text-gray-600">{schedule.routes}</div></div>
                        <div className="text-sm text-purple-600 font-medium">{schedule.time}</div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-indigo-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Transport Requests</h3>
                <div className="flex space-x-2">
                  {["All", "Pending", "Approved"].map((filter, index) => (
                    <button key={index} className={`px-4 py-1.5 rounded-md text-sm transition-all duration-300 ${filter === "Pending" ? "border border-indigo-300 bg-indigo-50 text-indigo-600" : "border border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-5">
                {requests.map((request, index) => (
                  <div key={index} className={`border border-${request.statusColor}-200 bg-${request.statusColor}-50 p-5 rounded-lg transition-all duration-300 hover:shadow-md`}>
                    <div className="flex justify-between items-start mb-3">
                      <div><h4 className="font-medium text-gray-800">{request.title}</h4><p className="text-sm text-gray-600">{request.dept}</p></div>
                      <span className={`px-3 py-1 bg-${request.statusColor}-100 text-${request.statusColor}-700 text-xs rounded-full font-medium`}>{request.status}</span>
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-700 mb-4">
                      <div><MdCalendarToday size={12} className="inline mr-1 align-middle" /> {request.date}</div>
                      <div><MdSchedule size={12} className="inline mr-1 align-middle" /> {request.time}</div>
                      <div><MdPerson size={12} className="inline mr-1 align-middle" /> {request.people} Staff</div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      {request.actions?.map((action, i) => (
                        <button key={i} onClick={() => handleRequestAction(index, action)} className={`px-4 py-1.5 rounded-md text-sm transition-all duration-300 transform hover:-translate-y-0.5 ${action === "Reject" ? "border border-red-300 text-red-600 hover:bg-red-50" : action === "Approve" ? "bg-green-600 text-white hover:bg-green-700" : "border border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md col-span-2 border-t-4 border-t-blue-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Driver & Vehicle Management</h3>
                <div className="flex space-x-3">
                  {["driver", "vehicle"].map((type) => (
                    <button key={type} onClick={() => setShowForm({ ...showForm, [type]: true })} className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-all duration-300">
                      <MdAdd size={16} /><span>Add {type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>{["Driver", "Vehicle", "Route", "Status", "Actions"].map((header, index) => <th key={index} className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">{header}</th>)}</tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-blue-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">RM</div><div className="ml-4"><div className="text-sm font-medium text-gray-900">Robert Miller</div><div className="text-sm text-gray-600">ID: DRV-001</div></div></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">Bus A-101</div><div className="text-sm text-gray-600">Capacity: 32</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Route A - Morning</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><div className="flex space-x-3"><button onClick={actionHandler('Editing driver')} className="text-blue-600 hover:text-blue-800 transition-colors"><MdEdit size={16} /></button><button onClick={actionHandler('Viewing driver')} className="text-gray-600 hover:text-gray-800 transition-colors"><MdVisibility size={16} /></button></div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-indigo-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Maintenance & Expenses</h3>
                <button onClick={() => setShowForm({ ...showForm, maintenance: true })} className="text-indigo-600 hover:text-indigo-800 transition-colors"><MdAddCircle size={24} /></button>
              </div>
              <div className="space-y-6">
                <div className="bg-indigo-50 p-5 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Upcoming Maintenance</h4>
                  <div className="space-y-4">
                    {[{ vehicle: "Bus A-102", task: "Routine Service", date: "May 20, 2023" }, { vehicle: "Van B-201", task: "Tire Replacement", date: "May 25, 2023" }].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                        <div><div className="font-medium text-gray-800">{item.vehicle}</div><div className="text-xs text-gray-600">{item.task}</div></div>
                        <div className="text-indigo-600 text-sm font-medium">{item.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-4">Expense Overview</h4>
                  <div className="bg-indigo-50 p-5 rounded-lg">
                    {[{ label: "Fuel", value: "$2,450", width: "65%", color: "blue" }, { label: "Maintenance", value: "$1,320", width: "35%", color: "green" }, { label: "Insurance", value: "$850", width: "22%", color: "indigo" }].map((expense, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-center text-sm text-gray-700 mb-1"><span>{expense.label}</span><span className={`font-medium text-${expense.color}-600`}>{expense.value}</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5"><div className={`bg-${expense.color}-500 h-2.5 rounded-full transition-all duration-500`} style={{ width: expense.width }}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {Object.entries(showForm).map(([key, value]) => value && (
            <ModalForm 
              key={key}
              title={formConfigs[key].title}
              fields={formConfigs[key].fields}
              onSubmit={formConfigs[key].handler}
              onClose={() => setShowForm({ ...showForm, [key]: false })}
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default StaffTransport;