import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './ListView';
import CalendarCells from './CalendarCells';
import { Container, Paper, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Box } from '@mui/material';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<{ [key: number]: string[] }>({});
  const [isListView, setIsListView] = useState(false); // สถานะมุมมองปัจจุบัน
  const [open, setOpen] = useState(false); // สำหรับควบคุม Dialog
  const [newEvent, setNewEvent] = useState(''); // สำหรับเก็บชื่อกิจกรรมใหม่
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // สำหรับเก็บวันที่ที่เลือกเพิ่มกิจกรรม

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleToggleView = () => {
    setIsListView(!isListView);
  };

  const handleClickOpen = (day: number) => {
    setSelectedDay(day); // เก็บวันที่ที่เลือก
    setOpen(true); // เปิด Dialog
  };

  const handleClose = () => {
    setOpen(false); // ปิด Dialog
    setNewEvent(''); // รีเซ็ตชื่อกิจกรรม
  };

  const handleAddEvent = () => {
    if (selectedDay !== null && newEvent.trim()) {
      // เพิ่มกิจกรรมในวันที่เลือก
      setEvents((prevEvents) => ({
        ...prevEvents,
        [selectedDay]: [...(prevEvents[selectedDay] || []), newEvent],
      }));
      handleClose();
    }
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, width: '100%', padding: '16px' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        
        {/* เพิ่ม div สำหรับหัวข้อ "ปฏิทิน" */}
      <Box
      sx={{
        backgroundColor: '#996600',
        color: '#fff',
        padding: '16px',
        textAlign: 'center',
        marginBottom: '16px',
      }}>
      <Typography 
        variant="h4"  // ปรับขนาดของตัวหนังสือให้ใหญ่ขึ้น (สามารถใช้ h3 หากต้องการใหญ่กว่า)
        sx={{
          fontWeight: 'bold',  // ทำให้ตัวหนังสือหนา
        }}>ปฏิทิน</Typography>
      </Box>

        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onToggleView={handleToggleView}
          isListView={isListView}
        />
        {isListView ? (
          // แสดงมุมมองแบบรายการ (List View)
          <List>
            {Object.keys(events).length > 0 ? (
              Object.keys(events).map((day) => (
                events[Number(day)]?.map((event, index) => (
                  <ListItem key={`${day}-${index}`}>
                    <ListItemText primary={`วันที่ ${day}: ${event}`} />
                  </ListItem>
                ))
              ))
            ) : (
              <Typography variant="body1">ไม่มีเหตุการณ์ในเดือนนี้</Typography>
            )}
          </List>
        ) : (
          // แสดงมุมมองแบบปฏิทิน (Calendar View)
          <>
            <CalendarDays />
            <CalendarCells currentDate={currentDate} events={events} onAddEvent={handleClickOpen} />
          </>
        )}

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
              onChange={(e) => setNewEvent(e.target.value)}
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
