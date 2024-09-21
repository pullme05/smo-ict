import React from 'react';
import { Grid, Typography } from '@mui/material';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // ชื่อวันทั้ง 7 วัน

const CalendarDays: React.FC = () => {
  return (
    <Grid container>
      {days.map((day) => (
        // สร้าง grid ของแต่ละวัน
        <Grid item xs={1.7} key={day} textAlign="center" p={1}>
          <Typography variant="subtitle2" fontWeight="bold" >{day}</Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default CalendarDays;
