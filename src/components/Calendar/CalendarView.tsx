import React, { useState } from 'react';
import { Button, IconButton, Typography, Box } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import CalendarCells from './CalendarCells'; // สมมติว่าคุณมีคอมโพเนนต์นี้
import EventList from './EventList'; // สมมติว่าคุณมีคอมโพเนนต์นี้

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'list'>('month'); // สถานะเพื่อจัดการมุมมองปัจจุบัน
  const [events, setEvents] = useState<{ [key: number]: string[] }>({
    10: ["ประกวดขบวนแห่งพุทธบูชา (สงกรานต์)"],
    8: ["ร่วมออกแบบเสื้อ Freshy ED56 & Jacket"],
    9: ["ร่วมออกแบบเสื้อ Freshy ED56 & Jacket"],
  });

  // ไปยังเดือนก่อนหน้า
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate(new Date(prevMonth));
  };

  // ไปยังเดือนถัดไป
  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate(new Date(nextMonth));
  };

  // กลับไปวันที่ปัจจุบัน
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // สลับระหว่างมุมมองเดือนและรายการ
  const handleToggleView = () => {
    setView(view === 'month' ? 'list' : 'month');
  };

  return (
    <Box>
      {/* ส่วนหัวของปฏิทิน */}
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Box>
          <IconButton onClick={handlePrevMonth}>
            <ArrowBackIos />
          </IconButton>
          <Button variant="outlined" onClick={handleToday}>
            วันนี้
          </Button>
          <IconButton onClick={handleNextMonth}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
        <Typography variant="h6">
          {currentDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
        </Typography>
        <Box>
          <Button variant={view === 'month' ? "contained" : "outlined"} onClick={() => setView('month')}>
            เดือน
          </Button>
          <Button variant={view === 'list' ? "contained" : "outlined"} sx={{ ml: 1 }} onClick={handleToggleView}>
            รายการ
          </Button>
        </Box>
      </Box>

      {/* เนื้อหาของปฏิทิน */}
      {view === 'month' ? (
        <CalendarCells currentDate={currentDate} events={events} onAddEvent={(day) => alert(`เพิ่มกิจกรรมในวันที่ ${day}`)} />
      ) : (
        <EventList
          events={Object.entries(events).map(([date, events]) => ({
            date: parseInt(date),
            events,
          }))}
        />
      )}
    </Box>
  );
};

export default CalendarView;
