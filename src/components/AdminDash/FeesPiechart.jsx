import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getFeeAssignmentCollection } from '../../helper/requests-method/apiMethods';

const FeesPiechart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFeeAssignmentCollection();
        
        console.log('Fee Assignment Collection Response:', response);
        
        // Handle both response formats
        let apiData = null;
        if (response?.data?.data) {
          apiData = response.data.data;
        } else if (response?.data) {
          apiData = response.data;
        }
        
        if (apiData) {
          // Transform API data to chart format
          const chartData = [
            { id: 0, value: apiData.total_fee_assigned || 0, label: 'Total Fee Assigned', color: '#2196F3' },
            { id: 1, value: apiData.total_collected || 0, label: 'Total Collected', color: '#4CAF50' },
            { id: 2, value: apiData.total_fine_collected || 0, label: 'Total Fine Collected', color: '#FF9800' },
            { id: 3, value: apiData.total_discount || 0, label: 'Total Discount', color: '#9C27B0' },
            { id: 4, value: apiData.total_due || 0, label: 'Total Due', color: '#F44336' },
          ].filter(item => item.value > 0); // Only show slices with non-zero values
          
          console.log('Chart Data:', chartData);
          setData(chartData);
        } else {
          console.error('Invalid data structure:', apiData);
          setError('No fee data available');
        }
      } catch (error) {
        console.error('Error fetching fee assignment collection:', error);
        setError(error.message || 'Failed to load fee data');
      } finally {
        setLoading(false);
      }
    };

    fetchFeeData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: '#7C3AED' }} />
      </Box>
    );
  }

  if (error || data.length === 0) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Fee Collection Breakdown
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <Typography variant="body1" color="#666">
            {error || 'No fee data available'}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: -2, 
          fontWeight: 600,
          color: '#7C3AED',
          textAlign: 'center'
        }}
      >
        Fee Collection Breakdown
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <PieChart
          series={[
            {
              data,
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 2,
              cornerRadius: 5,
              highlightScope: { faded: 'global', highlighted: 'item' },
              valueFormatter: (item) => `₹${item.value.toLocaleString()}`,
            },
          ]}
          width={320}
          height={500}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: 0,
              itemMarkWidth: 20,
              itemMarkHeight: 2,
              labelStyle: {
                fontSize: 12,
                fill: '#666',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default FeesPiechart;