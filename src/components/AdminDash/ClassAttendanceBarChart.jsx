import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';

const ClassAttendanceBarChart = () => {
  // Sample data: Present and Absent percentages for each class
  const classData = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5','Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  const presentData = [85, 92, 78, 95, 88,85, 92, 78, 95, 88]; // Present percentages
  const absentData = [15, 8, 22, 5, 12,15, 8, 22, 5, 12]; // Absent percentages (100 - present)

  // Chart options with enhanced styling
  const options = {
    chart: {
      type: 'bar',
      height: 350,
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
      background: '#fafafa',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        endingShape: 'rounded',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      style: {
        fontSize: '12px',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 500,
        colors: ['#ffffff'],
      },
      offsetY: -20,
      background: {
        enabled: true,
        foreColor: '#000000',
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#1976d2',
        opacity: 0.9,
      },
    },
    xaxis: {
      categories: classData,
      title: {
        text: 'Classes',
        style: {
          fontSize: '14px',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 600,
          color: '#666',
        },
      },
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Roboto, sans-serif',
          colors: Array(classData.length).fill('#888'),
        },
      },
    },
    yaxis: {
      title: {
        text: 'Attendance (%)',
        style: {
          fontSize: '14px',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 600,
          color: '#666',
        },
      },
      min: 0,
      max: 100,
      labels: {
        formatter: (val) => `${val}%`,
        style: {
          fontSize: '12px',
          fontFamily: 'Roboto, sans-serif',
          colors: Array(11).fill('#888'),
        },
      },
    },
    colors: ['#1976d2', '#f44336'], // Blue for Present, Red for Absent
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: ['#42a5f5', '#ef5350'], // Lighter blue and red
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.85,
        stops: [0, 100],
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
        fontFamily: 'Roboto, sans-serif',
      },
      y: {
        formatter: (val) => `${val}%`,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '12px',
      fontFamily: 'Roboto, sans-serif',
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
    },
    grid: {
      borderColor: '#e0e0e0',
      strokeDashArray: 4,
    },
  };

  // Chart series
  const series = [
    {
      name: 'Present',
      data: presentData,
    },
    {
      name: 'Absent',
      data: absentData,
    },
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card
        sx={{
          maxWidth: 900,
          width: '100%',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
          overflow: 'hidden',
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
                textAlign: 'center',
                fontWeight: 600,
                color: '#1976d2',
                letterSpacing: '0.5px',
              }}
            >
              Class-wise Attendance
            </Typography>
          }
          sx={{ pb: 1 }}
        />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ width: '100%', bgcolor: '#fff', borderRadius: '8px', p: 1 }}>
            <Chart
              options={options}
              series={series}
              type="bar"
              width="100%"
              height={350}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClassAttendanceBarChart;