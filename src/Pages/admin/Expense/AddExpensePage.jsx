import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, DollarSign, Package, TrendingUp } from 'lucide-react'
import StatCards from '../../../components/comman_components/StatsCards'
import ProductTable from '../../../components/Income/IncomeTable'
import AddIncome from '../../../components/Income/IncomeForm'
import Sidebar from '../Sidebar'
import Header from '../../../components/comman_components/Header'
import PageHeader from '../../../components/comman_components/PageHeader'
const AddExpensePage = () => {
  return (

    <div className='bg-gray-100 flex AddStudent'>
        <Sidebar/>
    
    <div className='flex-1 overflow-auto relative z-1'>
      <Header />
      

            {/* STAT DATA  */}
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-7"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            {/* <StatCards name="Fees" icon={Package} value="4,321" color="#6366f1" />
            <StatCards name="Fine" icon={TrendingUp} value="6009" color="#10b981" />
            <StatCards name="Donation" icon={AlertTriangle} value="3212" color="#f59e0b" />
            <StatCards name="Total Revenue" icon={DollarSign} value="654,310" color="#ef4444" /> */}
        </motion.div>

        
            {/* PRODUCT TABLE */}
           <div className='flex flex-col' >
            <PageHeader pageheading ="Income" Subheading="Add Income" className="m-auto"/> 
            {/* <AddIncome/> */}
           
        <ProductTable />

        </div>
            {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* <SalesTrendChart /> */}
          {/* <CategoryDistributionChart/> */}
        </div>


      </main>
    </div>

    </div>
  )
}

export default AddExpensePage;