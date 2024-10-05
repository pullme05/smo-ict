import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { Typography, Box, Modal, Paper, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';

const localizer = momentLocalizer(moment);

const MeetingRoomUser = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [approvedBookings, setApprovedBookings] = useState<any[]>([]);
  const [rejectedBookings, setRejectedBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [bookings] = useState([
    ...recurringBookings('ห้อง 1', 'ห้องประชุม A'),
    ...recurringBookings('ห้อง 2', 'ห้องประชุม B'),
    ...recurringBookings('ห้อง 3', 'ห้องประชุม C'),
  ]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const [pendingResponse, approvedResponse, rejectedResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/bookings/pending'),
          axios.get('http://localhost:8000/api/bookings/approved'),
          axios.get('http://localhost:8000/api/bookings/rejected'),
        ]);

        if (pendingResponse.status === 200) {
          setPendingBookings(pendingResponse.data);
        }
        if (approvedResponse.status === 200) {
          setApprovedBookings(approvedResponse.data);
        }
        if (rejectedResponse.status === 200) {
          setRejectedBookings(rejectedResponse.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('เกิดข้อผิดพลาดในการดึงข้อมูลการจอง');
      }
    }

    fetchBookings();
  }, []);

  function recurringBookings(room: string, title: string) {
    const year = new Date().getFullYear();
    const dates = [];
    const daysOfWeek = [1, 2, 3, 4, 5]; // จองได้เฉพาะวันจันทร์ถึงศุกร์

    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= 31; day++) {
        const currentDate = new Date(year, month, day);

        if (currentDate.getMonth() !== month) break;

        if (daysOfWeek.includes(currentDate.getDay())) {
          dates.push({
            id: `${room}-${currentDate.toISOString()}`,
            room,
            title,
            start: new Date(currentDate),
            end: new Date(currentDate),
          });
        }
      }
    }
    return dates;
  }

  function handleEventClick(event: any) {
    setSelectedRoom(event.room);
    setSelectedDate(event.start);
    setModalOpen(true);
  }

  function isTimeSlotAvailable(room: string | null, startTime: string, endTime: string, selectedDate: Date | null) {
    if (!room || !selectedDate) return false;

    const newStart = moment(selectedDate).set({
      hour: parseInt(startTime.split(':')[0]),
      minute: parseInt(startTime.split(':')[1]),
    });
    const newEnd = moment(selectedDate).set({
      hour: parseInt(endTime.split(':')[0]),
      minute: parseInt(endTime.split(':')[1]),
    });

    return !approvedBookings.some((booking) => {
      if (booking.room !== room || booking.status !== 'อนุมัติแล้ว') return false;  // ตรวจสอบสถานะว่าเป็น "อนุมัติแล้ว"

      const existingStart = moment(booking.date).set({
        hour: parseInt(booking.startTime.split(':')[0]),
        minute: parseInt(booking.startTime.split(':')[1]),
      });
      const existingEnd = moment(booking.date).set({
        hour: parseInt(booking.endTime.split(':')[0]),
        minute: parseInt(booking.endTime.split(':')[1]),
      });

      return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
    });
  }

  function getBookedTimesForRoom(room: string | null, selectedDate: Date | null) {
    if (!room || !selectedDate) return [];

    const bookedTimes = [
      ...pendingBookings
        .filter((booking) => booking.room === room && moment(booking.date).isSame(selectedDate, 'day'))
        .map((booking) => ({
          startTime: booking.startTime,
          endTime: booking.endTime,
        })),
      ...approvedBookings
        .filter((booking) => booking.room === room && moment(booking.date).isSame(selectedDate, 'day'))
        .map((booking) => ({
          startTime: booking.startTime,
          endTime: booking.endTime,
        })),
    ];

    return bookedTimes;
  }

  async function handleFormSubmit() {
    if (studentID.length !== 8 || isNaN(Number(studentID))) {
      alert('รหัสนิสิตต้องมี 8 หลักและเป็นตัวเลขเท่านั้น');
      return;
    }

    if (!isTimeSlotAvailable(selectedRoom, startTime, endTime, selectedDate)) {
      alert('เวลาและห้องที่เลือกมีการจองอยู่แล้ว');
      return;
    }

    const bookingData = {
      room: selectedRoom,
      studentName,
      studentID,
      startTime,
      endTime,
      purpose,
      date: selectedDate,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/bookings/create', bookingData);

      if (response.status === 201) {
        alert('การจองสำเร็จ');
        // Update the pending bookings without refreshing the page
        setPendingBookings((prev) => [...prev, { ...bookingData, status: 'รอการอนุมัติจากผู้ดูแล' }]);
        setModalOpen(false);
      } else {
        alert(response.data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการจอง');
    }
  }

  const eventsWithStatus = bookings.map((booking) => ({
    title: `${booking.room}: ${booking.title}`,
    start: booking.start,
    end: booking.end,
    room: booking.room,
  }));

  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  return (
    <div className="w-full h-full p-4">
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
          จองห้องประชุม
        </Typography>
      </Box>

      <div className="mb-6">
        <Calendar
          localizer={localizer}
          events={eventsWithStatus}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH]} // เอา WEEK, DAY ออก และเพิ่ม AGENDA
          defaultView={Views.MONTH} // กำหนดมุมมองเริ่มต้นเป็น MONTH
          style={{
            height: '90vh',
            width: '95%',
            fontSize: '16px',
            border: '2px solid #996600',
          }}
          popup={true}
          onSelectEvent={handleEventClick}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Paper sx={{ padding: '16px', maxWidth: '500px', margin: 'auto' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            การจองห้อง {selectedRoom}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            วันที่จอง: {selectedDate ? moment(selectedDate).format('DD MMMM YYYY') : ''}
          </Typography>

          {/* แสดงเวลาที่ถูกจองแล้ว */}
          <Box mt={2}>
            <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}>
              เวลาที่ถูกจองแล้วในวันนี้:
            </Typography>
            {getBookedTimesForRoom(selectedRoom, selectedDate).map((time, index) => (
              <Typography key={index} variant="body2">
                {`${time.startTime} - ${time.endTime}`}
              </Typography>
            ))}
          </Box>

          <TextField
            label="ชื่อ"
            fullWidth
            margin="normal"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <TextField
            label="รหัสนิสิต (8 หลัก)"
            fullWidth
            margin="normal"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
          />
          <TextField
            label="เวลาเริ่ม"
            fullWidth
            margin="normal"
            select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          >
            {times.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="เวลาเสร็จ"
            fullWidth
            margin="normal"
            select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          >
            {times.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="วัตถุประสงค์"
            fullWidth
            margin="normal"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleFormSubmit} sx={{ marginTop: 2 }}>
            ส่งคำขอจอง
          </Button>
        </Paper>
      </Modal>
    {/* ส่วนของรายการการจองที่รอการอนุมัติ */}
    <Box sx={{ mt: 4 }}>
    <Typography variant="h5">รายการการจองที่รอการอนุมัติ</Typography>
    {pendingBookings.map((booking, index) => (
      <Box key={index} sx={{ mt: 2, border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
        <Typography variant="subtitle1" sx={{ color: 'orange' }}>
          ห้อง: {booking.room} | วันที่: {moment(booking.date).format('DD MMM YYYY')} | เวลา: {booking.startTime} - {booking.endTime}
        </Typography>
        <Typography variant="body2">ชื่อผู้จอง: {booking.studentName} | รหัสนิสิต: {booking.studentID}</Typography>
        <Typography variant="body2">วัตถุประสงค์: {booking.purpose}</Typography>
        <Typography variant="body2" sx={{ color: 'orange' }}>สถานะ: รอการอนุมัติจากผู้ดูแล</Typography>
      </Box>
    ))}
    </Box>

    {/* ส่วนของรายการการจองที่อนุมัติแล้ว */}
    <Box sx={{ mt: 4 }}>
    <Typography variant="h5">รายการการจองที่อนุมัติแล้ว</Typography>
    {approvedBookings.map((booking, index) => (
      <Box key={index} sx={{ mt: 2, border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
        <Typography variant="subtitle1" sx={{color: 'green'}}>
          ห้อง: {booking.room} | วันที่: {moment(booking.date).format('DD MMM YYYY')} | เวลา: {booking.startTime} - {booking.endTime}
        </Typography>
        <Typography variant="body2">ชื่อผู้จอง: {booking.studentName} | รหัสนิสิต: {booking.studentID}</Typography>
        <Typography variant="body2">วัตถุประสงค์: {booking.purpose}</Typography>
        <Typography variant="body2" sx={{ color: 'green' }}>สถานะ: อนุมัติแล้ว</Typography>
      </Box>
    ))}
    </Box>

    {/* ส่วนของรายการการจองที่ถูกปฏิเสธ */}
    <Box sx={{ mt: 4 }}>
    <Typography variant="h5">รายการการจองที่ถูกปฏิเสธ</Typography>
    {rejectedBookings.map((booking, index) => (
      <Box key={index} sx={{ mt: 2, border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
        <Typography variant="subtitle1" sx={{ color: 'red' }}>
          ห้อง: {booking.room} | วันที่: {moment(booking.date).format('DD MMM YYYY')} | เวลา: {booking.startTime} - {booking.endTime}
        </Typography>
        <Typography variant="body2">ชื่อผู้จอง: {booking.studentName} | รหัสนิสิต: {booking.studentID}</Typography>
        <Typography variant="body2">วัตถุประสงค์: {booking.purpose}</Typography>
        <Typography variant="body2" sx={{ color: 'red' }}>สถานะ: ถูกปฏิเสธ</Typography>
      </Box>
    ))}
    </Box>
    </div>
  );
};

export default MeetingRoomUser;
