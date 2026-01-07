import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { getPaymentModeCollection } from '../../helper/requests-method/apiMethods';

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
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ total_transactions: 0, grand_total: 0 });

  // Map payment modes to colors
  const colorMap = {
    cash: colors.greenAccent[500],
    online: colors.blueAccent[500],
    upi: colors.primary[500],
    card: colors.redAccent[500],
    cheque: colors.yellowAccent[500],
    bank_transfer: '#9C27B0', // Purple
  };

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPaymentModeCollection();
        
        console.log('Payment Mode Collection Response:', response);
        console.log('Response data:', response?.data);
        console.log('Response data.data:', response?.data?.data);
        
        // Handle both response formats
        let apiData = null;
        if (response?.data?.data) {
          apiData = response.data.data;
        } else if (response?.data && response?.success) {
          apiData = response.data;
        }
        
        if (apiData && apiData.payment_modes && Array.isArray(apiData.payment_modes)) {
          // Transform API data to chart format
          const chartData = apiData.payment_modes.map((mode, index) => ({
            id: index,
            value: mode.total_amount,
            label: mode.payment_mode.charAt(0).toUpperCase() + mode.payment_mode.slice(1).replace('_', ' '),
            color: colorMap[mode.payment_mode] || colors.grey[700],
            transactions: mode.total_transactions,
          }));
          
          console.log('Chart Data:', chartData);
          console.log('Chart Data Length:', chartData.length);
          
          setPaymentData(chartData);
          setSummary(apiData.summary || { total_transactions: 0, grand_total: 0 });
        } else {
          console.error('Invalid data structure:', apiData);
          setError('Invalid data structure received');
        }
      } catch (error) {
        console.error('Error fetching payment mode collection:', error);
        setError(error.message || 'Failed to load payment data');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress size={60} sx={{ color: colors.primary[500] }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error || paymentData.length === 0) {
    return (
      <Card>
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
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography variant="body1" color={colors.grey[700]}>
              {error || 'No payment data available'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

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
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Box display="flex" justifyContent="center" gap={3}>
            <Typography variant="body2" color={colors.grey[700]}>
              <strong>Total Transactions:</strong> {summary.total_transactions.toLocaleString()}
            </Typography>
            <Typography variant="body2" color={colors.grey[700]}>
              <strong>Grand Total:</strong> ₹{summary.grand_total.toLocaleString()}
            </Typography>
          </Box>
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
          {paymentData.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color={colors.grey[700]} textAlign="center" display="block">
                Hover over slices to see transaction count
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EarningsPieChart;