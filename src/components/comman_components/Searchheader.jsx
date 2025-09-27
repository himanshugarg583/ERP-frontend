import React from "react";

const SearchHeader=({search1,search2,search3})=>{
    return(
        <div class="bg-gray-100 flex items-center justify-center">
            <div class="bg-white shadow-md rounded-lg p-6 w-full ">
        
        <div class="border-b pb-4 mb-4">
            <h2 class="text-lg font-semibold text-gray-700 flex items-center">
                <i class="fas fa-search text-blue-500 mr-2"></i> Select Criteria
            </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block text-gray-700">{search1}</label>
                <input type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter Receipt No"/>
            </div>
            <div>
                <label class="block text-gray-700">{search2}<i class="fas fa-calendar-alt text-blue-500"></i></label>
                <input type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500" placeholder="Enter Start Date"/>
            </div>
            <div>
                <label class="block text-gray-700">{search3} <i class="fas fa-calendar-alt text-blue-500"></i></label>
                <input type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500" placeholder="Enter End Date"/>
            </div>
        </div>

        <div class="mt-6 flex justify-end">
            <button class="bg-blue-900 text-white px-4 py-2 rounded-md flex items-center">
                <i class="fas fa-search mr-2"></i> Search
            </button>
        </div>
    </div>
    
    </div>
    );
}

export default SearchHeader;