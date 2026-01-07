import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Announcement as AnnouncementIcon, AttachFile } from '@mui/icons-material';
import { getNotices } from '../../helper/requests-method/apiMethods';

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getNotices();
        
        console.log('Notices Response:', response);
        
        // Handle both response formats
        let apiData = null;
        if (response?.data?.data && Array.isArray(response.data.data)) {
          apiData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          apiData = response.data;
        }
        
        if (apiData && apiData.length > 0) {
          // Transform API data to component format
          const transformedData = apiData.map((notice, index) => ({
            id: index + 1,
            title: notice.title,
            description: notice.message,
            target: notice.target,
            attachment: notice.attachment,
          }));
          
          console.log('Transformed Notices:', transformedData);
          setAnnouncements(transformedData);
        } else {
          console.error('Invalid data structure:', apiData);
          setError('No notices available');
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
        setError(error.message || 'Failed to load notices');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Target color mapping (replaces priority)
  const getTargetColor = (target) => {
    switch (target?.toLowerCase()) {
      case 'student':
        return '#4caf50'; // Green
      case 'parent':
        return '#ff9800'; // Orange
      case 'teacher':
        return '#2196f3'; // Blue
      case 'all':
        return '#9c27b0'; // Purple
      default:
        return '#757575'; // Gray
    }
  };

  const handleAttachmentClick = (attachmentUrl) => {
    if (attachmentUrl) {
      // Open attachment in new tab
      const baseUrl = 'https://xd363v4j-5000.inc1.devtunnels.ms';
      window.open(`${baseUrl}/${attachmentUrl}`, '_blank');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'stretch', width: '100%' }}>
        <Card
          sx={{
            width: '100%',
            maxWidth: 'none',
            height: '100%',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
            borderRadius: '12px',
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress size={50} sx={{ color: '#7c3aed' }} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error || announcements.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'stretch', width: '100%' }}>
        <Card
          sx={{
            width: '100%',
            maxWidth: 'none',
            height: '100%',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
            borderRadius: '12px',
          }}
        >
          <CardHeader
            avatar={<AnnouncementIcon sx={{ color: '#7c3aed' }} />}
            title={
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#7c3aed',
                  letterSpacing: '0.5px',
                }}
              >
                Announcements
              </Typography>
            }
          />
          <CardContent>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <Typography variant="body1" color="#666">
                {error || 'No announcements available'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'stretch', width: '100%' }}>
      <Card
        sx={{
          width: '100%',
          maxWidth: 'none',
          height: '100%',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-2px)' },
        }}
      >
        <CardHeader
          avatar={<AnnouncementIcon sx={{ color: '#7c3aed' }} />}
          title={
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#7c3aed',
                letterSpacing: '0.5px',
              }}
            >
              Announcements
            </Typography>
          }
          sx={{ pb: 1, bgcolor: '#fff', borderRadius: '12px 12px 0 0' }}
        />
        <CardContent sx={{ p: 0, maxHeight: 420, overflowY: 'auto' }}>
          <List sx={{ p: 0 }}>
            {announcements.map((announcement, index) => (
              <React.Fragment key={announcement.id}>
                <ListItem
                  sx={{
                    py: 1.5,
                    px: 2,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: '#f0f4f8',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 500,
                          color: '#333',
                          fontSize: '1rem',
                        }}
                      >
                        {announcement.title}
                      </Typography>
                    }
                    secondary={
                      <Box component="div">
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{ color: '#666', mb: 0.5 }}
                        >
                          {announcement.description}
                        </Typography>
                        <Box
                          component="div"
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Chip
                            label={announcement.target?.charAt(0).toUpperCase() + announcement.target?.slice(1)}
                            size="small"
                            sx={{
                              bgcolor: getTargetColor(announcement.target),
                              color: '#fff',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                            }}
                          />
                          {announcement.attachment && (
                            <IconButton
                              size="small"
                              onClick={() => handleAttachmentClick(announcement.attachment)}
                              sx={{
                                color: '#7c3aed',
                                '&:hover': { bgcolor: '#f0e7ff' },
                              }}
                            >
                              <AttachFile fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                </ListItem>
                {index < announcements.length - 1 && (
                  <Divider sx={{ mx: 2, bgcolor: '#e0e0e0' }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnnouncementList;