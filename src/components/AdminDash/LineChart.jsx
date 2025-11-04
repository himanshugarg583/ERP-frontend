import React, { useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { Card, CardContent, Typography } from '@mui/material';

// Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LineChart = () => {
  // Sample data: Monthly fee collections in dollars
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const feeData = [2500, 2600, 2450, 2700, 1800, 4650, 3550, 1720, 2680, 1900, 2850, 1950];
  
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
      <BarChart
        xAxis={[{ scaleType: 'band', data: months }]}
        series={[
          {
            data: feeData,
            label: 'Fees Collected',
            color: '#7C3AED',
          },
        ]}
        width={700}
        height={400}
        margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
        grid={{ horizontal: true }} // Subtle horizontal grid lines
        sx={{
          // Custom styling for chart elements
          '& .MuiChartsAxis-line': {
            stroke: '#757575', // Gray axis lines
          },
          '& .MuiChartsAxis-tick': {
            stroke: '#757575',
          },
          '& .MuiChartsAxis-tickLabel': {
            fontFamily: 'Roboto',
            fill: '#424242', // Dark gray labels
          },
          '& .MuiBarElement-root': {
            transition: 'all 0.3s ease', // Smooth hover animation
            '&:hover': {
              opacity: 0.8, // Slight fade on hover
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
    </CardContent>
  </Card>
  );
};

export default LineChart;
