import React from 'react';
import { Button, IconButton, Typography, Box } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

interface CalendarHeaderProps {
  currentDate: Date; // วันปัจจุบันที่ส่งเข้ามา
  onPrevMonth: () => void; // ฟังก์ชันที่ใช้เปลี่ยนไปเดือนก่อนหน้า
  onNextMonth: () => void; // ฟังก์ชันที่ใช้เปลี่ยนไปเดือนถัดไป
  onToday: () => void; // ฟังก์ชันที่ใช้ตั้งวันปัจจุบัน
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, onPrevMonth, onNextMonth, onToday }) => {
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); // ดึงข้อมูลชื่อเดือนและปี

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
      <Box>
        {/* ปุ่มเพื่อเปลี่ยนไปเดือนก่อนหน้า */}
        <IconButton onClick={onPrevMonth}>
          <ArrowBackIos />
        </IconButton>
        {/* ปุ่มสำหรับกลับไปวันปัจจุบัน */}
        <Button variant="outlined" onClick={onToday}>
          วันนี้
        </Button>
        {/* ปุ่มเพื่อเปลี่ยนไปเดือนถัดไป */}
        <IconButton onClick={onNextMonth}>
          <ArrowForwardIos />
        </IconButton>
      </Box>
      {/* แสดงชื่อเดือนและปี */}
      <Typography variant="h6">{monthYear}</Typography>
      <Box>
        {/* ปุ่มแสดงแบบเดือน */}
        <Button variant="contained">เดือน</Button>
        {/* ปุ่มแสดงแบบรายการ */}
        <Button variant="outlined" sx={{ ml: 1 }}>รายการ</Button>
      </Box>
    </Box>
  );
};

export default CalendarHeader;
