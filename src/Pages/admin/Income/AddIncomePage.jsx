import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, DollarSign, Package, TrendingUp } from 'lucide-react'
import StatCards from '../../../components/comman_components/StatsCards'
import IncomeTable from '../../../components/Income/IncomeTable'
import AddIncome from '../../../components/Income/IncomeForm'
import Sidebar from '../Sidebar'
import Header from '../../../components/comman_components/Header'
import PageHeader from '../../../components/comman_components/PageHeader'
import IncomeForm from '../../../components/Income/IncomeForm'
const AddIncomePage = () => {
  return (

    <div className='bg-gray-100 flex AddStudent'>
        <Sidebar/>
    
    <div className=' overflow-auto relative z-1 flex-col' style={{
  height: '95vh',
  width: '100vw',
  gap:'10px',
  display: 'flex',
  transition: 'margin-left 0.3s ease'
}}>
      <Header />

      


      <main className="">
     
        

           
            
      <IncomeForm/>
      <IncomeTable />

         


      </main>
    </div>

    </div>
  )
}

export default AddIncomePage;