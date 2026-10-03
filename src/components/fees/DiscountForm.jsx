import React, { useState, useEffect } from "react";
import { uploadClassResource, getAllClassesDropdown, updateClassResource } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';

const FeeDiscountForm = ({ formheading }) => {
  return (
    <div
      className=" bg-white rounded-xl shadow-sm border border-slate-200 w-full"
      style={{ height: "auto" }}
    >
      <div className=" text-black p-4">
        <h2 className="text-xl font-semibold mb-1 flex items-center">
          <i class="fas fa-edit mr-2"></i> {formheading}
          <i class="fas fa-edit mr-2"></i> {formheading}
        </h2>

        <form className="">
          <div class="mb-1">
            <label class="block text-black text-sm font-bold mb-2" for="other">
              Fees Type *
              <input
                type="text"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-600 border-gray-300"
                value="Name"
              />
            </label>
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Name *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Enter amount"
            />
          </div>

          <div class="mb-1">
            <label class="block text-black text-sm font-bold mb-2" for="other">
              Discount Type *
              {/* <input type="text" className="w-full px-3 py-2 border rounded" value="Name"/>        */}
            </label>
            <select
              type="number"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option> Select</option>
              <option> Percentage</option>
              <option> Amount</option>
              {/* <option>    Pending
          <div class="mb-1">
            <label class="block text-black text-sm font-bold mb-2" for="other">
              Fees Type *
              <input
                type="text"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-600 border-gray-300"
                value="Name"
              />
            </label>
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Name *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Enter amount"
            />
          </div>

          <div class="mb-1">
            <label class="block text-black text-sm font-bold mb-2" for="other">
              Discount Type *
              {/* <input type="text" className="w-full px-3 py-2 border rounded" value="Name"/>        */}
            </label>
            <select
              type="number"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option> Select</option>
              <option> Percentage</option>
              <option> Amount</option>
              {/* <option>    Pending
                                      </option> */}
            </select>
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Amount *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Enter amount"
            />
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="attach-document"
            >
              Description
            </label>
            <textarea className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"></textarea>
          </div>

          <div class="flex items-center justify-between">
            <button
              class="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
              type="button"
            >
              Save
            </button>
          </div>
            </select>
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Amount *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Enter amount"
            />
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="attach-document"
            >
              Description
            </label>
            <textarea className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"></textarea>
          </div>

          <div class="flex items-center justify-between">
            <button
              class="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
              type="button"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};
  );
};

const CheckForm = ({ checkheading }) => {
  return (
    <div
      className=" bg-white rounded-xl shadow-sm border border-slate-200 w-full"
      style={{ height: "auto" }}
    >
      <div className=" text-black p-4">
const CheckForm = ({ checkheading }) => {
  return (
    <div
      className=" bg-white rounded-xl shadow-sm border border-slate-200 w-full"
      style={{ height: "auto" }}
    >
      <div className=" text-black p-4">
        <h2 className="text-xl font-semibold mb-1 flex items-center">
          <i class="fas fa-edit mr-2"></i> {checkheading}
          <i class="fas fa-edit mr-2"></i> {checkheading}
        </h2>

        <form className="">
          <div class="mb-1">
            <label class="block text-black text-sm font-bold mb-2" for="other">
              Fees Type *
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value="Name"
              />
            </label>
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Name *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Enter amount"
            />
          </div>

          <div class="mb-1">
            <label class="block text-black text-sm font-bold mb-2" for="other">
              Discount Type *
              {/* <input type="text" className="w-full px-3 py-2 border rounded" value="Name"/>        */}
            </label>
            <select
              type="number"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option> Select</option>
              <option> Percentage</option>
              <option> Amount</option>
              {/* <option>    Pending
          <div class="mb-1">
            <label class="block text-black text-sm font-bold mb-2" for="other">
              Fees Type *
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value="Name"
              />
            </label>
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Name *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Enter amount"
            />
          </div>

          <div class="mb-1">
            <label class="block text-black text-sm font-bold mb-2" for="other">
              Discount Type *
              {/* <input type="text" className="w-full px-3 py-2 border rounded" value="Name"/>        */}
            </label>
            <select
              type="number"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option> Select</option>
              <option> Percentage</option>
              <option> Amount</option>
              {/* <option>    Pending
                                      </option> */}
            </select>
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Amount *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Enter amount"
            />
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="attach-document"
            >
              Description
            </label>
            <textarea className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"></textarea>
          </div>

          <div class="flex items-center justify-between">
            <button
              class="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
              type="button"
            >
              Save
            </button>
          </div>
            </select>
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Amount *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Enter amount"
            />
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="attach-document"
            >
              Description
            </label>
            <textarea className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"></textarea>
          </div>

          <div class="flex items-center justify-between">
            <button
              class="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
              type="button"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};
  );
};

const CheQueForm = ({ chequeheading }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-200 w-full"
      style={{ height: "auto" }}
    >
      <div className=" text-black p-4">
const CheQueForm = ({ chequeheading }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-200 w-full"
      style={{ height: "auto" }}
    >
      <div className=" text-black p-4">
        <h2 className="text-xl font-semibold mb-1 flex items-center">
          <i class="fas fa-edit mr-2"></i> {chequeheading}
          <i class="fas fa-edit mr-2"></i> {chequeheading}
        </h2>

        <form className="">
          <div class="mb-1">
            <label class="block text-black text-sm font-bold mb-2" for="other">
              Student *
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Enter amount"
              />
            </label>
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Cheque No *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Enter amount"
            />
          </div>

          <div class="mb-1">
            <label class="block text-black text-sm font-bold mb-2" for="other">
              Bank Name *
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Enter amount"
              />
            </label>
          </div>
          <div class="mb-1">
            <label class="block text-black text-sm font-bold mb-2" for="other">
              Student *
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Enter amount"
              />
            </label>
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Cheque No *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Enter amount"
            />
          </div>

          <div class="mb-1">
            <label class="block text-black text-sm font-bold mb-2" for="other">
              Bank Name *
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Enter amount"
              />
            </label>
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Amount *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Enter amount"
            />
          </div>
          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Amount *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Enter amount"
            />
          </div>

          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Date *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter amount"
            />
          </div>
          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Status *
            </label>
            <select
              type="number"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option> Select</option>
              <option> Collected</option>
              <option> Deposited</option>
              <option> Cleared</option>
              <option> Bounced</option>
              <option> Cancelled</option>
              {/* <option>    Pending
          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Date *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter amount"
            />
          </div>
          <div class="mb-1">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="amount"
            >
              Status *
            </label>
            <select
              type="number"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option> Select</option>
              <option> Collected</option>
              <option> Deposited</option>
              <option> Cleared</option>
              <option> Bounced</option>
              <option> Cancelled</option>
              {/* <option>    Pending
                                      </option> */}
            </select>
          </div>

          {/* <div class="mb-1">
            </select>
          </div>

          {/* <div class="mb-1">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="attach-document">
                    Description
                </label>
                   <textarea className="w-full p-2 border border-gray-300 rounded mt-1"></textarea>

              
            </div> */}

          <div class="flex items-center justify-between">
            <button
              class="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded mt-3"
              type="button"
            >
              Save
            </button>
          </div>

          <div class="flex items-center justify-between">
            <button
              class="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded mt-3"
              type="button"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

const AddClassForm = () => {
  return (
    <div className="bg-gray-100 flex  min-h-screen">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
  );
};

const AddClassForm = () => {
  return (
    <div className="bg-gray-100 flex  min-h-screen">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4 flex items-center">
          <i class="fas fa-edit mr-2"></i> Add / Edit Class
          <i class="fas fa-edit mr-2"></i> Add / Edit Class
        </h2>
        <form>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="sr-no"
            >
              Sr. No <span class="text-red-500">*</span>
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="sr-no"
              type="text"
              value="504"
              readonly
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="group-name"
            >
              Group Name
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="group-name"
              type="text"
              placeholder="Enter Group Name"
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="class"
            >
              Class <span class="text-red-500">*</span>
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="class"
              type="text"
              placeholder="Enter class"
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="section"
            >
              Section <span class="text-red-500">*</span>
            </label>
            <select
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="section"
            >
              <option value="" disabled selected>
                Select section
              </option>
              {/* <!-- Add options here --> */}
            </select>
          </div>
          <div class="flex items-center justify-end">
            <button
              class="bg-purple-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Save
            </button>
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="sr-no"
            >
              Sr. No <span class="text-red-500">*</span>
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="sr-no"
              type="text"
              value="504"
              readonly
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="group-name"
            >
              Group Name
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="group-name"
              type="text"
              placeholder="Enter Group Name"
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="class"
            >
              Class <span class="text-red-500">*</span>
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="class"
              type="text"
              placeholder="Enter class"
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="section"
            >
              Section <span class="text-red-500">*</span>
            </label>
            <select
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="section"
            >
              <option value="" disabled selected>
                Select section
              </option>
              {/* <!-- Add options here --> */}
            </select>
          </div>
          <div class="flex items-center justify-end">
            <button
              class="bg-purple-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};
  );
};

const AddTeacherForm = () => {
  return (
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold mb-6">Create Teacher</h1>
      <form>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Email"
            />
          </div>
const AddTeacherForm = () => {
  return (
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold mb-6">Create Teacher</h1>
      <form>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Email"
            />
          </div>

          <div>
            <label
              for="first-name"
              class="block text-sm font-medium text-gray-700"
            >
              First Name <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="first-name"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="First Name"
            />
          </div>
          <div>
            <label
              for="first-name"
              class="block text-sm font-medium text-gray-700"
            >
              First Name <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="first-name"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="First Name"
            />
          </div>

          <div>
            <label
              for="last-name"
              class="block text-sm font-medium text-gray-700"
            >
              Last Name <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last-name"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Last Name"
            />
          </div>
          <div>
            <label
              for="last-name"
              class="block text-sm font-medium text-gray-700"
            >
              Last Name <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last-name"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Last Name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Gender <span class="text-red-500">*</span>
            </label>

            <div class="mt-2 flex items-center">
              <input
                type="radio"
                id="male"
                name="gender"
                class="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <label
                for="male"
                class="ml-2 block text-sm font-medium text-gray-700"
              >
                Male
              </label>
              <input
                type="radio"
                id="female"
                name="gender"
                class="ml-6 h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <label
                for="female"
                class="ml-2 block text-sm font-medium text-gray-700"
              >
                Female
              </label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Gender <span class="text-red-500">*</span>
            </label>

            <div class="mt-2 flex items-center">
              <input
                type="radio"
                id="male"
                name="gender"
                class="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <label
                for="male"
                class="ml-2 block text-sm font-medium text-gray-700"
              >
                Male
              </label>
              <input
                type="radio"
                id="female"
                name="gender"
                class="ml-6 h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <label
                for="female"
                class="ml-2 block text-sm font-medium text-gray-700"
              >
                Female
              </label>
            </div>
          </div>

          <div>
            <label for="mobile" class="block text-sm font-medium text-gray-700">
              Mobile <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="mobile"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Mobile"
            />
          </div>
          <div>
            <label for="mobile" class="block text-sm font-medium text-gray-700">
              Mobile <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="mobile"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Mobile"
            />
          </div>

          <div>
            <label for="dob" class="block text-sm font-medium text-gray-700">
              Date of Birth <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dob"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Date of Birth"
            />
          </div>

          <div>
            <label
              for="qualification"
              class="block text-sm font-medium text-gray-700"
            >
              Qualification <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="qualification"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Qualification"
            />
          </div>

          <div>
            <label
              for="current-address"
              class="block text-sm font-medium text-gray-700"
            >
              Current Address <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="current-address"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Current Address"
            />
          </div>

          <div>
            <label
              for="permanent-address"
              class="block text-sm font-medium text-gray-700"
            >
              Permanent Address <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="permanent-address"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Permanent Address"
            />
          </div>

          <div>
            <label for="salary" class="block text-sm font-medium text-gray-700">
              Salary <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="salary"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Salary"
            />
          </div>

          <div>
            <label
              for="joining-date"
              class="block text-sm font-medium text-gray-700"
            >
              Joining Date
            </label>
            <input
              type="date"
              id="joining-date"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Joining Date"
            />
          </div>

          <div>
            <label for="image" class="block text-sm font-medium text-gray-700">
              Image <span class="text-red-500">*</span>
            </label>
            <div class="mt-1 flex items-center">
              <input
                type="text"
                id="image"
                class="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Image"
              />
              <button
                type="button"
                class="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Upload
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Status <span class="text-red-500">*</span>
            </label>
            <div class="mt-2 flex items-center">
              <input
                type="radio"
                id="active"
                name="status"
                class="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <label
                for="active"
                class="ml-2 block text-sm font-medium text-gray-700"
              >
                Active
              </label>
              <input
                type="radio"
                id="inactive"
                name="status"
                class="ml-6 h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <label
                for="inactive"
                class="ml-2 block text-sm font-medium text-gray-700"
              >
                Inactive
              </label>
            </div>
          <div>
            <label for="dob" class="block text-sm font-medium text-gray-700">
              Date of Birth <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dob"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Date of Birth"
            />
          </div>

          <div>
            <label
              for="qualification"
              class="block text-sm font-medium text-gray-700"
            >
              Qualification <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="qualification"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Qualification"
            />
          </div>

          <div>
            <label
              for="current-address"
              class="block text-sm font-medium text-gray-700"
            >
              Current Address <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="current-address"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Current Address"
            />
          </div>

          <div>
            <label
              for="permanent-address"
              class="block text-sm font-medium text-gray-700"
            >
              Permanent Address <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="permanent-address"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Permanent Address"
            />
          </div>

          <div>
            <label for="salary" class="block text-sm font-medium text-gray-700">
              Salary <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="salary"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Salary"
            />
          </div>

          <div>
            <label
              for="joining-date"
              class="block text-sm font-medium text-gray-700"
            >
              Joining Date
            </label>
            <input
              type="date"
              id="joining-date"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Joining Date"
            />
          </div>

          <div>
            <label for="image" class="block text-sm font-medium text-gray-700">
              Image <span class="text-red-500">*</span>
            </label>
            <div class="mt-1 flex items-center">
              <input
                type="text"
                id="image"
                class="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Image"
              />
              <button
                type="button"
                class="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Upload
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Status <span class="text-red-500">*</span>
            </label>
            <div class="mt-2 flex items-center">
              <input
                type="radio"
                id="active"
                name="status"
                class="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <label
                for="active"
                class="ml-2 block text-sm font-medium text-gray-700"
              >
                Active
              </label>
              <input
                type="radio"
                id="inactive"
                name="status"
                class="ml-6 h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <label
                for="inactive"
                class="ml-2 block text-sm font-medium text-gray-700"
              >
                Inactive
              </label>
            </div>

            <p class="mt-2 text-sm text-red-500">
              Note: - Activating this will consider in your current subscription
              cycle
            </p>
          </div>
        </div>
      </form>
            <p class="mt-2 text-sm text-red-500">
              Note: - Activating this will consider in your current subscription
              cycle
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
  );
};

const AddSubject = () => {
  return (
    <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 class="text-2xl font-semibold mb-4">Create Subject</h2>
      <p class="text-red-500 mb-4">
        Note: Subject Name, Code & Type should be Unique for Medium
      </p>

      <form>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Medium *</label>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="medium"
                value="arabic"
              />
              <span class="ml-2">Arabic</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="medium"
                value="chinese"
              />
              <span class="ml-2">Chinese</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="medium"
                value="french"
              />
              <span class="ml-2">French</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="medium"
                value="spanish"
              />
              <span class="ml-2">Spanish</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="medium"
                value="gujarati"
              />
              <span class="ml-2">Gujarati</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="medium"
                value="english"
              />
              <span class="ml-2">English</span>
            </label>
          </div>
        </div>
const AddSubject = () => {
  return (
    <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 class="text-2xl font-semibold mb-4">Create Subject</h2>
      <p class="text-red-500 mb-4">
        Note: Subject Name, Code & Type should be Unique for Medium
      </p>

      <form>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Medium *</label>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="medium"
                value="arabic"
              />
              <span class="ml-2">Arabic</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="medium"
                value="chinese"
              />
              <span class="ml-2">Chinese</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="medium"
                value="french"
              />
              <span class="ml-2">French</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="medium"
                value="spanish"
              />
              <span class="ml-2">Spanish</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="medium"
                value="gujarati"
              />
              <span class="ml-2">Gujarati</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="medium"
                value="english"
              />
              <span class="ml-2">English</span>
            </label>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Name *</label>
          <input
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Name"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Name *</label>
          <input
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Name"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Type *</label>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="type"
                value="theory"
              />
              <span class="ml-2">Theory</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="type"
                value="practical"
              />
              <span class="ml-2">Practical</span>
            </label>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Type *</label>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="type"
                value="theory"
              />
              <span class="ml-2">Theory</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio text-purple-600"
                name="type"
                value="practical"
              />
              <span class="ml-2">Practical</span>
            </label>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">
            Subject Code
          </label>
          <input
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Subject Code"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">
            Subject Code
          </label>
          <input
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Subject Code"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">
            Background Color *
          </label>
          <div class="flex items-center">
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Background Color"
            />
            <div class="w-8 h-8 ml-2 bg-black border border-gray-300 rounded-md"></div>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">
            Background Color *
          </label>
          <div class="flex items-center">
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Background Color"
            />
            <div class="w-8 h-8 ml-2 bg-black border border-gray-300 rounded-md"></div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Image *</label>
          <div class="flex items-center">
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Image"
            />
            <button class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md">
              Upload
            </button>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Image *</label>
          <div class="flex items-center">
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Image"
            />
            <button class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md">
              Upload
            </button>
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="reset"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Reset
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const AddContent = ({ onUploadSuccess, editingResource, onEditComplete }) => {
  const [formData, setFormData] = useState({
    class_section_id: '',
    title: '',
    description: '',
    resource_type: '',
    file: null
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (editingResource) {
      setFormData({
        class_section_id: editingResource.class_section_id,
        title: editingResource.title,
        description: editingResource.description || '',
        resource_type: editingResource.resource_type,
        file: null
      });
    }
  }, [editingResource]);

  const fetchClasses = async () => {
    try {
      const response = await getAllClassesDropdown();
      if (response.success && response.data) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      toast.error('Failed to fetch classes');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.class_section_id || !formData.title || !formData.resource_type) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('class_section_id', formData.class_section_id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('resource_type', formData.resource_type);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      let response;
      if (editingResource) {
        response = await updateClassResource(editingResource.resource_id, formDataToSend);
      } else {
        response = await uploadClassResource(formDataToSend);
      }
      
      if (response.success) {
        toast.success(response.message || (editingResource ? 'Content updated successfully' : 'Content uploaded successfully'));
        // Reset form
        setFormData({
          class_section_id: '',
          title: '',
          description: '',
          resource_type: '',
          file: null
        });
        // Reset file input
        const fileInput = document.getElementById('content-file');
        if (fileInput) fileInput.value = '';
        
        // Call appropriate callback
        if (editingResource && onEditComplete) {
          onEditComplete();
        } else if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        toast.error(response.message || (editingResource ? 'Failed to update content' : 'Failed to upload content'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <i className="fas fa-edit text-purple-700 mr-2"></i>
          <h2 className="text-xl font-semibold text-gray-800">
            {editingResource ? 'Edit Content' : 'Add Content'}
          </h2>
        </div>
        {editingResource && (
          <button
            type="button"
            onClick={() => {
              setFormData({
                class_section_id: '',
                title: '',
                description: '',
                resource_type: '',
                file: null
              });
              const fileInput = document.getElementById('content-file');
              if (fileInput) fileInput.value = '';
              if (onEditComplete) onEditComplete();
            }}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Cancel Edit
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="class_section_id"
          >
            Class <span className="text-red-500">*</span>
          </label>
          <select
            id="class_section_id"
            name="class_section_id"
            value={formData.class_section_id}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_name} - {cls.section_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="title"
          >
            Content Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="resource_type"
          >
            Resource Type <span className="text-red-500">*</span>
          </label>
          <select
            id="resource_type"
            name="resource_type"
            value={formData.resource_type}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          >
            <option value="">Select Type</option>
            <option value="assignment">Assignment</option>
            <option value="study_material">Study Material</option>
            <option value="syllabus">Syllabus</option>
            <option value="notes">Notes</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            rows="4"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="content-file"
          >
            Content File {editingResource && <span className="text-sm text-gray-500">(Leave empty to keep current file)</span>}
          </label>
          <input
            type="file"
            id="content-file"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {editingResource && (
            <p className="text-xs text-gray-500 mt-1">
              Current file: <a href={editingResource.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
            </p>
          )}
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
          >
            {loading ? (editingResource ? 'Updating...' : 'Uploading...') : (editingResource ? 'Update' : 'Save')}
          </button>
        </div>
      </form>
    </div>
  );
};
  );
};

export {
  FeeDiscountForm,
  CheckForm,
  CheQueForm,
  AddClassForm,
  AddTeacherForm,
  AddSubject,
  AddContent,
};

export {
  FeeDiscountForm,
  CheckForm,
  CheQueForm,
  AddClassForm,
  AddTeacherForm,
  AddSubject,
  AddContent,
};
