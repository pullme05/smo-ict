import React, { useState } from 'react';
import CalendarHeader from './CalendarHeaderAM';
import CalendarDays from './ListViewAM';
import CalendarCells from './CalendarCellsAM';
import { Container, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography } from '@mui/material';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<{ [key: string]: { [key: number]: { title: string, details: string }[] } }>({});
  const [isListView, setIsListView] = useState(false);  // เพิ่ม state สำหรับการ toggle view
  const [open, setOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDetails, setNewEventDetails] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // ฟังก์ชันสำหรับเปลี่ยนเดือน
  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleToday = () => setCurrentDate(new Date());
  const handleToggleView = () => setIsListView(!isListView);  // ฟังก์ชัน toggle view

  // ฟังก์ชันสำหรับเปิด/ปิด Dialog
  const handleClickOpen = (day: number) => {
    setSelectedDay(day);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewEventTitle('');
    setNewEventDetails('');
    setSelectedDay(null);
  };

  // ฟังก์ชันสำหรับเพิ่มกิจกรรม
  const handleAddEvent = () => {
    if (selectedDay !== null && newEventTitle.trim()) {
      const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
      
      setEvents((prevEvents) => ({
        ...prevEvents,
        [monthKey]: {
          ...prevEvents[monthKey],
          [selectedDay]: [...(prevEvents[monthKey]?.[selectedDay] || []), { title: newEventTitle, details: newEventDetails }]
        }
      }));

      handleClose();
    }
  };

  // ฟังก์ชันสำหรับลบกิจกรรม
  const handleDeleteEvent = (day: number, eventTitle: string) => {
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      const dayEvents = updatedEvents[monthKey]?.[day] || [];

      // ลบกิจกรรมที่มีชื่อเดียวกัน
      const filteredEvents = dayEvents.filter(event => event.title !== eventTitle);

      if (filteredEvents.length > 0) {
        updatedEvents[monthKey][day] = filteredEvents;
      } else {
        delete updatedEvents[monthKey][day];  // ลบวันที่ถ้าไม่มีเหตุการณ์เหลือ
      }

      if (Object.keys(updatedEvents[monthKey]).length === 0) {
        delete updatedEvents[monthKey];  // ลบเดือนถ้าไม่มีวันเหลือ
      }

      return updatedEvents;
    });
  };

  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  const monthEvents = events[monthKey] || {};

  return (
    <Container maxWidth={false} sx={{ mt: 4, width: '100%', padding: '16px' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ backgroundColor: '#996600', color: '#fff', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>ปฏิทิน</Typography>
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
          <Typography>มุมมองรายการ ยังไม่ได้สร้าง</Typography>
        ) : (
          <>
            <CalendarDays />
            <CalendarCells
              currentDate={currentDate}
              events={monthEvents}
              onAddEvent={handleClickOpen}
              onDeleteEvent={handleDeleteEvent}
            />
          </>
        )}

        {/* Dialog สำหรับเพิ่มกิจกรรม */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>เพิ่มกิจกรรม</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="ชื่อกิจกรรม"
              fullWidth
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="รายละเอียดกิจกรรม"
              fullWidth
              multiline
              rows={3}
              value={newEventDetails}
              onChange={(e) => setNewEventDetails(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">ยกเลิก</Button>
            <Button onClick={handleAddEvent} color="primary">เพิ่มกิจกรรม</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default App;
