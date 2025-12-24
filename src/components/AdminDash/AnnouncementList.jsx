import React from 'react';
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
} from '@mui/material';
import { Announcement as AnnouncementIcon } from '@mui/icons-material';

const AnnouncementList = () => {
  // Sample announcement data
  const announcements = [
    {
      id: 1,
      title: 'School Holiday Notice',
      description: 'School will remain closed on April 5th for Spring Break.',
      date: '2025-03-25',
      priority: 'High',
    },
    {
      id: 2,
      title: 'Parent-Teacher Meeting',
      description: 'Scheduled on April 10th at 3:00 PM in the auditorium.',
      date: '2025-03-26',
      priority: 'Medium',
    },
    {
      id: 3,
      title: 'Science Fair',
      description: 'Join us on April 15th to showcase student projects!',
      date: '2025-03-27',
      priority: 'Low',
    },
    {
      id: 4,
      title: 'Fee Reminder',
      description: 'Last date for fee submission is April 30th.',
      date: '2025-03-28',
      priority: 'High',
    },
  ];

  // Priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#f44336'; // Red
      case 'Medium':
        return '#ff9800'; // Orange
      case 'Low':
        return '#4caf50'; // Green
      default:
        return '#757575'; // Gray
    }
  };

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
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: '#666', mb: 0.5 }}
                        >
                          {announcement.description}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: '#888' }}
                          >
                            {new Date(announcement.date).toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={announcement.priority}
                            size="small"
                            sx={{
                              bgcolor: getPriorityColor(announcement.priority),
                              color: '#fff',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>
                      </Box>
                    }
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