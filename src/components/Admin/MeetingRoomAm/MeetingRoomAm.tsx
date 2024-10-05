import { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import {
  Typography,
  Box,
  Paper,
  Button,
  TextField,
} from '@mui/material';

const localizer = momentLocalizer(moment);

interface Booking {
  id: string;
  room: string;
  title: string;
  start: Date;
  end: Date;
  approved: boolean;
  rejected: boolean;
  rejectionReason?: string;
}

const MeetingRoomAM = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(createRecurringBookings());
  const [rejectionReason, setRejectionReason] = useState(''); // เก็บเหตุผลในการปฏิเสธ

  function createRecurringBookings(): Booking[] {
    const today = new Date();
    const year = today.getFullYear();
    const rooms = ['ห้องประชุม ห้อง A', 'ห้องประชุม ห้อง B', 'ห้องประชุม ห้อง C'];
    const bookings: Booking[] = [];
    const startOfYear = new Date(year, 0, 1);

    for (let weekIndex = 0; weekIndex < 52; weekIndex++) {
      const startOfWeek = new Date(startOfYear);
      startOfWeek.setDate(startOfYear.getDate() + weekIndex * 7);
      for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + (dayOfWeek - 1));

        rooms.forEach((room, roomIndex) => {
          bookings.push({
            id: `${room}-${weekIndex}-${dayOfWeek}`,
            room,
            title: `ห้องประชุม ${room}`,
            start: new Date(currentDay.setHours(9 + roomIndex * 3, 0)),
            end: new Date(currentDay.setHours(11 + roomIndex * 3, 0)),
            approved: false,
            rejected: false, // เริ่มต้น rejected เป็น false
          });
        });
      }
    }

    return bookings;
  }

  function handleEventClick(event: Booking) {
    setSelectedBooking(event);
  }

  function approveBooking() {
    if (selectedBooking) {
      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedBooking.id ? { ...booking, approved: true, rejected: false } : booking
      );
      setBookings(updatedBookings);
      setSelectedBooking({ ...selectedBooking, approved: true, rejected: false });
    }
  }

  function rejectBooking() {
    if (selectedBooking) {
      if (!rejectionReason) {
        alert('กรุณากรอกเหตุผลในการปฏิเสธ');
        return;
      }

      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedBooking.id ? { ...booking, approved: false, rejected: true, rejectionReason } : booking
      );
      setBookings(updatedBookings);
      setSelectedBooking({ ...selectedBooking, approved: false, rejected: true, rejectionReason });
      setRejectionReason(''); // รีเซ็ตเหตุผลการปฏิเสธหลังจากบันทึก
    }
  }

  return (
    <div className="w-full h-screen p-4 overflow-y-auto">
      <Box
        sx={{
          backgroundColor: '#996600',
          color: '#fff',
          padding: '16px',
          textAlign: 'center',
          marginBottom: '16px',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          จัดการห้องประชุม
        </Typography>
      </Box>

      <div className="mb-6">
      <Calendar
  localizer={localizer}
  events={bookings.map((booking) => ({
    ...booking,
    title: `${booking.room} ${booking.approved ? '(อนุมัติแล้ว)' : booking.rejected ? '(ปฏิเสธ)' : ''}`,
    style: { backgroundColor: booking.approved ? 'green' : booking.rejected ? 'grey' : 'red' },
  }))}
  startAccessor="start"
  endAccessor="end"
  views={[Views.MONTH, Views.WEEK, Views.DAY]}
  defaultView={Views.MONTH}
  style={{
    height: '90vh',  // เพิ่มความสูงเป็น 90% ของความสูงหน้าจอ
    width: '95vw',   // เพิ่มความกว้างเป็น 95% ของความกว้างหน้าจอ
    fontSize: '16px',
    border: '2px solid #996600',
  }}
  popup={true}
  onSelectEvent={handleEventClick}
/>

      </div>

      <Box sx={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          การจองที่รอการอนุมัติ:
        </Typography>

        {selectedBooking ? (
          <Paper sx={{ padding: '16px', marginTop: '16px' }}>
            <Typography variant="body1">
              ห้อง: {selectedBooking.room}
            </Typography>
            <Typography variant="body1">
              วันที่: {selectedBooking.start.toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              เวลา: {selectedBooking.start.toLocaleTimeString()} - {selectedBooking.end.toLocaleTimeString()}
            </Typography>
            <Typography variant="body1">
              สถานะ: {selectedBooking.approved ? 'อนุมัติเสร็จสิ้น' : selectedBooking.rejected ? `ปฏิเสธ (เหตุผล: ${selectedBooking.rejectionReason})` : 'รอการอนุมัติ'}
            </Typography>

            {!selectedBooking.approved && !selectedBooking.rejected && (
              <>
                <Button variant="contained" color="primary" sx={{ marginTop: '16px' }} onClick={approveBooking}>
                  อนุมัติ
                </Button>
                <TextField
                  label="เหตุผลในการปฏิเสธ"
                  variant="outlined"
                  fullWidth
                  sx={{ marginTop: '16px' }}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <Button variant="outlined" color="secondary" sx={{ marginTop: '16px', marginLeft: '8px' }} onClick={rejectBooking}>
                  ปฏิเสธ
                </Button>
              </>
            )}
          </Paper>
        ) : (
          <Typography variant="body1">โปรดเลือกการจองจากปฏิทินเพื่อดูรายละเอียด</Typography>
        )}
      </Box>
    </div>
  );
};

export default MeetingRoomAM;
