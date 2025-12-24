import React from "react";

const AddIncomeHead = () => {
  return (
    <div
      className=" flex items-center justify-center mr-4 bg-white rounded-xl shadow-sm border border-slate-200 w-full max-w-lg"
      style={{ height: "400px" }}
    >
      <div className=" text-black p-4" style={{ padding: "-10px" }}>
        <h2 className="text-xl font-semibold mb-1 flex items-center">
          <i className="fas fa-edit mr-2"></i> Add / Edit Income Head
        </h2>

        <form className="">
          <div className="mb-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="other"
            >
              Income Head*
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                defaultValue="Name"
              />
            </label>
          </div>

          <div className="mb-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="amount"
            >
              Amount *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter amount"
            />
          </div>

          <div className="mb-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="attach-document"
            >
              Description
            </label>
            <textarea className="w-full p-2 border border-gray-300 rounded mt-1"></textarea>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
              type="button"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncomeHead;
