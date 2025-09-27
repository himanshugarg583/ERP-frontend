import React from "react";
const Announcement=()=>{
    return(
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 class="text-2xl font-semibold mb-6">Create Announcement</h2>
        <form>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">Title <span class="text-red-500">*</span></label>
                    <input type="text" id="title" name="title" placeholder="Title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <input type="text" id="description" name="description" placeholder="Description" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label for="file" class="block text-sm font-medium text-gray-700">Files</label>
                    <div class="mt-1 flex rounded-md shadow-sm">
                        <input type="file" id="file" name="file" class="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        <button type="button" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Upload</button>
                    </div>
                    <p class="mt-2 text-sm text-red-500">Note: Please note that only image or document files are allowed for upload.</p>
                </div>
                <div>
                    <label for="class-sections" class="block text-sm font-medium text-gray-700">Class Sections <span class="text-red-500">*</span></label>
                    <input type="text" id="class-sections" name="class-sections" placeholder="Class Sections" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
            </div>
            <div class="mt-4 flex items-center">
                <input id="add-url" name="add-url" type="checkbox" class="h-4 w-4 text-blue-600 border-gray-300 rounded"/>
                <label for="add-url" class="ml-2 block text-sm text-gray-900">Add Url</label>
            </div>
            <div class="mt-4 flex items-center">
                <input id="select-all" name="select-all" type="checkbox" class="h-4 w-4 text-blue-600 border-gray-300 rounded"/>
                <label for="select-all" class="ml-2 block text-sm text-gray-900">Select All</label>
            </div>
            <div class="mt-6 flex justify-end space-x-4">
                <button type="reset" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Reset</button>
                <button type="submit" class="px-4 py-2 bg-blue-700 text-white rounded-md">Submit</button>
            </div>
        </form>
    </div>
    );
}

export default Announcement;