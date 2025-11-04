import React from 'react'
import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import StatCards from '../../../components/comman_components/StatsCards'
import ProductTable from '../../../components/Income/ProductTable'
import AddIncomeHead from '../../../components/Income/IncomeHeadForm'
import Sidebar from '../Sidebar'
import Header from '../../../components/comman_components/Header'

const ExpenseHead = () => {
  return (
    <div className='bg-slate-200 flex AddStudent'>
      <Sidebar />
      <div
        className='overflow-auto relative z-1 flex-col'
        style={{ height: '95vh', width: '100vw', gap: '10px', display: 'flex', transition: 'margin-left 0.3s ease' }}
      >
        <Header />

        <main className="w-full py-6 px-4 md:px-6">
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-7"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Example stat card placeholder */}
            {/* <StatCards name="Expenses" icon={Package} value="0" color="#7C3AED" /> */}
          </motion.div>

          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-12 lg:col-span-4'>
              <div className='bg-white shadow-sm border border-slate-200 rounded-xl p-4 h-full'>
                <AddIncomeHead />
              </div>
            </div>
            <div className='col-span-12 lg:col-span-8'>
              <div className='bg-white shadow-sm border border-slate-200 rounded-xl p-0 h-full'>
                <ProductTable />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ExpenseHead;