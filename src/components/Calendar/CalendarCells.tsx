import React, { useState } from 'react';
import { Grid, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface CalendarCellsProps {
  currentDate: Date;
  events?: { [key: number]: string[] }; // ประกาศ props events ซึ่งอาจจะเป็น undefined ได้
  onAddEvent: (day: number) => void; // เพิ่ม prop สำหรับฟังก์ชันเพิ่มกิจกรรม
}

const CalendarCells: React.FC<CalendarCellsProps> = ({ currentDate, events = {}, onAddEvent }) => {
  const [open, setOpen] = useState(false); // State สำหรับ Dialog
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null); // State สำหรับเหตุการณ์ที่เลือก

  const handleClickOpen = (event: string) => {
    setSelectedEvent(event); // เก็บเหตุการณ์ที่เลือก
    setOpen(true); // เปิด Dialog
  };

  const handleClose = () => {
    setOpen(false); // ปิด Dialog
    setSelectedEvent(null); // เคลียร์เหตุการณ์ที่เลือก
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
    const highlightColor = isToday ? '#996600' : '#gray';
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
            style={{ position: 'absolute', bottom: '4px', left: '4px',padding: '4px',cursor: 'pointer'}}
          >
            +
          </Button>

          <Box sx={{ mt: 20 }}>
            <Grid container spacing={1}>
              {dayEvents.map((event, index) => (
                <Grid item xs={12} key={index}>
                  <Box 
                    sx={{ 
                      padding: '0.05rem',  
                      position: 'relative', // ใช้ position relative
                      bottom: '10rem', // ย้ายกล่องลงด้านล่าง
                      wordWrap: 'break-word', // ให้ข้อความตัดบรรทัดเมื่อยาวเกิน
                      overflowWrap: 'break-word', // ให้รองรับการตัดบรรทัดเพิ่มเติม
                      whiteSpace: 'nowrap', // ทำให้ข้อความสามารถตัดบรรทัดได้ตามปกติ                     
                      width: '150px',
                      cursor: 'pointer', // เปลี่ยนเป็น pointer เมื่อชี้ที่เหตุการณ์
                    }}
                    onClick={() => handleClickOpen(event)} // คลิกเพื่อเปิด Dialog
                  >
                    <Typography 
                      sx={{ 
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      - {event}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

        </Box>
      </Grid>
    );
  }

  return (
    <>
      <Grid container>{cells}</Grid>

      {/* Dialog สำหรับแสดงรายละเอียดเหตุการณ์ */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box 
              sx={{
                width: '250px', // กำหนดความกว้างคงที่
                height: '200px', // กำหนดความสูงคงที่
                overflow: 'hidden', // ซ่อนส่วนที่เกิน
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                marginBottom: '16px',
                backgroundColor: '#f0f0f0', // เพิ่มสีพื้นหลังสำหรับภาพที่ไม่โหลด
              }}
            >
              <img 
                src="https://via.placeholder.com/250?text=Room+A" 
                alt="Event" 
                style={{ 
                  width: '100%', 
                  height: '100%', // กำหนดให้มีความสูงเต็มที่
                  objectFit: 'cover', // ทำให้ภาพครอบคลุมพื้นที่
                }} 
              />
            </Box>
            <Typography variant="h6">{selectedEvent}</Typography>
            <Typography variant="body2" sx={{ marginTop: '8px' }}>
              Additional details about the event can go here.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleClose} color="secondary">Confirm</Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default CalendarCells;
