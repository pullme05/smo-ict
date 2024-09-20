import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import CalendarCells from './CalendarCells';
import { Container, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // ตั้งค่า currentDate เป็นวันที่ปัจจุบัน
  const [events, setEvents] = useState<{ [key: number]: string[] }>({}); // เก็บกิจกรรมสำหรับแต่ละวัน
  const [open, setOpen] = useState(false); // สำหรับควบคุมการแสดง Dialog
  const [newEvent, setNewEvent] = useState(''); // เก็บชื่อกิจกรรมใหม่
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // วันที่เลือกสำหรับเพิ่มกิจกรรม

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); // เปลี่ยนไปเดือนก่อนหน้า
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); // เปลี่ยนไปเดือนถัดไป
  };

  const handleToday = () => {
    setCurrentDate(new Date()); // ตั้งวันที่เป็นวันปัจจุบัน
  };

  const handleClickOpen = (day: number) => {
    setSelectedDay(day); // ตั้งค่าหมายเลขวันที่เลือก
    setOpen(true); // เปิด Dialog
  };

  const handleClose = () => {
    setOpen(false); // ปิด Dialog
    setNewEvent(''); // รีเซ็ตชื่อกิจกรรม
  };

  const handleAddEvent = () => {
    if (selectedDay !== null) {
      // ถ้าวันที่เลือกมีค่า
      setEvents((prevEvents) => ({
        ...prevEvents,
        [selectedDay]: [...(prevEvents[selectedDay] || []), newEvent], // เพิ่มกิจกรรมในวันนั้น
      }));
      handleClose(); // ปิด Dialog หลังจากเพิ่มกิจกรรม
    }
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, width: '100%', padding: '16px' }}>
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
        {/* เรียกใช้ component CalendarCells พร้อมส่ง events และ handleClickOpen */}
        <CalendarCells currentDate={currentDate} events={events} onAddEvent={handleClickOpen} />       

        {/* Dialog สำหรับเพิ่มกิจกรรม */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>เพิ่มกิจกรรม</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="กิจกรรม"
              type="text"
              fullWidth
              variant="outlined"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)} // อัปเดตชื่อกิจกรรมใหม่
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              ยกเลิก
            </Button>
            <Button onClick={handleAddEvent} color="primary">
              เพิ่ม
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default App;
