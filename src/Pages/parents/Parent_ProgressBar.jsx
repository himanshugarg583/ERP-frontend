import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const Parent_ProgressBar = React.memo(({ value, label, color }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, width: '100%' }}>
        <Box sx={{ width: '100%' }}>
            <LinearProgress
                variant="determinate"
                value={value}
                sx={{
                    height: { xs: 6, sm: 8 },
                    borderRadius: 4,
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: color,
                        borderRadius: 4,
                    },
                }}
            />
        </Box>
        {label && (
            <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                {label}
            </Typography>
        )}
    </Box>
));

export default Parent_ProgressBar;