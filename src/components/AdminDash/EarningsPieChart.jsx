import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, Card, CardContent } from '@mui/material';

// Define colors (Material Design-inspired)
const colors = {
  primary: { 500: '#3F51B5' }, // Indigo
  grey: { 100: '#F5F5F5', 700: '#616161' },
  greenAccent: { 500: '#4CAF50' }, // Green
  redAccent: { 500: '#F44336' },   // Red
  blueAccent: { 500: '#2196F3' },  // Blue
  yellowAccent: { 500: '#FFEB3B' }, // Yellow
};

const EarningsPieChart = () => {
  // Sample data for payment modes
  const paymentData = [
    { id: 0, value: 1200, label: 'Cash', color: colors.greenAccent[500] },
    { id: 1, value: 1800, label: 'Online', color: colors.blueAccent[500] },
    { id: 2, value: 900, label: 'Cheque', color: colors.redAccent[500] },
    { id: 3, value: 1500, label: 'App', color: colors.yellowAccent[500] },
  ];

  return (
    <Card
      sx={{
        // maxWidth: 620,
        // margin: 'auto',
        // boxShadow: 3, // Material Design elevation
        // borderRadius: 2,
        // backgroundColor: colors.grey[100],
        // p: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          fontWeight="600"
          color={colors.primary[500]}
          gutterBottom
          textAlign="center"
        >
          Earnings by Payment Mode - 2025
        </Typography>
        <Box display="flex" justifyContent="center">
          <PieChart
            series={[
              {
                data: paymentData,
                innerRadius: 30, // Donut-style pie chart
                outerRadius: 100,
                paddingAngle: 2, // Space between slices
                cornerRadius: 4, // Rounded edges
                highlightScope: { faded: 'global', highlighted: 'item' }, // Hover effect
                faded: { innerRadius: 20, additionalRadius: -10, color: 'gray' },
              },
            ]}
            width={400}
            height={300}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
                padding: 0,
                itemMarkWidth: 20,
                itemMarkHeight: 2,
                labelStyle: {
                  fontFamily: 'Roboto',
                  fontSize: 14,
                  fill: colors.grey[700],
                },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default EarningsPieChart;