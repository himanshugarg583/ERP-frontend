import React from "react";
import StatCards from "../../components/comman_components/StatsCards";
// import Header from "../../components/common_components/Header";
// import StatCards from "../../components/common_components/StatCards";
// import IncomeChart from "../../components/overview/IncomeChart";
// import FeeChart from "../../components/overview/FeeChart";
// import ExpenseChart from "../../components/overview/ExpenseChart";

import { motion } from "framer-motion";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";


const OverviewPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-1">
      {/* <Header title="School Dashboard" /> */}

      
      {/* STAT DATA  */}
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-7"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCards name="Total Teachers" icon={Zap} value="8" className="" />
          <StatCards name="Total  Students" icon={Users} value="987" color="#8b5cf6" />
          <StatCards name="Total Classess" icon={ShoppingBag} value="18" color="#ec4899" />
          <StatCards name="Total Subjects" icon={BarChart2} value="14" color="#10b981" />
         {/* <div>helo</div> */}
        </motion.div>


        {/* CHARTS */}
         {/* lg:grid-cols-2 gap-5 */}
        <div className="grid grid-cols-1  gap-5">
          {/* <IncomeChart /> */}
          
          {/* <ExpenseChart /> */}
          {/* <CategoryDistributionChart /> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* <FeeChart /> */}
          {/* <FeeChart /> */}
          </div>

          
          
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
