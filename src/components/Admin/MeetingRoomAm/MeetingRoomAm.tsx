import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment-timezone';
import { Typography, Box, Modal, Paper, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.tz.setDefault('Asia/Bangkok');
const localizer = momentLocalizer(moment);

interface Booking {
  room: string;
  studentName: string;
  studentID: string;
  startTime: string;
  endTime: string;
  purpose: string;
  phoneNumber: string;
  date: Date;
  status: string;
}

interface CustomEvent {
  title: string;
  start: Date;
  end: Date;
  room: string;
  studentName: string;
  studentID: string;
  startTime: string;
  endTime: string;
  phoneNumber: string;
  purpose: string;
  status: string;
}

const MeetingRoomAM = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [cancellationModalOpen, setCancellationModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CustomEvent | null>(null);

  const availableRooms = ['ห้อง 1', 'ห้อง 2', 'ห้อง 3'];

  useEffect(() => {
    async function fetchAllBookings() {
      try {
        const response = await axios.get('http://localhost:8000/api/bookings');
        if (response.status === 200) {
          setPendingBookings(response.data); // ดึงข้อมูลการจองทั้งหมด
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('เกิดข้อผิดพลาดในการดึงข้อมูลการจอง');
      }
    }
  
    fetchAllBookings(); // เรียกใช้ฟังก์ชันนี้เมื่อหน้าโหลด
  }, []);
  

  function isTimeSlotAvailable(
    room: string | null,
    startTime: string,
    endTime: string,
    selectedDate: Date | null
  ) {
    if (!room || !selectedDate) return false;

    const newStart = moment.tz(selectedDate, 'Asia/Bangkok').set({
      hour: parseInt(startTime.split(':')[0]),
      minute: parseInt(startTime.split(':')[1]),
    });
    const newEnd = moment.tz(selectedDate, 'Asia/Bangkok').set({
      hour: parseInt(endTime.split(':')[0]),
      minute: parseInt(endTime.split(':')[1]),
    });

    return !pendingBookings.some((booking) => {
      if (booking.room !== room || booking.status !== 'รอการอนุมัติจากผู้ดูแล') return false;

      const existingStart = moment.tz(booking.date, 'Asia/Bangkok').set({
        hour: parseInt(booking.startTime.split(':')[0]),
        minute: parseInt(booking.startTime.split(':')[1]),
      });
      const existingEnd = moment.tz(booking.date, 'Asia/Bangkok').set({
        hour: parseInt(booking.endTime.split(':')[0]),
        minute: parseInt(booking.endTime.split(':')[1]),
      });

      return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
    });
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

    const bookingData: Booking = {
      room: selectedRoom!,
      studentName,
      studentID,
      startTime,
      endTime,
      purpose,
      phoneNumber,
      date: selectedDate!,
      status: 'รอการอนุมัติจากผู้ดูแล',
    };

    try {
      const response = await axios.post('http://localhost:8000/api/bookings/create', bookingData);

      if (response.status === 201) {
        alert('ส่งคำขอจองสำเร็จแล้ว รอการอนุมัติจากผู้ดูแล');
        setPendingBookings((prev) => [...prev, bookingData]);
        setModalOpen(false);
      } else {
        alert(response.data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการจอง');
    }
  }
  // เรียกใช้ API ยกเลิกการจอง
  async function handleCancelBooking() {
    if (selectedBooking) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/bookings/delete/${selectedBooking.studentID}`); // เปลี่ยนเป็น bookingID
        if (response.status === 200) {
          alert('ยกเลิกการจองสำเร็จ');
          setPendingBookings((prev) => prev.filter((booking) => booking.studentID !== selectedBooking.studentID)); // ใช้ bookingID เพื่อลบการจองเฉพาะเจาะจง
          setCancellationModalOpen(false);
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('เกิดข้อผิดพลาดในการยกเลิกการจอง');
      }
    }
  }
  
  // เรียกใช้ API อนุมัติการจอง
  async function handleApproveBooking() {
    if (selectedBooking) {
      try {
        const response = await axios.post(`http://localhost:8000/api/bookings/approve/${selectedBooking.studentID}`, {
          startTime: selectedBooking.startTime,
          endTime: selectedBooking.endTime,
          status: 'อนุมัติแล้ว',
        });
  
        if (response.status === 200) {
          alert('อนุมัติการจองสำเร็จ');
          // อัปเดตสถานะการจองใน state
          setPendingBookings((prev) =>
            prev.map((booking) =>
              booking.studentID === selectedBooking.studentID
                ? { ...booking, status: 'อนุมัติแล้ว' }
                : booking
            )
          );
          setCancellationModalOpen(false);
        } else {
          alert('ไม่สามารถอัปเดตฐานข้อมูลได้');
        }
      } catch (error) {
        console.error('Error approving booking:', error);
        alert('เกิดข้อผิดพลาดในการอนุมัติการจอง');
      }
    }
  }
  
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

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
        events={pendingBookings.map((booking) => ({
          title: `${booking.room} รหัสนิสิต ${booking.studentID} ณ เวลา ${booking.startTime} - ${booking.endTime} (${booking.status})`,
          start: moment
            .tz(booking.date, 'Asia/Bangkok')
            .set({
              hour: parseInt(booking.startTime.split(':')[0]),
              minute: parseInt(booking.startTime.split(':')[1]),
            })
            .toDate(),
          end: moment
            .tz(booking.date, 'Asia/Bangkok')
            .set({
              hour: parseInt(booking.endTime.split(':')[0]),
              minute: parseInt(booking.endTime.split(':')[1]),
            })
            .add(1, 'minutes')
            .toDate(),
          room: booking.room,
          studentName: booking.studentName,
          studentID: booking.studentID,
          phoneNumber: booking.phoneNumber,
          purpose: booking.purpose,
          status: booking.status,
          startTime: booking.startTime, // เพิ่ม startTime
          endTime: booking.endTime, // เพิ่ม endTime
        } as CustomEvent))}
        startAccessor="start"
        endAccessor="end"
        views={[Views.AGENDA, Views.DAY, Views.MONTH]}
        defaultView={Views.AGENDA}
        style={{ height: '85vh', width: '100%', fontSize: '12px', border: '2px solid #996600' }}
        popup={true}
        selectable={true}
        onSelectEvent={(event) => {
          setSelectedBooking({
            ...event,
            startTime: moment(event.start).format('HH:mm'), // แปลง start เป็น startTime
            endTime: moment(event.end).format('HH:mm'),     // แปลง end เป็น endTime
          } as CustomEvent); // ตั้งค่า CustomEvent ใหม่
          setCancellationModalOpen(true);
        }}
        onSelectSlot={(slotInfo) => {
          setSelectedDate(slotInfo.start);
          setModalOpen(true);
        }}
        eventPropGetter={(event) => {
          const backgroundColor = event.status === 'รอการอนุมัติจากผู้ดูแล' ? '#FFFFFF' : '#008000';
          const color = event.status === 'รอการอนุมัติจากผู้ดูแล' ? '#FFA500' : '#FFFFFF';
          return { style: { backgroundColor, color, border: '1px solid #FFA500' } };
        }}
      />
      </div>

      {/* Modal สำหรับยกเลิกและอนุมัติการจอง */}
      <Modal open={cancellationModalOpen} onClose={() => setCancellationModalOpen(false)}>
        <Paper sx={{ padding: '16px', maxWidth: '500px', margin: 'auto' }}>
          <Typography variant="h6">การจองห้อง {selectedBooking?.room}</Typography>
          <Typography>
            วันที่จอง: {selectedBooking?.start ? moment(selectedBooking.start).format('DD MMMM YYYY') : 'ไม่ระบุ'}
          </Typography>
          <Typography>
            เวลา: {selectedBooking?.start ? moment(selectedBooking.start).format('HH:mm') : 'ไม่ระบุ'} - {selectedBooking?.end ? moment(selectedBooking.end).format('HH:mm') : 'ไม่ระบุ'}
          </Typography>
          <Typography>ชื่อผู้จอง: {selectedBooking?.studentName}</Typography>
          <Typography>รหัสนิสิต: {selectedBooking?.studentID}</Typography>
          <Typography>หมายเลขโทรศัพท์: {selectedBooking?.phoneNumber}</Typography>
          <Typography>วัตถุประสงค์: {selectedBooking?.purpose || 'ไม่ระบุ'}</Typography>
          
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" onClick={handleApproveBooking}>
              อนุมัติการจอง
            </Button>
            <Button variant="contained" color="error" onClick={handleCancelBooking}>
              ยกเลิกการจอง
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Modal สำหรับจองห้อง */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Paper sx={{ padding: '16px', maxWidth: '500px', margin: 'auto' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            การจองห้อง {selectedRoom}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            วันที่จอง: {selectedDate ? moment.tz(selectedDate, 'Asia/Bangkok').format('DD MMMM YYYY') : 'ไม่ระบุ'}
          </Typography>

          <TextField
            label="เลือกห้อง"
            value={selectedRoom ?? ''}
            onChange={(e) => setSelectedRoom(e.target.value)}
            select
            fullWidth
            sx={{ marginTop: '16px' }}
          >
            {availableRooms.map((room) => (
              <MenuItem key={room} value={room}>
                {room}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="ชื่อผู้จอง"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            fullWidth
            sx={{ marginTop: '16px' }}
          />

          <TextField
            label="รหัสนิสิต"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            fullWidth
            sx={{ marginTop: '16px' }}
          />

          <TextField
            label="หมายเลขโทรศัพท์"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            sx={{ marginTop: '16px' }}
          />

          <TextField
            label="วัตถุประสงค์การจอง"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            fullWidth
            sx={{ marginTop: '16px' }}
          />

          <TextField
            label="เวลาเริ่ม"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            select
            fullWidth
            sx={{ marginTop: '16px' }}
          >
            {times.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="เวลาสิ้นสุด"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            select
            fullWidth
            sx={{ marginTop: '16px' }}
          >
            {times.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: '16px' }}
            onClick={handleFormSubmit}
          >
            ยืนยันการจอง
          </Button>
        </Paper>
      </Modal>

      
    </div>
  );
};

export default MeetingRoomAM;
