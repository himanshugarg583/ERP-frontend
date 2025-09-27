import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography, Card, CardContent } from '@mui/material';

// Define enhanced colors and gradients
const colors = {
  primary: { 500: '#3F51B5', 300: '#7986CB' }, // Indigo shades
  grey: { 100: '#F5F5F5', 700: '#616161', 900: '#212121' },
  greenAccent: { 500: '#4CAF50', 300: '#81C784' }, // Green shades
};

const IncomeExpenseLineChart = () => {
  // Sample data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const incomeData = [1200, 1500, 1300, 1700, 2000, 1800, 1600, 1900, 1750, 2100, 2200, 2500];
  const expenseData = [800, 900, 850, 1000, 1200, 1100, 950, 1050, 1000, 1300, 1250, 1400];

  return (
    <Card
      sx={{
        maxWidth: 800,
        maxHeight: 500,
        margin: 'auto',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)', // Softer, deeper shadow
        borderRadius: '16px', // More pronounced rounding
        
        overflow: 'hidden', // Ensures content respects border radius
      }}
    >
      <CardContent>
        <Typography
          variant="h4"
          fontWeight="700"
          color={colors.grey[900]}
          gutterBottom
          textAlign="center"
          sx={{
            letterSpacing: '0.5px',
            background: `linear-gradient(90deg, ${colors.primary[500]}, ${colors.greenAccent[500]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', // Gradient text effect
          }}
        >
          Monthly Income vs Expenses - 2025
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            '&:hover .MuiLineElement-root': {
              strokeWidth: 3, // Thicken lines on hover
              transition: 'stroke-width 0.3s ease',
            },
          }}
        >
          <LineChart
            xAxis={[{ data: months, scaleType: 'point' }]}
            series={[
              {
                data: incomeData,
                label: 'Income ',
                color: colors.primary[500],
                area: true, // Add filled area under the line
                curve: 'catmullRom', // Smooth curves
                showMark: true, // Show markers
                markSize: 6,
                valueFormatter: (value) => `${value.toLocaleString()}`, // Tooltip formatting
              },
              {
                data: expenseData,
                label: 'Expenses ',
                color: colors.greenAccent[500],
                area: true,
                curve: 'catmullRom',
                showMark: true,
                markSize: 6,
                valueFormatter: (value) => `${value.toLocaleString()}`,
              },
            ]}
            width={800}
            height={450}
            margin={{ top: 40, right: 40, bottom: 60, left: 80 }}
            grid={{ vertical: true, horizontal: true }}
            sx={{
              '& .MuiLineElement-root': {
                strokeWidth: 2,
                transition: 'stroke-width 0.3s ease',
              },
              '& .MuiAreaElement-root': {
                fillOpacity: 0.2, // Subtle gradient fill
                fill: (series) =>
                  series.id === 0
                    ? `url(#income-gradient)`
                    : `url(#expense-gradient)`,
              },
              '& .MuiMarkElement-root': {
                fill: (series) =>
                  series.id === 0 ? colors.primary[500] : colors.greenAccent[500],
                stroke: '#fff',
                strokeWidth: 2,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.5)', // Enlarge markers on hover
                },
              },
              '& .MuiChartsAxis-line': {
                stroke: colors.grey[700],
                strokeWidth: 1,
              },
              '& .MuiChartsAxis-tick': {
                stroke: colors.grey[700],
              },
              '& .MuiChartsAxis-tickLabel': {
                fontFamily: 'Roboto',
                fill: colors.grey[900],
                fontSize: '14px',
                fontWeight: 500,
              },
              '& .MuiChartsGrid-line': {
                stroke: colors.grey[700],
                strokeOpacity: 0.2, // Very subtle grid
              },
            }}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'top', horizontal: 'middle' },
                padding: { bottom: 20 },
                itemMarkWidth: 20,
                itemMarkHeight: 4,
                labelStyle: {
                  fontFamily: 'Roboto',
                  fontSize: '16px',
                  fontWeight: 500,
                  fill: colors.grey[900],
                },
              },
            }}
          >
            {/* Gradient Definitions for Area Fill */}
            <defs>
              <linearGradient id="income-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary[300]} stopOpacity={0.8} />
                <stop offset="100%" stopColor={colors.primary[500]} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expense-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.greenAccent[300]} stopOpacity={0.8} />
                <stop offset="100%" stopColor={colors.greenAccent[500]} stopOpacity={0} />
              </linearGradient>
            </defs>
          </LineChart>
        </Box>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseLineChart;