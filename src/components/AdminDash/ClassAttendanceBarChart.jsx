import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, Typography, Box, CircularProgress } from '@mui/material';
import { getClassWiseAttendance } from '../../helper/requests-method/apiMethods';

const ClassAttendanceBarChart = () => {
  const [classData, setClassData] = useState([]);
  const [presentData, setPresentData] = useState([]);
  const [absentData, setAbsentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getClassWiseAttendance();
        
        console.log('Class-wise Attendance Response:', response);
        
        // Handle both response formats
        let apiData = null;
        if (response?.data?.data && Array.isArray(response.data.data)) {
          apiData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          apiData = response.data;
        }
        
        if (apiData && apiData.length > 0) {
          const classes = apiData.map(item => item.class);
          const present = apiData.map(item => item.present);
          const absent = apiData.map(item => item.absent);
          
          console.log('Classes:', classes);
          console.log('Present:', present);
          console.log('Absent:', absent);
          
          setClassData(classes);
          setPresentData(present);
          setAbsentData(absent);
        } else {
          console.error('Invalid data structure:', apiData);
          setError('No attendance data available');
        }
      } catch (error) {
        console.error('Error fetching class-wise attendance:', error);
        setError(error.message || 'Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

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
      formatter: (val) => Math.round(val),
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
        text: 'Number of Students',
        style: {
          fontSize: '14px',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 600,
          color: '#666',
        },
      },
      labels: {
        formatter: (val) => Math.round(val),
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
        formatter: (val) => `${Math.round(val)} students`,
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          sx={{
            maxWidth: 900,
            width: '100%',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="350px">
              <CircularProgress size={60} sx={{ color: '#1976d2' }} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error || classData.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          sx={{
            maxWidth: 900,
            width: '100%',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
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
          />
          <CardContent>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <Typography variant="body1" color="#666">
                {error || 'No attendance data available'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

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