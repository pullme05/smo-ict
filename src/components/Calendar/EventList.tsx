import React from 'react';
import { Box, Typography } from '@mui/material';

interface EventListProps {
  events: { date: number; events: string[] }[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <Box>
      {events.map(({ date, events }) => (
        <Box key={date} mb={2}>
          <Typography variant="h6">
            วันที่ {date}
          </Typography>
          {events.map((event, index) => (
            <Typography key={index} variant="body1">
              • {event}
            </Typography>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default EventList;
