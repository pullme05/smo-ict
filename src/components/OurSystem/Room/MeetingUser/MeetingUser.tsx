import { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import {Typography, Box, Modal, Paper,TextField,Button,MenuItem,} from '@mui/material';
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [bookings] = useState([
    ...recurringBookings('ห้องประชุม ห้อง A', 'ห้องประชุม', 10, 12),
    ...recurringBookings('ห้องประชุม ห้อง B', 'ห้องประชุม', 13, 15),
    ...recurringBookings('ห้องประชุม ห้อง C', 'ห้องประชุม', 15, 17),
  ]);

  function recurringBookings(
    room: string,
    title: string,
    startHour: number,
    endHour: number
  ) {
    const year = new Date().getFullYear();
    const dates = [];
    const daysOfWeek = [1, 2, 3, 4, 5];

    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= 31; day++) {
        const currentDate = new Date(year, month, day);

        if (currentDate.getMonth() !== month) break;

        if (daysOfWeek.includes(currentDate.getDay())) {
          dates.push({
            id: `${room}-${currentDate.toISOString()}`,
            room,
            title,
            start: new Date(currentDate.setHours(startHour, 0)),
            end: new Date(currentDate.setHours(endHour, 0)),
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

  function isTimeSlotAvailable(
    room: string | null,
    startTime: string,
    endTime: string,
    selectedDate: Date | null
  ) {
    if (!room || !selectedDate) return false;

    const newStart = moment(selectedDate).set({
      hour: parseInt(startTime.split(':')[0]),
      minute: parseInt(startTime.split(':')[1]),
    });
    const newEnd = moment(selectedDate).set({
      hour: parseInt(endTime.split(':')[0]),
      minute: parseInt(endTime.split(':')[1]),
    });

    return !pendingBookings.some((booking) => {
      if (booking.room !== room) return false;

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

    const bookedTimes = pendingBookings
      .filter((booking) => booking.room === room && moment(booking.date).isSame(selectedDate, 'day'))
      .map((booking) => ({
        startTime: booking.startTime,
        endTime: booking.endTime,
      }));

    return bookedTimes;
  }

  function handleFormSubmit() {
    if (studentID.length !== 8 || isNaN(Number(studentID))) {
      alert('รหัสนิสิตต้องมี 8 หลักและเป็นตัวเลขเท่านั้น');
      return;
    }

    if (!isTimeSlotAvailable(selectedRoom, startTime, endTime, selectedDate)) {
      alert('เวลาและห้องที่เลือกมีการจองอยู่แล้ว');
      return;
    }

    const newBooking = {
      room: selectedRoom,
      studentName,
      studentID,
      startTime,
      endTime,
      purpose,
      date: selectedDate,
      status: 'รอการอนุมัติจากผู้ดูแล',
    };

    setPendingBookings([...pendingBookings, newBooking]);
    setModalOpen(false);
  }

  const eventsWithStatus = bookings.map((booking) => ({
    title: `${booking.room}: ${booking.title}`,
    start: booking.start,
    end: booking.end,
    room: booking.room,
  }));

  const times = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  ];

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
          จองห้องประชุม
        </Typography>
      </Box>

      <div className="mb-6">
        <Calendar
          localizer={localizer}
          events={eventsWithStatus}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={Views.MONTH}
          style={{
            height: '85vh',
            width: '100%',
            fontSize: '16px',
            border: '2px solid #996600',
          }}
          onSelectEvent={handleEventClick}
        />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={{ padding: '16px', maxWidth: '500px', margin: 'auto' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            การจองห้อง {selectedRoom}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            วันที่จอง: {selectedDate ? moment(selectedDate).format('DD MMMM YYYY') : ''}
          </Typography>

          {/* แสดงเวลาที่ถูกจองแล้ว */}
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            เวลาที่ถูกจองแล้ว:
          </Typography>
          {getBookedTimesForRoom(selectedRoom, selectedDate).map((timeSlot, index) => (
            <Typography key={index} sx={{ color: 'red' }}>
              {timeSlot.startTime} - {timeSlot.endTime}
            </Typography>
          ))}

          <TextField
            id="studentName"
            fullWidth
            label="ชื่อผู้จอง"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            sx={{ marginTop: 2 }}
          />
          <TextField
            id="studentID"
            fullWidth
            label="รหัสนิสิต (8 หลัก)"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            error={studentID.length !== 8 || isNaN(Number(studentID))}
            sx={{ marginTop: 2 }}
          />
          <TextField
            id="startTime"
            select
            fullWidth
            label="เวลาเริ่มต้น"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            sx={{ marginTop: 2 }}
          >
            {times.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="endTime"
            select
            fullWidth
            label="เวลาสิ้นสุด"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            sx={{ marginTop: 2 }}
          >
            {times.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="purpose"
            fullWidth
            label="วัตถุประสงค์การจอง"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            sx={{ marginTop: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ marginTop: 2 }}
            onClick={handleFormSubmit}
          >
            ส่งคำขอจอง
          </Button>
        </Paper>
      </Modal>

      <div>
        <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>
          การจองที่รอการอนุมัติ:
        </Typography>
        {pendingBookings.map((booking, index) => (
          <Paper key={index} sx={{ padding: '16px', marginBottom: '16px' }}>
            <Typography>
              ห้อง: {booking.room}
            </Typography>
            <Typography>
              ชื่อผู้จอง: {booking.studentName}
            </Typography>
            <Typography>
              รหัสนิสิต: {booking.studentID}
            </Typography>
            <Typography>
              วันที่: {moment(booking.date).format('DD MMMM YYYY')}
            </Typography>
            <Typography>
              เวลา: {booking.startTime} - {booking.endTime}
            </Typography>
            <Typography>
            วัตถุประสงค์: {booking.purpose} 
            </Typography>
            <Typography color="orange">
              สถานะ: {booking.status}
            </Typography>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default MeetingRoomUser;
