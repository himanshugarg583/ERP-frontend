import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { addIncome } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IncomeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      entry_date: new Date().toISOString().split('T')[0],
      recorded_by: localStorage.getItem('userName') || localStorage.getItem('userEmail') || '',
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Prepare payload for income (without entry_type)
      const payload = {
        category: data.category,
        sub_category: data.sub_category,
        amount: parseFloat(data.amount),
        payment_mode: data.payment_mode,
        transaction_ref: data.transaction_ref || '',
        description: data.description || '',
        entry_date: data.entry_date,
        recorded_by: data.recorded_by,
      };

      const response = await addIncome(payload);
      
      if (response.success || response.message) {
        toast.success(response.message || 'Income added successfully!');
        reset();
        // Trigger refresh of income table
        window.dispatchEvent(new Event('incomeAdded'));
      } else {
        toast.error('Failed to add income');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };
    
    
  return (
    <motion.div
      className='bg-white shadow-sm border border-slate-200 rounded-xl p-5 mb-6 relative z-1'
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.2 }}
    >
      <div className="text-black p-4" style={{padding:'-10px'}}>
        <h2 className="text-xl font-semibold mb-1 flex items-center">
          <i className="fas fa-edit mr-2"></i> Add Income
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-1 gap-4">
            {/* Category */}
            <div className="mb-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category *
              </label>
              <input
                type="text"
                id="category"
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Enter category"
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            {/* Sub Category */}
            <div className="mb-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sub_category">
                Sub Category *
              </label>
              <input
                type="text"
                id="sub_category"
                {...register('sub_category', { required: 'Sub Category is required' })}
                className="w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Enter sub category"
              />
              {errors.sub_category && <p className="text-red-500 text-xs mt-1">{errors.sub_category.message}</p>}
            </div>

            {/* Amount */}
            <div className="mb-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Amount *
              </label>
              <input
                type="number"
                id="amount"
                {...register('amount', { 
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
                className="w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Enter amount"
                step="0.01"
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            </div>

            {/* Payment Mode */}
            <div className="mb-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment_mode">
                Payment Mode *
              </label>
              <select
                id="payment_mode"
                {...register('payment_mode', { required: 'Payment Mode is required' })}
                className="border-gray-300 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-violet-600"
              >
                <option value="">Select</option>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="cheque">Cheque</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
              {errors.payment_mode && <p className="text-red-500 text-xs mt-1">{errors.payment_mode.message}</p>}
            </div>

            {/* Transaction Reference */}
            <div className="mb-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transaction_ref">
                Transaction Reference
              </label>
              <input
                type="text"
                id="transaction_ref"
                {...register('transaction_ref')}
                className="w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Enter transaction reference"
              />
            </div>

            {/* Description */}
            <div className="mb-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows="3"
                className="w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Enter description"
              />
            </div>

            {/* Entry Date */}
            <div className="mb-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="entry_date">
                Entry Date *
              </label>
              <input
                type="date"
                id="entry_date"
                {...register('entry_date', { required: 'Entry Date is required' })}
                className="w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600"
              />
              {errors.entry_date && <p className="text-red-500 text-xs mt-1">{errors.entry_date.message}</p>}
            </div>

            {/* Recorded By */}
            <div className="mb-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recorded_by">
                Recorded By *
              </label>
              <input
                type="text"
                id="recorded_by"
                {...register('recorded_by', { required: 'Recorded By is required' })}
                className="w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="Enter recorded by"
              />
              {errors.recorded_by && <p className="text-red-500 text-xs mt-1">{errors.recorded_by.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded mt-4"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default IncomeForm;
