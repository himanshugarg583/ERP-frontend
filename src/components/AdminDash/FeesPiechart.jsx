import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Margin } from '@mui/icons-material';

const FeesPiechart = () => {
  // Sample data for the pie chart
  const data = [
    { id: 0, value: 100000, label: 'Total Fee Assigned' },
    { id: 1, value: 60000, label: 'Total Collected' },
    { id: 2, value: 5000, label: 'Total Fine Collected' },
    { id: 3, value: 10000, label: 'Total Discount' },
    { id: 4, value: 25000, label: 'Total Due' },
  ];

  return (
    <div >
      <h2 style={{ marginBottom: '-100px' }}>Fee Collection Breakdown</h2>
      <PieChart style={{ marginRight: '-70px' }}
        series={[
          {
            data,
            innerRadius: 30, // Optional: Creates a donut-like effect

            outerRadius: 100,
            paddingAngle: 2, // Space between slices
            cornerRadius: 5, // Rounded edges
            highlightScope: { faded: 'global', highlighted: 'item' }, // Highlight interaction
            // faded: { innerRadius: 30, additionalRadius: -20, color: 'gray' }, // Faded style
          },
        ]}
        width={320}
        height={500}
        
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            // MarginRight: 140,
            // padding:40,
          },
        }}
      />
    </div>
  );
};

export default FeesPiechart;