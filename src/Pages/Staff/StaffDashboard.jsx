import React from 'react'
import StaffSidebar from './StaffSidebar'
import StaffHeader from './StaffHeader'
import { FaBoxOpen, FaClipboardList, FaMoneyBillWave, FaArrowUp, FaExclamationTriangle, FaInfoCircle, FaFilter, FaDownload, FaEdit, FaSearch } from 'react-icons/fa';

const StaffDashboard = () => {
  return (
    <div className="w-full flex">
    <StaffSidebar />
    <main className="flex-1 overflow-y-auto">
        <StaffHeader />
    <div id="webcrumbs"> 
    <div className="w-[1200px] bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl p-6 text-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg opacity-80">Total Items</h3>
                        <p className="text-3xl font-bold mt-2">1,285</p>
                      </div>
                      <FaBoxOpen className="text-3xl p-2 bg-gray-100 rounded-lg text-gray-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-600">
                    <FaArrowUp className="text-green-500 mr-1" />
                      <span className="font-medium">+24 new items</span>
                      <span className="ml-1 opacity-70">this month</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 text-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg opacity-80">Need Restock</h3>
                        <p className="text-3xl font-bold mt-2">42</p>
                      </div>
                      <FaClipboardList className="text-3xl p-2 bg-gray-100 rounded-lg text-gray-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-600">
                    <FaExclamationTriangle className="text-red-500 mr-1" />
                      <span className="font-medium">12 urgent</span>
                      <span className="ml-1 opacity-70">items</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 text-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg opacity-80">Budget Used</h3>
                        <p className="text-3xl font-bold mt-2">68%</p>
                      </div>
                      <FaMoneyBillWave className="text-3xl p-2 bg-gray-100 rounded-lg text-gray-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-600">
                    <FaInfoCircle className="text-blue-500 mr-1" />
                      <span className="opacity-70">₹245,680 of ₹360,000</span>
                    </div>
                  </div>
                </div>
              </div>

<div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-bold">Recent Inventory Activity</h2>
  <div className="flex items-center">
    <button className="border rounded-lg px-4 py-2 mr-2 hover:bg-gray-50 transition duration-300 flex items-center">
    <FaFilter className="mr-1" /> Filter
    </button>
    <button className="border rounded-lg px-4 py-2 hover:bg-gray-50 transition duration-300 flex items-center">
    <FaDownload className="mr-1" /> Export
    </button>
  </div>
</div>

<div className="bg-white rounded-xl border shadow-sm overflow-hidden">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="hover:bg-gray-50 transition duration-150">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium">Science Textbooks (Grade 10)</div>
              <div className="text-xs text-gray-500">#INV-2023-1042</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">Lab & Science</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">120 units</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 hours ago</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button className="text-blue-600 hover:text-blue-800 px-2 transition duration-150"><FaEdit /></button>
          <button className="text-gray-600 hover:text-gray-800 px-2 transition duration-150">Details</button>
        </td>
      </tr>
      <tr className="hover:bg-gray-50 transition duration-150">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium">School Ties (Blue)</div>
              <div className="text-xs text-gray-500">#INV-2023-0857</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">Uniform & Dress Code</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">45 units</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yesterday</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button className="text-blue-600 hover:text-blue-800 px-2 transition duration-150"><FaEdit /></button>
          <button className="text-gray-600 hover:text-gray-800 px-2 transition duration-150">Details</button>
        </td>
      </tr>
      <tr className="hover:bg-gray-50 transition duration-150">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium">HP Chromebooks</div>
              <div className="text-xs text-gray-500">#INV-2023-0621</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">IT & Electronics</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">35 units</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 days ago</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button className="text-blue-600 hover:text-blue-800 px-2 transition duration-150"><FaEdit /></button>
          <button className="text-gray-600 hover:text-gray-800 px-2 transition duration-150">Details</button>
        </td>
      </tr>
      <tr className="hover:bg-gray-50 transition duration-150">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium">Basketballs</div>
              <div className="text-xs text-gray-500">#INV-2023-0589</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">Sports Equipment</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">12 units</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 days ago</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button className="text-blue-600 hover:text-blue-800 px-2 transition duration-150"><FaEdit /></button>
          <button className="text-gray-600 hover:text-gray-800 px-2 transition duration-150">Details</button>
        </td>
      </tr>
      <tr className="hover:bg-gray-50 transition duration-150">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium">Water Bottles (Various Colors)</div>
              <div className="text-xs text-gray-500">#INV-2023-0412</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">Lost & Found</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">8 units</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Found Items</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 week ago</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button className="text-blue-600 hover:text-blue-800 px-2 transition duration-150"><FaEdit /></button>
          <button className="text-gray-600 hover:text-gray-800 px-2 transition duration-150">Details</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div className="px-6 py-4 flex items-center justify-between border-t">
    <div className="text-sm text-gray-500">Showing 5 of 148 items</div>
    <div className="flex space-x-2">
      <button className="px-3 py-1 border rounded-md hover:bg-gray-50 transition duration-150 disabled:opacity-50" disabled>Previous</button>
      <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150">1</button>
      <button className="px-3 py-1 border rounded-md hover:bg-gray-50 transition duration-150">2</button>
      <button className="px-3 py-1 border rounded-md hover:bg-gray-50 transition duration-150">3</button>
      <button className="px-3 py-1 border rounded-md hover:bg-gray-50 transition duration-150">Next</button>
    </div>
  </div>
</div>
</div>
</div>


</div>
</main>
</div>
  )
}

export default StaffDashboard