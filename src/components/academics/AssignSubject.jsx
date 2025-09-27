import React from "react";
import { Link } from "react-router-dom";
// import { Link } from "lucide-react";
const AssignSubject=()=>{
    return(
        <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl text-black">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Subjects and Teachers</h2>
            <button class="bg-purple-700 text-white px-4 py-2 rounded-md flex items-center">
                <i class="fas fa-plus mr-2"></i> 
                <Link to="/ViewAssignSubPage">Add</Link>
                
            </button>
        </div>
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Subject</label>
                    <input type="text" value="english" class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2" readonly/>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Teacher</label>
                    <input type="text" value="Akshay Singhal (3232)" class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2" readonly/>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Subject</label>
                    <input type="text" value="Biology" class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2" readonly/>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Teacher</label>
                    <input type="text" value="chetan Jain (1234)" class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2" readonly/>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Subject</label>
                    <input type="text" value="MI-R4" class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2" readonly/>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Teacher</label>
                    <input type="text" value="Robert Vaidya (202)" class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2" readonly/>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Subject</label>
                    <input type="text" value="Chemistry" class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2" readonly/>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Teacher</label>
                    <input type="text" value="Akshay Singhal (3232)" class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2" readonly/>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Subject</label>
                    <input type="text" value="Hindi" class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2" readonly/>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Teacher</label>
                    <input type="text" value="chetan Jain (1234)" class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2" readonly/>
                </div>
            </div>
        </div>
    </div>
    );
}

export default AssignSubject;