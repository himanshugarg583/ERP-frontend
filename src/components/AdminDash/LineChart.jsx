import React, { useEffect, useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { getMonthlyFeeCollection } from '../../helper/requests-method/apiMethods';

// Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [months, setMonths] = useState([]);
  const [feeData, setFeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeeCollection = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMonthlyFeeCollection();
        
        console.log('Monthly Fee Collection Response:', response);
        
        // Handle both response formats
        let apiData = null;
        if (response?.data?.data && Array.isArray(response.data.data)) {
          apiData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          apiData = response.data;
        }
        
        if (apiData && apiData.length > 0) {
          // Extract months and amounts
          const monthNames = apiData.map(item => {
            // Convert full month name to 3-letter abbreviation
            const monthMap = {
              'January': 'Jan', 'February': 'Feb', 'March': 'Mar',
              'April': 'Apr', 'May': 'May', 'June': 'Jun',
              'July': 'Jul', 'August': 'Aug', 'September': 'Sep',
              'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
            };
            return monthMap[item.month] || item.month;
          });
          const amounts = apiData.map(item => item.amount);
          
          console.log('Months:', monthNames);
          console.log('Fee Data:', amounts);
          
          setMonths(monthNames);
          setFeeData(amounts);
        } else {
          console.error('Invalid data structure:', apiData);
          setError('No fee collection data available');
        }
      } catch (error) {
        console.error('Error fetching monthly fee collection:', error);
        setError(error.message || 'Failed to load fee collection data');
      } finally {
        setLoading(false);
      }
    };

    fetchFeeCollection();
  }, []);
  
  if (loading) {
    return (
      <Card
        sx={{
          width: '100%',
          boxShadow: 2,
          borderRadius: 2,
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} sx={{ color: '#7C3AED' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error || feeData.length === 0) {
    return (
      <Card
        sx={{
          width: '100%',
          boxShadow: 2,
          borderRadius: 2,
          backgroundColor: '#FFFFFF',
          border: '1px solid #e5e7eb',
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontFamily: 'Roboto', fontWeight: 600, color: '#7C3AED' }}
          >
            Monthly Fee Collection - 2024-25
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <Typography variant="body1" color="#666">
              {error || 'No fee collection data available'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
    sx={{
      width: '100%',
      boxShadow: 2,
      borderRadius: 2,
      backgroundColor: '#FFFFFF',
      border: '1px solid #e5e7eb',
    }}
  >
    <CardContent>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontFamily: 'Roboto', fontWeight: 600, color: '#7C3AED' }}
      >
        Monthly Fee Collection - 2024-25
      </Typography>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <BarChart
          xAxis={[{ scaleType: 'band', data: months }]}
          series={[
            {
              data: feeData,
              label: 'Fees Collected',
              color: '#7C3AED',
            },
          ]}
          height={400}
          margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
          grid={{ horizontal: true }}
          sx={{
            width: '100%',
            minWidth: '600px',
            '& .MuiChartsAxis-line': {
              stroke: '#757575',
            },
            '& .MuiChartsAxis-tick': {
              stroke: '#757575',
            },
            '& .MuiChartsAxis-tickLabel': {
              fontFamily: 'Roboto',
              fill: '#424242',
            },
            '& .MuiBarElement-root': {
              transition: 'all 0.3s ease',
              '&:hover': {
                opacity: 0.8,
              },
            },
          }}
          slotProps={{
            legend: {
              position: { vertical: 'top', horizontal: 'middle' },
              padding: 0,
            },
          }}
        />
      </Box>
    </CardContent>
  </Card>
  );
};

export default LineChart;
