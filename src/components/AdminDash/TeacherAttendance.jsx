import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';

// Attendance data
const studentAttendanceData = [
  { name: 'Present', value: 420 },
  { name: 'Absent', value: 80 },
];

const teacherAttendanceData = [
  { name: 'Present', value: 35 },
  { name: 'Absent', value: 5 },
];

// Color palette
const COLORS = {
  studentPresent: '#4CAF50',  // Green
  studentAbsent: '#FF5722',   // Deep Orange
  teacherPresent: '#2196F3', // Blue
  teacherAbsent: '#F44336',  // Red
};

const TeacherAttendance = () => {
  // Options for the outer circle (Students)
  const studentOptions = {
    chart: {
      type: 'donut',
      height: 350,
      background: 'transparent',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    labels: ['Present', 'Absent'],
    colors: [COLORS.studentPresent, COLORS.studentAbsent],
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        const value = opts.w.config.series[opts.seriesIndex];
        return `${value} (${val.toFixed(0)}%)`;
      },
      style: {
        fontSize: '14px',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 'bold',
        colors: ['#fff'],
      },
      background: {
        enabled: true,
        foreColor: '#000',
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.9,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%', // Outer ring thickness
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Students',
              fontSize: '16px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 600,
              color: COLORS.studentPresent,
              formatter: () => studentAttendanceData.reduce((sum, entry) => sum + entry.value, 0),
            },
          },
        },
      },
    },
    stroke: {
      width: 2,
      colors: ['#fff'],
    },
    legend: { show: false }, // Legend handled manually below
    tooltip: {
      style: { fontSize: '12px', fontFamily: 'Roboto, sans-serif' },
      y: { formatter: (val) => `${val}` },
    },
  };

  // Options for the inner circle (Teachers)
  const teacherOptions = {
    chart: {
      type: 'donut',
      height: 350,
      background: 'transparent',
    },
    labels: ['Present', 'Absent'],
    colors: [COLORS.teacherPresent, COLORS.teacherAbsent],
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        const value = opts.w.config.series[opts.seriesIndex];
        return `${value} (${val.toFixed(0)}%)`;
      },
      style: {
        fontSize: '12px',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 'bold',
        colors: ['#fff'],
      },
      background: {
        enabled: true,
        foreColor: '#000',
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.9,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '40%', // Inner ring thickness
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Teachers',
              fontSize: '14px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 600,
              color: COLORS.teacherPresent,
              formatter: () => teacherAttendanceData.reduce((sum, entry) => sum + entry.value, 0),
            },
          },
        },
      },
    },
    stroke: {
      width: 2,
      colors: ['#fff'],
    },
    legend: { show: false }, // Legend handled manually below
    tooltip: {
      style: { fontSize: '12px', fontFamily: 'Roboto, sans-serif' },
      y: { formatter: (val) => `${val}` },
    },
  };

  // Series data
  const studentSeries = studentAttendanceData.map((entry) => entry.value);
  const teacherSeries = teacherAttendanceData.map((entry) => entry.value);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <Card
        sx={{
          width: '100%',
          maxWidth: 500,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        }}
      >
        <CardHeader
          title={
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1976d2',
                letterSpacing: '0.5px',
                textAlign: 'center',
              }}
            >
              Attendance Overview
            </Typography>
          }
          sx={{ pb: 1, bgcolor: '#fff', borderRadius: '16px 16px 0 0' }}
        />
        <CardContent sx={{ p: 2, position: 'relative', height: 350 }}>
          {/* Outer Circle - Students */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Chart
              options={studentOptions}
              series={studentSeries}
              type="donut"
              width="100%"
              height={350}
            />
          </Box>
          {/* Inner Circle - Teachers */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Chart
              options={teacherOptions}
              series={teacherSeries}
              type="donut"
              width="100%"
              height={350}
            />
          </Box>
        </CardContent>
        {/* Custom Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, bgcolor: COLORS.studentPresent, borderRadius: '50%', mr: 1 }} />
            <Typography variant="caption" sx={{ color: '#666' }}>
              Students Present
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, bgcolor: COLORS.studentAbsent, borderRadius: '50%', mr: 1 }} />
            <Typography variant="caption" sx={{ color: '#666' }}>
              Students Absent
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, bgcolor: COLORS.teacherPresent, borderRadius: '50%', mr: 1 }} />
            <Typography variant="caption" sx={{ color: '#666' }}>
              Teachers Present
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, bgcolor: COLORS.teacherAbsent, borderRadius: '50%', mr: 1 }} />
            <Typography variant="caption" sx={{ color: '#666' }}>
              Teachers Absent
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default TeacherAttendance;