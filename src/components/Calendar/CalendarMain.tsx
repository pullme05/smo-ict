// Calendar เป็น component หลักที่รวมทุกอย่างเข้าด้วยกัน
// CalendarHeader จัดการส่วนหัวของปฏิทิน (ชื่อเดือนและปี)
// CalendarDays แสดงชื่อวันของสัปดาห์
// CalendarCells แสดงวันของเดือนโดยจัดเรียงเป็นตาราง
import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import CalendarCells from './CalendarCells';
import { Container, Paper } from '@mui/material';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // ตั้งค่า currentDate เป็นวันที่ปัจจุบัน

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); // เปลี่ยนไปเดือนก่อนหน้า
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); // เปลี่ยนไปเดือนถัดไป
  };

  const handleToday = () => {
    setCurrentDate(new Date()); // ตั้งวันที่เป็นวันปัจจุบัน
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* เรียกใช้ component CalendarHeader */}
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />
        {/* เรียกใช้ component CalendarDays */}
        <CalendarDays />
        {/* เรียกใช้ component CalendarCells */}
        <CalendarCells currentDate={currentDate} />
      </Paper>
    </Container>
  );
};

export default App;
