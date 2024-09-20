import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

interface CalendarCellsProps {
  currentDate: Date; // รับค่า currentDate เพื่อแสดงผลเดือนปัจจุบัน
}

const CalendarCells: React.FC<CalendarCellsProps> = ({ currentDate }) => {
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // วันเริ่มต้นของเดือน
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // วันสุดท้ายของเดือน
  const daysInMonth = endDate.getDate(); // จำนวนวันทั้งหมดในเดือน
  const firstDayIndex = startDate.getDay(); // หาวันแรกของสัปดาห์ (index)

  const cells: JSX.Element[] = [];

  // เติมช่องว่างก่อนวันแรกของเดือน
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(
      <Grid item xs={1.71} key={`empty-${i}`} p={1}>
        <Box p={2} bgcolor="white"></Box> {/* ช่องว่าง */}
      </Grid>
    );
  }

  // เติมวันในเดือนลงในตาราง
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = currentDate.getDate() === day && new Date().getMonth() === currentDate.getMonth(); 
    
    // ตรวจสอบว่าเป็นวันปัจจุบันหรือไม่
    const highlightColor = isToday ? '#996600' : 'transparent'; // เน้นสีถ้าเป็นวันปัจจุบัน
    const textColor = isToday ? 'white' : 'black'; // เปลี่ยนสีตัวอักษรเป็นสีขาวถ้าเป็นวันปัจจุบัน

    cells.push(
      <Grid item xs={1.71} key={day} p={1} >
        {/* แสดงผลของแต่ละวัน */}
        <Box 
        p={10} bgcolor={highlightColor}  border={1} borderRadius={2}  color={textColor}  
        
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-start"
        height="100%"
        position="relative" // เพิ่ม position: relative           
        >
          <Typography variant="body2" style={{ position: 'absolute', top: '4px', right: '4px' }} >{day}
            </Typography>
        </Box>
        
      </Grid>
    );
  }

  return (
    <Grid container>
      {cells} {/* แสดงตารางวันที่ */}
    </Grid>
  );
};

export default CalendarCells;
