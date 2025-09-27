import React from "react"

export const AddSub = () => {
    return (
        <div id="webcrumbs">
            <div className="w-[1200px] bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <header className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                    <h1 className="text-2xl font-bold text-white">School ERP System</h1>
                    <p className="text-blue-100 mt-2">Subject Management & Timetable Generator</p>
                </header>

                <div className="flex">
                    <aside className="w-[250px] bg-gray-50 p-4 border-r border-gray-200 h-[calc(100vh-100px)] overflow-auto">
                        <nav>
                            <h2 className="font-semibold mb-4 text-gray-700">Dashboard</h2>
                            <ul className="space-y-1">
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center p-2 rounded-md hover:bg-blue-50 transition-colors group"
                                    >
                                        <span className="material-symbols-outlined mr-3 text-blue-600 group-hover:scale-110 transition-transform">
                                            dashboard
                                        </span>
                                        Overview
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center p-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors group"
                                    >
                                        <span className="material-symbols-outlined mr-3 group-hover:scale-110 transition-transform">
                                            book
                                        </span>
                                        Subjects
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center p-2 rounded-md hover:bg-blue-50 transition-colors group"
                                    >
                                        <span className="material-symbols-outlined mr-3 text-blue-600 group-hover:scale-110 transition-transform">
                                            schedule
                                        </span>
                                        Timetables
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center p-2 rounded-md hover:bg-blue-50 transition-colors group"
                                    >
                                        <span className="material-symbols-outlined mr-3 text-blue-600 group-hover:scale-110 transition-transform">
                                            groups
                                        </span>
                                        Students
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center p-2 rounded-md hover:bg-blue-50 transition-colors group"
                                    >
                                        <span className="material-symbols-outlined mr-3 text-blue-600 group-hover:scale-110 transition-transform">
                                            person
                                        </span>
                                        Teachers
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center p-2 rounded-md hover:bg-blue-50 transition-colors group"
                                    >
                                        <span className="material-symbols-outlined mr-3 text-blue-600 group-hover:scale-110 transition-transform">
                                            domain
                                        </span>
                                        Classes
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center p-2 rounded-md hover:bg-blue-50 transition-colors group"
                                    >
                                        <span className="material-symbols-outlined mr-3 text-blue-600 group-hover:scale-110 transition-transform">
                                            settings
                                        </span>
                                        Settings
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        {/* Next: "Add user profile section with avatar and quick actions" */}
                    </aside>

                    <main className="flex-1 p-6">
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Subject Management</h2>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center group">
                                    <span className="material-symbols-outlined mr-2 group-hover:rotate-12 transition-transform">
                                        add
                                    </span>
                                    Add New Subject
                                </button>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                                <form>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Subject Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                placeholder="e.g. Mathematics"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Subject Code</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                placeholder="e.g. MATH101"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Department</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                                <option>Science</option>
                                                <option>Arts</option>
                                                <option>Commerce</option>
                                                <option>Languages</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Assign Teacher</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                                <option>Mr. John Smith</option>
                                                <option>Mrs. Emily Johnson</option>
                                                <option>Mr. Robert Williams</option>
                                                <option>Ms. Sarah Brown</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Hours Per Week</label>
                                            <input
                                                type="number"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                placeholder="e.g. 6"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Grade Level</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                                <option>Grade 9</option>
                                                <option>Grade 10</option>
                                                <option>Grade 11</option>
                                                <option>Grade 12</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                                            Cancel
                                        </button>
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 hover:shadow-md transition-all">
                                            Save Subject
                                        </button>
                                    </div>
                                </form>
                            </div>
                            {/* Next: "Add subject list with search and filter functionality" */}

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Timetable Generator</h2>
                                    <div className="flex gap-2">
                                        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center group">
                                            <span className="material-symbols-outlined mr-2 group-hover:rotate-12 transition-transform">
                                                people
                                            </span>
                                            Student Timetable
                                        </button>
                                        <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center group">
                                            <span className="material-symbols-outlined mr-2 group-hover:rotate-12 transition-transform">
                                                person
                                            </span>
                                            Teacher Timetable
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                                        <h3 className="font-semibold">Class 10-A Weekly Schedule</h3>
                                        <div className="flex gap-2">
                                            <button className="bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200 transition-colors">
                                                <span className="material-symbols-outlined">print</span>
                                            </button>
                                            <button className="bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200 transition-colors">
                                                <span className="material-symbols-outlined">download</span>
                                            </button>
                                            <button className="bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200 transition-colors">
                                                <span className="material-symbols-outlined">share</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="p-3 text-left font-medium border-b border-r border-gray-200">
                                                        Time / Day
                                                    </th>
                                                    <th className="p-3 text-left font-medium border-b border-r border-gray-200">
                                                        Monday
                                                    </th>
                                                    <th className="p-3 text-left font-medium border-b border-r border-gray-200">
                                                        Tuesday
                                                    </th>
                                                    <th className="p-3 text-left font-medium border-b border-r border-gray-200">
                                                        Wednesday
                                                    </th>
                                                    <th className="p-3 text-left font-medium border-b border-r border-gray-200">
                                                        Thursday
                                                    </th>
                                                    <th className="p-3 text-left font-medium border-b border-gray-200">
                                                        Friday
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="p-3 border-r border-b border-gray-200 font-medium">
                                                        8:00 - 9:00
                                                    </td>
                                                    <td className="p-3 border-r border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-blue-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">Mathematics</div>
                                                            <div className="text-xs text-gray-500">Mr. John Smith</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 border-r border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-green-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">Biology</div>
                                                            <div className="text-xs text-gray-500">
                                                                Mrs. Emily Johnson
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 border-r border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-purple-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">English</div>
                                                            <div className="text-xs text-gray-500">Ms. Sarah Brown</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 border-r border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-yellow-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">Physics</div>
                                                            <div className="text-xs text-gray-500">
                                                                Mr. Robert Williams
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-red-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">Chemistry</div>
                                                            <div className="text-xs text-gray-500">
                                                                Mr. David Miller
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 border-r border-b border-gray-200 font-medium">
                                                        9:00 - 10:00
                                                    </td>
                                                    <td className="p-3 border-r border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-green-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">Biology</div>
                                                            <div className="text-xs text-gray-500">
                                                                Mrs. Emily Johnson
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 border-r border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-blue-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">Mathematics</div>
                                                            <div className="text-xs text-gray-500">Mr. John Smith</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 border-r border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-orange-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">History</div>
                                                            <div className="text-xs text-gray-500">
                                                                Mr. Michael Brown
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 border-r border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-purple-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">English</div>
                                                            <div className="text-xs text-gray-500">Ms. Sarah Brown</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-blue-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">Mathematics</div>
                                                            <div className="text-xs text-gray-500">Mr. John Smith</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 border-r border-b border-gray-200 font-medium">
                                                        10:00 - 11:00
                                                    </td>
                                                    <td className="p-3 border-r border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-red-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">Chemistry</div>
                                                            <div className="text-xs text-gray-500">
                                                                Mr. David Miller
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 border-r border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-yellow-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">Physics</div>
                                                            <div className="text-xs text-gray-500">
                                                                Mr. Robert Williams
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 border-r border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-green-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">Biology</div>
                                                            <div className="text-xs text-gray-500">
                                                                Mrs. Emily Johnson
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 border-r border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-teal-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">Geography</div>
                                                            <div className="text-xs text-gray-500">Mrs. Lisa Jones</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer group">
                                                        <div className="bg-yellow-100 p-2 rounded-md group-hover:shadow-md transition-all">
                                                            <div className="font-medium">Physics</div>
                                                            <div className="text-xs text-gray-500">
                                                                Mr. Robert Williams
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {/* Next: "Add timetable conflict checker and optimization tool" */}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
