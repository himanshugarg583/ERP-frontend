import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { getDashboardStats } from "../../helper/requests-method/apiMethods";

const StatBox = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      if (response.success && response.data) {
        setStatsData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = statsData ? [
    {
      title: 'Total Students',
      value: statsData.students.total.toString(),
      change: '+2.5%',
      trend: 'up',
      icon: Users,
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-50 to-purple-50',
      iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
      textColor: 'text-violet-600'
    },
    {
      title: 'Total Teachers',
      value: statsData.teachers.total.toString(),
      change: '+1.2%',
      trend: 'up',
      icon: GraduationCap,
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Male Students',
      value: statsData.students.male.toString(),
      change: '+0.5%',
      trend: 'up',
      icon: UserCheck,
      gradient: 'from-sky-500 to-blue-600',
      bgGradient: 'from-sky-50 to-blue-50',
      iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600',
      textColor: 'text-sky-600'
    },
    {
      title: 'Female Students',
      value: statsData.students.female.toString(),
      change: '+1.8%',
      trend: 'up',
      icon: UserX,
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50',
      iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
      textColor: 'text-pink-600'
    },
  ] : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;

        return (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{
              y: -8,
              transition: { duration: 0.2 }
            }}
            className="group relative"
          >
            {/* Gradient Background Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

            {/* Card */}
            <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300">
              {/* Top Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-slate-500 text-sm font-medium mb-2">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </h3>
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`${stat.iconBg} p-3 rounded-xl shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
              </div>

              {/* Bottom Section - Trend */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${stat.trend === 'up'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  <TrendIcon className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{stat.change}</span>
                </div>
                <span className="text-xs text-slate-500">vs last month</span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                ></motion.div>
              </div>

              {/* Decorative Element */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full opacity-5 -z-10 blur-2xl group-hover:opacity-10 transition-opacity duration-300`}></div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatBox;
