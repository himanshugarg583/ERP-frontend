import React from "react";
import { FaTrash } from "react-icons/fa"; 
const ViewAssignSubject=()=>{
    return(
        <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg text-black">
        <div class="flex justify-between items-center mb-4">
            <div class="flex items-center">
                <i class="fas fa-users text-2xl text-blue-600 mr-2"></i>
                <h1 class="text-xl font-semibold">Assign Subject</h1>
            </div>
            <button class="bg-blue-900 text-white px-4 py-2 rounded">Add</button>
        </div>
        <div class="space-y-4">
            <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-1">
                    <label class="block text-sm font-medium">Sr.No.</label>
                    <input type="text" class="mt-1 block w-full border border-gray-300 rounded py-2 px-3" value="4"/>
                </div>
                <div class="col-span-5">
                    <label class="block text-sm font-medium">Subject</label>
                    <select class="mt-1 block w-full border border-gray-300 rounded py-2 px-3">
                        <option>english(Theory)</option>
                    </select>
                </div>
                <div class="col-span-5">
                    <label class="block text-sm font-medium">Teacher</label>
                    <select class="mt-1 block w-full border border-gray-300 rounded py-2 px-3">
                        <option>Akshay Singhal (3232)</option>
                    </select>
                </div>
                <div class="col-span-1 flex justify-center">

                    <button class="bg-red-500 text-white px-3 py-2 rounded">
                        {/* <i class="fas fa-trash"></i> */}
                        <FaTrash
              onClick={() => removeItem(index)}
               
            />
                        </button>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-1">
                    <label class="block text-sm font-medium">Sr.No.</label>
                    <input type="text" class="mt-1 block w-full border border-gray-300 rounded py-2 px-3" value="2"/>
                </div>
                <div class="col-span-5">
                    <label class="block text-sm font-medium">Subject</label>
                    <select class="mt-1 block w-full border border-gray-300 rounded py-2 px-3">
                        <option>Biology(Theory)</option>
                    </select>
                </div>
                <div class="col-span-5">
                    <label class="block text-sm font-medium">Teacher</label>
                    <select class="mt-1 block w-full border border-gray-300 rounded py-2 px-3">
                        <option>chetan Jain (1234)</option>
                    </select>
                </div>
                <div class="col-span-1 flex justify-center">
                    <button class="bg-red-500 text-white px-3 py-2 rounded">
                        
                    <FaTrash
              
            />


                        </button>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-1">
                    <label class="block text-sm font-medium">Sr.No.</label>
                    <input type="text" class="mt-1 block w-full border border-gray-300 rounded py-2 px-3" value="4"/>
                </div>
                <div class="col-span-5">
                    <label class="block text-sm font-medium">Subject</label>
                    <select class="mt-1 block w-full border border-gray-300 rounded py-2 px-3">
                        <option>MI-R4(Practical)</option>
                    </select>
                </div>
                <div class="col-span-5">
                    <label class="block text-sm font-medium">Teacher</label>
                    <select class="mt-1 block w-full border border-gray-300 rounded py-2 px-3">
                        <option>Robert Vaidya (202)</option>
                    </select>
                </div>
                <div class="col-span-1 flex justify-center">
                    <button class="bg-red-500 text-white px-3 py-2 rounded">
                    <FaTrash/>
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-1">
                    <label class="block text-sm font-medium">Sr.No.</label>
                    <input type="text" class="mt-1 block w-full border border-gray-300 rounded py-2 px-3" value="1"/>
                </div>
                <div class="col-span-5">
                    <label class="block text-sm font-medium">Subject</label>
                    <select class="mt-1 block w-full border border-gray-300 rounded py-2 px-3">
                        <option>Chemistry(Theory)</option>
                    </select>
                </div>
                <div class="col-span-5">
                    <label class="block text-sm font-medium">Teacher</label>
                    <select class="mt-1 block w-full border border-gray-300 rounded py-2 px-3">
                        <option>Akshay Singhal (3232)</option>
                    </select>
                </div>
                <div class="col-span-1 flex justify-center">
                    <button class="bg-red-500 text-white px-3 py-2 rounded">
                    <FaTrash/>
                        </button>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-1">
                    <label class="block text-sm font-medium">Sr.No.</label>
                    <input type="text" class="mt-1 block w-full border border-gray-300 rounded py-2 px-3" value="3"/>
                </div>
                <div class="col-span-5">
                    <label class="block text-sm font-medium">Subject</label>
                    <select class="mt-1 block w-full border border-gray-300 rounded py-2 px-3">
                        <option>Hindi(Theory)</option>
                    </select>
                </div>
                <div class="col-span-5">
                    <label class="block text-sm font-medium">Teacher</label>
                    <select class="mt-1 block w-full border border-gray-300 rounded py-2 px-3">
                        <option>chetan Jain (1234)</option>
                    </select>
                </div>
                <div class="col-span-1 flex justify-center">
                    <button class="bg-red-500 text-white px-3 py-2 rounded"><FaTrash/></button>
                </div>
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <button class="bg-blue-900 text-white px-6 py-2 rounded">Save</button>
        </div>
    </div>
    );
}
export default ViewAssignSubject;