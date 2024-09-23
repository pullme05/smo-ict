import React, { useState } from 'react';
import { Grid, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,  } from '@mui/material';

interface CalendarCellsProps {
  currentDate: Date;
  events?: { [key: number]: { title: string; details: string }[] };
  onAddEvent: (day: number) => void;
  onDeleteEvent: (day: number, title: string) => void;
}

const CalendarCellsAM: React.FC<CalendarCellsProps> = ({ currentDate, events = {}, onAddEvent, onDeleteEvent }) => {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ title: string; details: string } | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleClickOpen = (day: number, event: { title: string; details: string }) => {
    setSelectedEvent(event);
    setSelectedDay(day);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
    setSelectedDay(null);
  };

  const handleDeleteEvent = () => {
    if (selectedDay !== null && selectedEvent) {
      onDeleteEvent(selectedDay, selectedEvent.title);
      handleClose();
    }
  };

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
    
    const highlightColor = isToday ? 'rgba(153, 102, 0, 0.5)' : '#f5f5f5';
    const textColor = isToday ? 'white' : 'black';

    const dayEvents = events[day] || [];

    cells.push(
      <Grid item xs={1.7} key={day} p={1}>
        <Box 
          p={2}
          bgcolor={highlightColor}
          border={1}
          borderColor="#996600"
          borderRadius={2}
          color={textColor}
          height="120px" // ทำให้กรอบมีความสูงที่ fix
          position="relative"
          overflow="hidden" // ไม่ให้กิจกรรมที่เกินขอบล้นออกมา
        >
          <Typography 
            variant="body2" 
            style={{ position: 'absolute', top: '4px', right: '4px' }}
          >
            {day}
          </Typography>

          <Box 
            sx={{
              mt: 1,
              overflowY: 'auto', // ทำให้สามารถ scroll ได้เมื่อมีหลายกิจกรรม
              maxHeight: '80px' // จำกัดความสูงของกล่องกิจกรรม
            }}
          >
            {dayEvents.map((event, index) => (
              <Box 
                key={index}
                sx={{
                  padding: '0.2rem',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  mb: 1,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap', // ป้องกันการตัดคำ
                  '&:hover': {
                    backgroundColor: '#ddd', // เปลี่ยนสีเมื่อ hover
                  }
                }}
                onClick={() => handleClickOpen(day, event)} // คลิกเพื่อเปิด Dialog
              >
                <Typography variant="body2" noWrap>
                  {event.title}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => onAddEvent(day)}
            sx={{ 
              position: 'absolute', 
              bottom: '4px', 
              left: '4px', 
              padding: '4px', 
              borderColor: '#996600',
              color: '#996600',
              '&:hover': {
                backgroundColor: '#996600',
                color: 'white',
              },
            }}
          >
            +
          </Button>
        </Box>
      </Grid>
    );
  }

  return (
    <>
      <Grid container>{cells}</Grid>

      {/* Dialog สำหรับแสดงรายละเอียดเหตุการณ์ */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>รายละเอียดกิจกรรม</DialogTitle>
        <DialogContent>
          {selectedEvent ? (
            <>
              <Typography variant="h6">{selectedEvent?.title}</Typography>
              <Typography variant="body2" sx={{ marginTop: '8px' }}>
                {selectedEvent?.details}
              </Typography>
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">ยกเลิก</Button>
          <Button onClick={handleDeleteEvent} color="secondary">ลบกิจกรรม</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CalendarCellsAM;
