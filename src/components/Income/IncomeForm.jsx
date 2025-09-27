import React from "react";
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion'

    const IncomeForm = () => {
        const {
          register,
          handleSubmit,
          formState: { errors },
          watch,
        } = useForm({
          defaultValues: {
            date: '08-01-2025',
            otherName: 'Name',
          }
        });
      
        // Watch income head to get the amount if needed
        const selectedIncomeHead = watch('incomeHead');
      
        const onSubmit = (data) => {
          console.log(data);
          // Handle form submission here
        };
    
    
    return(

      <motion.div
                  className='bg-white shadow-lg backdrop-blur-md rounded-xl p-5 mb-6 relative z-1'
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
              >
        {/* <div className=" flex items-center justify-center mr-4 bg-white  rounded-lg shadow-lg w-full h-full max-w-lg overflow-x-auto " style={{}} > */}
            <div className=" text-black p-4" style={{padding:'-10px'}}>
        <h2 className="text-xl font-semibold mb-1 flex items-center">
            <i class="fas fa-edit mr-2"></i> Add / Edit Income
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="">
      {/* Income Head */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="mb-1">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="income-head">
          Income Head*
        </label>
        <select
          id="income-head"
          {...register('incomeHead', { required: 'Income Head is required' })}
          className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select</option>
          <option value="2" data-amount="20">Demo (20)</option>
          <option value="3" data-amount="100000">Scholership (100000)</option>
          <option value="4" data-amount="10000">bnm (10000)</option>
          <option value="5" data-amount="2200">test income head nitesh (2200)</option>
          <option value="6" data-amount="1234689">Testings (1234689)</option>
          <option value="7" data-amount="10000">test (10000)</option>
          <option value="9" data-amount="1230">lightng (1230)</option>
          <option value="10" data-amount="50000">picnic (50000)</option>
          {/* Add other options as needed */}
        </select>
        {errors.incomeHead && <p className="text-red-500 text-xs mt-1">{errors.incomeHead.message}</p>}
      </div>

      {/* Account Type */}
      <div className="mb-1">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="account-type">
          Account Type
        </label>
        <select
          id="account-type"
          {...register('accountType')}
          className="border  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
        >
          <option value="">Select</option>
          <option value="1">Saving's A/C</option>
          <option value="2">Salary</option>
          <option value="5">Current</option>
          <option value="6">Offical Account</option>
          {/* Add other options as needed */}
        </select>
      </div>

      {/* Account Name */}
      <div className="mb-1">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="account-name">
          Account Name
        </label>
        <select
          id="account-name"
          {...register('accountName')}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
        >
          <option value="">Select</option>
          <option value="2">Salary Account</option>
          <option value="5">Current Account</option>
          <option value="6">Offical Account</option>
          <option value="7">LIC Account</option>
        </select>
      </div>

      {/* Income From */}
      <div className="mb-1">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="income-from">
          Income From*
        </label>
        <select
          id="income-from"
          {...register('incomeFrom', { required: 'Income From is required' })}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300"
        >
          <option value="">Select</option>
          <option value="2">Other</option>
          <option value="5">Student</option>
        </select>
        {errors.incomeFrom && <p className="text-red-500 text-xs mt-1">{errors.incomeFrom.message}</p>}
      </div>

      {/* Other/Student Name */}
      <div className="mb-1">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="other">
          Other/Student Name*
        </label>
        <input
          type="text"
          {...register('otherName', { required: 'Name is required' })}
          className="w-full px-3 py-2 border rounded border-gray-300"
        />
        {errors.otherName && <p className="text-red-500 text-xs mt-1">{errors.otherName.message}</p>}
      </div>

      {/* Amount */}
      <div className="mb-1">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Amount *
        </label>
        <input
          type="number"
          {...register('amount', { 
            required: 'Amount is required',
            min: { value: 1, message: 'Amount must be greater than 0' }
          })}
          className="w-full px-3 py-2 border rounded border-gray-300"
          placeholder="Enter amount"
        />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
      </div>

      {/* Date */}
      <div className="mb-1">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          Date *
        </label>
        <input
          type="text"
          {...register('date', { required: 'Date is required' })}
          className="w-full px-3 py-2 border rounded border-gray-300"
          readOnly
        />
      </div>

      {/* Payment Mode */}
      <div className="mb-1">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment-mode">
          Payment Mode*
        </label>
        <select
          id="payment-mode"
          {...register('paymentMode', { required: 'Payment Mode is required' })}
          className="border-gray-300 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select</option>
          <option value="2">Cash</option>
          <option value="5">Check</option>
          <option value="6">Online</option>
          <option value="7">Draft</option>
        </select>
        {errors.paymentMode && <p className="text-red-500 text-xs mt-1">{errors.paymentMode.message}</p>}
      </div>

      {/* Attach Document */}
      <div className="mb-1">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attach-document">
          Attach Document
        </label>
        <input
          type="file"
          {...register('document')}
          className="border-gray-300 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      </div>
      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800"
        >
          Save
        </button>
      </div>
    </form>


    </div>

        {/* </div> */}
        </motion.div>

    )
}

export default IncomeForm;
