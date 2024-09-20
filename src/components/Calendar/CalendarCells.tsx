import React from 'react';
import { Grid, Box, Typography, List, ListItem, Button } from '@mui/material';

interface CalendarCellsProps {
  currentDate: Date;
  events?: { [key: number]: string[] }; // ประกาศ props events ซึ่งอาจจะเป็น undefined ได้
  onAddEvent: (day: number) => void; // เพิ่ม prop สำหรับฟังก์ชันเพิ่มกิจกรรม
}

const CalendarCells: React.FC<CalendarCellsProps> = ({ currentDate, events = {}, onAddEvent }) => {
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = endDate.getDate();
  const firstDayIndex = startDate.getDay();

  const cells: JSX.Element[] = [];

  // เติมช่องว่างก่อนวันแรกของเดือน
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(
      <Grid item xs={1.71} key={`empty-${i}`} p={1}>
        <Box p={2} bgcolor="white"></Box>
      </Grid>
    );
  }

  // เติมวันในเดือนลงในตาราง
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = currentDate.getDate() === day && new Date().getMonth() === currentDate.getMonth();
    const highlightColor = isToday ? '#996600' : 'transparent';
    const textColor = isToday ? 'white' : 'black';

    const dayEvents = events[day] || []; // ใช้ events[day] ถ้ามีค่า ถ้าไม่มีก็ใช้ array ว่าง

    cells.push(
      <Grid item xs={1.7} key={day} p={1}>
        <Box 
          p={2}
          bgcolor={highlightColor}
          border={1}
          borderRadius={2}
          color={textColor}
          height="100%"
          position="relative"
        >
          <Typography 
            variant="body2" 
            style={{ position: 'absolute', top: '4px', right: '4px' }}
          >
            {day}
          </Typography>

          {/* ปุ่มสำหรับเพิ่มกิจกรรม */}
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => onAddEvent(day)} // เรียกใช้ฟังก์ชัน onAddEvent เมื่อคลิก
            style={{ position: 'absolute', bottom: '4px', left: '4px',padding: '4px',cursor: 'pointer' }}
          >
            +
          </Button>

          <List sx={{ mt: 20 }}>
            {dayEvents.map((event, index) => (
              <ListItem key={index} sx={{ fontSize: '12px', padding: '2px 0' }}>
                {event}
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
    );
  }

  return <Grid container>{cells}</Grid>;
};

export default CalendarCells;
