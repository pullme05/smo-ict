import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment-timezone';
import { Typography, Box, Modal, Paper, TextField, Button, MenuItem, Divider, Grid, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

const MeetingRoomUser = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // ใช้ selectedDate ในการเลือกวัน
  const [cancellationModalOpen, setCancellationModalOpen] = useState(false);
  const [cancellationStudentID, setCancellationStudentID] = useState('');
  const [cancellationPhoneNumber, setCancellationPhoneNumber] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<CustomEvent | null>(null);
  const availableRooms = ['ห้อง 1', 'ห้อง 2', 'ห้อง 3'];
  // เพิ่ม state สำหรับ modal แสดงรายละเอียดการจอง
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<CustomEvent | null>(null);
  const handleModalClose = () => {
    setModalOpen(false);
    // ล้างค่าของฟิลด์ต่าง ๆ
    setStudentName('');
    setStudentID('');
    setStartTime('');
    setEndTime('');
    setPurpose('');
    setPhoneNumber('');
    setSelectedRoom(null);
    setSelectedDate(null);
    setDetailsModalOpen(false);
  };
  const handleCancellationModalClose = () => {
    setCancellationModalOpen(false);
    // ล้างค่าของฟิลด์ใน modal สำหรับยกเลิกการจอง
    setCancellationStudentID('');
    setCancellationPhoneNumber('');
    setSelectedBooking(null);  // รีเซ็ตการเลือกการจอง
  };
  useEffect(() => {
     // กำหนดค่า selectedDate เป็นวันที่ปัจจุบัน
  setSelectedDate(new Date());
    async function fetchPendingBookings() {
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

    fetchPendingBookings();
  }, []);

  function isTimeSlotAvailable(room: string | null, startTime: string, endTime: string, selectedDate: Date | null, studentID: string) {
    if (!room || !selectedDate) return false;
  
    const newStart = moment.tz(selectedDate, 'Asia/Bangkok').set({
      hour: parseInt(startTime.split(':')[0]),
      minute: parseInt(startTime.split(':')[1]),
    });
    const newEnd = moment.tz(selectedDate, 'Asia/Bangkok').set({
      hour: parseInt(endTime.split(':')[0]),
      minute: parseInt(endTime.split(':')[1]),
    });
  
    // ตรวจสอบการจองที่มีการอนุมัติแล้วหรือรอการอนุมัติจากผู้ดูแล
    return !pendingBookings.some((booking) => {
      if (booking.room !== room || (booking.status !== 'รอการอนุมัติจากผู้ดูแล' && booking.status !== 'อนุมัติแล้ว')) return false;
  
      // อนุญาตการจองถ้าการจองที่ทับซ้อนเป็นของนิสิตคนเดียวกัน
      if (booking.studentID === studentID) return false;
  
      const existingStart = moment.tz(booking.date, 'Asia/Bangkok').set({
        hour: parseInt(booking.startTime.split(':')[0]),
        minute: parseInt(booking.startTime.split(':')[1]),
      });
      const existingEnd = moment.tz(booking.date, 'Asia/Bangkok').set({
        hour: parseInt(booking.endTime.split(':')[0]),
        minute: parseInt(booking.endTime.split(':')[1]),
      });
  
      // เงื่อนไขการซ้อนทับของเวลา
      return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
    });
  }
  
  
  async function handleFormSubmit() {
    if (studentID.length !== 8 || isNaN(Number(studentID))) {
      alert('รหัสนิสิตต้องมี 8 หลักและเป็นตัวเลขเท่านั้น');
      return;
    }
  
    if (!isTimeSlotAvailable(selectedRoom, startTime, endTime, selectedDate, studentID)) {
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
  
        // ปิด Modal และล้างค่าของฟิลด์
        handleModalClose();
      } else {
        alert(response.data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการจอง');
    }
  }
  
  // เรียกใช้ API ลบการจอง
  async function handleCancelBooking() {
    if (selectedBooking && (cancellationStudentID === selectedBooking.studentID) && (cancellationPhoneNumber === selectedBooking.phoneNumber)) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/bookings/delete/${selectedBooking.studentID}`);
        if (response.status === 200) {
          alert('ยกเลิกการจองสำเร็จ');
          // ลบการจองเฉพาะที่ถูกยกเลิก
          setPendingBookings((prev) => prev.filter((booking) => {
            return booking.studentID !== selectedBooking.studentID || booking.room !== selectedBooking.room;
          }));
          setCancellationModalOpen(false);
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('เกิดข้อผิดพลาดในการยกเลิกการจอง');
      }
    } else {
      alert('รหัสนิสิตหรือหมายเลขโทรศัพท์ไม่ถูกต้อง');
    }
  }
  
  const [viewBookingsOpen, setViewBookingsOpen] = useState(false); // เพิ่ม state สำหรับ popup

const handleViewBookingsOpen = () => {
  setViewBookingsOpen(true);
};

const handleViewBookingsClose = () => {
  setViewBookingsOpen(false);
};

// จัดเรียงการจองตามเวลาเริ่มต้น
const sortedBookings = [...pendingBookings].sort((a, b) => {
  const timeA = moment(a.date).set({
    hour: parseInt(a.startTime.split(':')[0]),
    minute: parseInt(a.startTime.split(':')[1]),
  });

  const timeB = moment(b.date).set({
    hour: parseInt(b.startTime.split(':')[0]),
    minute: parseInt(b.startTime.split(':')[1]),
  });

  return timeA.diff(timeB);
});

  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// ฟังก์ชันสำหรับแสดงรายละเอียดการจอง
const handleViewDetails = (booking: CustomEvent) => {
  if (cancellationStudentID === booking.studentID && cancellationPhoneNumber === booking.phoneNumber) {
    setBookingDetails(booking);
    setSelectedDate(booking.start);  // อัพเดต selectedDate ให้ตรงกับวันที่ของการจอง
    setDetailsModalOpen(true);
  } else {
    alert('กรุณากรอกรหัสนิสิตและหมายเลขโทรศัพท์ให้ถูกต้อง');
  }
};

async function handleNewBookingSubmit() {
  if (studentID.length !== 8 || isNaN(Number(studentID))) {
    alert('รหัสนิสิตต้องมี 8 หลักและเป็นตัวเลขเท่านั้น');
    return;
  }

  if (!isTimeSlotAvailable(selectedRoom, startTime, endTime, selectedDate, studentID)) {
    alert('เวลาและห้องที่เลือกมีการจองอยู่แล้ว');
    return;
  }
  

  // ตรวจสอบการจองเดิมที่มีอยู่
  const existingBookingsForStudent = pendingBookings.filter(
    (booking) => booking.studentID === studentID
  );

  try {
    // ลบการจองเดิมทั้งหมดที่มีรหัสนิสิตเดียวกันออก
    await Promise.all(
      existingBookingsForStudent.map(async (booking) => {
        await axios.delete(`http://localhost:8000/api/bookings/delete/${booking.studentID}`);
      })
    );

    // สร้างการจองใหม่
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

    const response = await axios.post('http://localhost:8000/api/bookings/create', bookingData);

    if (response.status === 201) {
      alert('ส่งคำขอจองสำเร็จแล้ว และได้ลบการจองเดิมสำเร็จ');

      // ลบข้อมูลการจองเก่าจาก state และเพิ่มการจองใหม่เข้าไป
      setPendingBookings((prev) => [
        ...prev.filter(booking => booking.studentID !== studentID), // ลบการจองเก่าที่เป็นของรหัสนิสิตเดียวกัน
        bookingData
      ]);

      // ล้างการเลือกห้องที่แสดงรายละเอียด
      setSelectedBooking(null);

      // ปิด modal อัตโนมัติ
      setModalOpen(false);
      setDetailsModalOpen(false);
      setCancellationModalOpen(false);
    } else {
      alert(response.data.message || 'เกิดข้อผิดพลาด');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('เกิดข้อผิดพลาดในการจอง');
  }
}

  return (
    <div className="w-full h-full p-4">
      <Box
        sx={{backgroundColor: '#996600', color: '#fff', padding: '16px', textAlign: 'center', marginBottom: '16px', }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          จองห้องประชุม
        </Typography>
        {/* เพิ่มปุ่ม ดูการจองห้องประชุม */}
        <Button variant="contained" onClick={handleViewBookingsOpen} sx={{ marginBottom: '16px' }}>
          ดูการจองห้องประชุม
        </Button>
      </Box>
      <div className="mb-6">
        <Calendar
          localizer={localizer}
          events={pendingBookings.map((booking) => ({
            title: `${booking.room} รหัสนิสิต ${booking.studentID} ณ เวลา ${booking.startTime} - ${booking.endTime} (${booking.status})`,
            start: moment.tz(booking.date, 'Asia/Bangkok').set({
              hour: parseInt(booking.startTime.split(':')[0]),
              minute: parseInt(booking.startTime.split(':')[1]),
            }).toDate(),
            end: moment.tz(booking.date, 'Asia/Bangkok').set({
              hour: parseInt(booking.endTime.split(':')[0]),
              minute: parseInt(booking.endTime.split(':')[1]),
            }).toDate(),
            room: booking.room,
            studentName: booking.studentName,
            studentID: booking.studentID,
            phoneNumber: booking.phoneNumber,
            purpose: booking.purpose,
            status: booking.status,
          } as CustomEvent))}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH, Views.DAY, Views.AGENDA]}
          defaultView={Views.MONTH}
          style={{ height: '85vh', width: '100%', fontSize: '12px', border: '2px solid #996600' }}
          popup={true}
          selectable={true}
          onSelectEvent={(event) => {
            setSelectedBooking(event);
            setCancellationModalOpen(true);
          }}
          onSelectSlot={(slotInfo) => {
            setSelectedDate(slotInfo.start); // ใช้ setSelectedDate เมื่อเลือกวันที่จากปฏิทิน
            setModalOpen(true); // เปิด Modal สำหรับการกรอกข้อมูลจอง
          }}
          eventPropGetter={(event) => {
            let backgroundColor = '#FFCCCC';
            let color = '#FF0000';
          
            if (event.status === 'รอการอนุมัติจากผู้ดูแล') {
              backgroundColor = '#FFFFFF';
              color = '#FFA500';
            } else if (event.status === 'อนุมัติแล้ว') {
              backgroundColor = '#008000';
              color = '#FFFFFF';
            } else if (event.status === 'ปฏิเสธการจอง') {
              backgroundColor = '#FFCCCC'; // สีแดงอ่อน
              color = '#FF0000'; // สีแดง
            }
            return { style: { backgroundColor, color, border: '1px solid #FFA500' } };
          }}
        />
      </div>
      {/* Modal สำหรับยกเลิกการจองและแสดงรายละเอียด */}
      <Modal open={cancellationModalOpen} onClose={handleCancellationModalClose}>
        <Paper sx={{ padding: '16px', maxWidth: '500px', margin: 'auto' }}>
          <Typography variant="h6">ยกเลิกการจองห้อง {selectedBooking?.room}</Typography>
          <Typography>นิสิต: {selectedBooking?.studentName}</Typography>
          <TextField label="รหัสนิสิต" value={cancellationStudentID || ''} onChange={(e) => setCancellationStudentID(e.target.value)} fullWidth sx={{ marginTop: '16px' }}/>
          <TextField label="หมายเลขโทรศัพท์" value={cancellationPhoneNumber || ''} onChange={(e) => setCancellationPhoneNumber(e.target.value)} fullWidth sx={{ marginTop: '16px' }} />
          <Button variant="outlined" fullWidth sx={{ marginTop: '16px' }} onClick={() => handleViewDetails(selectedBooking!)}>
            แสดงรายละเอียดและแก้ไขการจอง
            {/* แสดงรายละเอียดการจอง */}
          </Button>
          <Button variant="contained" fullWidth sx={{ marginTop: '16px' }} onClick={handleCancelBooking}>
            ยืนยันการยกเลิกการจอง
          </Button>
        </Paper>
      </Modal> 
      {/* Modal สำหรับการจองห้องประชุมและแสดงรายละเอียดการจอง */}
      <Modal open={ detailsModalOpen} onClose={handleModalClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Paper sx={{ padding: '16px', maxWidth: '900px', margin: 'auto' }}>
        <IconButton onClick={handleModalClose} sx={{position: 'absolute',top: 8, right: 400, color: '#996600'}}>
          <CloseIcon />
        </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {bookingDetails ? `แก้ไขการจองห้อง ${selectedRoom}` : `การจองห้อง ${selectedRoom}`}
          </Typography>

          <Grid container spacing={2} sx={{ marginTop: '16px' }}>
            {/* คอลัมน์สำหรับแสดงข้อมูลการจองเก่า */}
            <Grid item xs={12} md={6}>
              {bookingDetails && (
                <Paper sx={{ padding: '16px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
                  <Typography variant="h6" sx={{ marginBottom: '8px' }}>
                    ข้อมูลการจองห้อง
                    {/* ข้อมูลการจองเก่า */}
                  </Typography>
                  <Typography variant="body1">
                    ห้องที่จอง: {bookingDetails.room}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: 1 }}>
                    วันที่จองเดิม: {moment.tz(bookingDetails.start, 'Asia/Bangkok').format('DD MMMM YYYY')}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: 1 }}>
                    เวลา: {moment(bookingDetails.start).format('HH:mm')} - {moment(bookingDetails.end).format('HH:mm')}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: 1 }}>
                    ชื่อผู้จอง: {bookingDetails.studentName}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: 1 }}>
                    รหัสนิสิต: {bookingDetails.studentID}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: 1 }}>
                    หมายเลขโทรศัพท์: {bookingDetails.phoneNumber}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: 1 }}>
                    วัตถุประสงค์: {bookingDetails.purpose}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: 1 }}>
                    สถานะ: {bookingDetails.status}
                  </Typography>
                </Paper>
              )}
            </Grid>
           {/* คอลัมน์สำหรับกรอกข้อมูลการจองใหม่ */}
           <Grid item xs={12} md={6}>
              <TextField label="เลือกห้อง" value={selectedRoom ?? ''} onChange={(e) => setSelectedRoom(e.target.value)} select fullWidth sx={{ marginBottom: '16px' }}>
                {availableRooms.map((room) => (
                  <MenuItem key={room} value={room}>
                    {room}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="วันที่จอง"
                type="date"
                value={selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : ''}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                sx={{ marginBottom: '16px' }}
              />
              <TextField label="ชื่อผู้จอง" value={studentName} onChange={(e) => setStudentName(e.target.value)} fullWidth sx={{ marginBottom: '16px' }} />
              <TextField label="รหัสนิสิต" value={studentID} onChange={(e) => setStudentID(e.target.value)} fullWidth sx={{ marginBottom: '16px' }} />
              <TextField label="หมายเลขโทรศัพท์" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} fullWidth sx={{ marginBottom: '16px' }} />
              <TextField label="วัตถุประสงค์การจอง" value={purpose} onChange={(e) => setPurpose(e.target.value)} fullWidth sx={{ marginBottom: '16px' }} />
              <TextField label="เวลาเริ่ม" value={startTime} onChange={(e) => setStartTime(e.target.value)} select fullWidth sx={{ marginBottom: '16px' }}>
                {times.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="เวลาสิ้นสุด" value={endTime} onChange={(e) => setEndTime(e.target.value)} select fullWidth sx={{ marginBottom: '16px' }}>
                {times.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant="contained" fullWidth sx={{ marginTop: '16px' }} onClick={handleNewBookingSubmit}>
                ยืนยันการจองและลบการจองเก่า
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>

      {/* Modal สำหรับการจอง */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Paper sx={{ padding: '16px', maxWidth: '500px', margin: 'auto' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            การจองห้อง {selectedRoom}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            วันที่จอง: {selectedDate ? moment.tz(selectedDate, 'Asia/Bangkok').format('DD MMMM YYYY') : 'ไม่ระบุ'}
          </Typography>

          <TextField label="เลือกห้อง" value={selectedRoom ?? ''} onChange={(e) => setSelectedRoom(e.target.value)} select fullWidth sx={{ marginTop: '16px' }}>
            {availableRooms.map((room) => (
              <MenuItem key={room} value={room}>
                {room}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="ชื่อผู้จอง" value={studentName} onChange={(e) => setStudentName(e.target.value)} fullWidth sx={{ marginTop: '16px' }} />
          <TextField label="รหัสนิสิต" value={studentID} onChange={(e) => setStudentID(e.target.value)} fullWidth sx={{ marginTop: '16px' }}/>
          <TextField label="หมายเลขโทรศัพท์" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} fullWidth sx={{ marginTop: '16px' }}/>
          <TextField label="วัตถุประสงค์การจอง" value={purpose} onChange={(e) => setPurpose(e.target.value)} fullWidth sx={{ marginTop: '16px' }} />
          <TextField label="เวลาเริ่ม" value={startTime} onChange={(e) => setStartTime(e.target.value)} select fullWidth sx={{ marginTop: '16px' }}>
            {times.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="เวลาสิ้นสุด" value={endTime} onChange={(e) => setEndTime(e.target.value)} select fullWidth sx={{ marginTop: '16px' }}>
            {times.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" fullWidth sx={{ marginTop: '16px' }} onClick={handleFormSubmit}>
            ยืนยันการจอง
          </Button>
        </Paper>
      </Modal>
      {/* Modal สำหรับแสดงการจองห้องประชุมทั้งหมด */}
      <Modal open={viewBookingsOpen} onClose={handleViewBookingsClose}>
        <Paper sx={{ padding: '16px', maxWidth: '1200px', maxHeight: '90vh', width: '95%', margin: 'auto', overflowY: 'auto' }}>
          <Typography variant="h6">เวลาว่างและการจองห้องประชุม</Typography>
          {/* ใช้ Grid เพื่อแบ่งคอลัมน์ */}
          <Grid container spacing={2}>
          {/* คอลัมน์สำหรับเวลาว่างของห้องประชุม */}
          <Grid item xs={12} md={4}>
            <TextField
              label="เลือกวันที่"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : ''}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              fullWidth
              margin="normal"
            />
            
            {/* ถ้ามีการเลือกวันที่แล้วจะแสดงตารางเวลาของห้อง */}
            {selectedDate && (
              <>
                {availableRooms.map((room) => {
                  const bookingsForRoom = sortedBookings.filter(
                    (booking) => booking.room === room && moment(booking.date).isSame(selectedDate, 'day')
                  );

                  const unavailableTimes = bookingsForRoom.map((booking) => ({
                    start: moment(booking.startTime, 'HH:mm'),
                    end: moment(booking.endTime, 'HH:mm'),
                  }));

                  const times = [
                    { start: '09:00', end: '10:00' },
                    { start: '10:00', end: '11:00' },
                    { start: '11:00', end: '12:00' },
                    { start: '12:00', end: '13:00' },
                    { start: '13:00', end: '14:00' },
                    { start: '14:00', end: '15:00' },
                    { start: '15:00', end: '16:00' },
                    { start: '16:00', end: '17:00' },
                  ];

                  const availableIntervals = [];
                  let previousEnd = moment('09:00', 'HH:mm');
                  
                  times.forEach(({ start, end }) => {
                    const startMoment = moment(start, 'HH:mm');
                    const endMoment = moment(end, 'HH:mm');
                    
                    const isUnavailable = unavailableTimes.some((booking) => {
                      return booking.start.isBefore(endMoment) && booking.end.isAfter(startMoment);
                    });
                    
                    if (isUnavailable) {
                      if (previousEnd.isBefore(startMoment)) {
                        availableIntervals.push({
                          start: previousEnd.format('HH:mm'),
                          end: startMoment.format('HH:mm'),
                          isAvailable: true
                        });
                      }
                      availableIntervals.push({
                        start: startMoment.format('HH:mm'),
                        end: endMoment.format('HH:mm'),
                        isAvailable: false
                      });
                      previousEnd = endMoment;
                    }
                  });
                  
                  if (previousEnd.isBefore(moment('17:00', 'HH:mm'))) {
                    availableIntervals.push({
                      start: previousEnd.format('HH:mm'),
                      end: moment('17:00', 'HH:mm').format('HH:mm'),
                      isAvailable: true
                    });
                  }

                  return (
                    <Box key={room} sx={{ marginBottom: '16px' }}>
                      <Typography variant="subtitle1">{`ห้อง: ${room}`}</Typography>
                      <Divider sx={{ marginBottom: '8px' }} />
                      {availableIntervals.map(({ start, end, isAvailable }) => (
                        <Box
                          key={start}
                          sx={{
                            backgroundColor: isAvailable ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)', // สีเขียวจางๆ หรือแดงอ่อนๆ
                            padding: '8px',
                            borderRadius: '8px',
                            textAlign: 'center', // ข้อความอยู่ตรงกลาง
                            color: 'black', // สีของข้อความ
                            marginBottom: '8px', // ระยะห่างระหว่างกล่อง
                          }}
                        >
                          {`${start} - ${end}: ${isAvailable ? 'ว่าง' : 'ไม่ว่าง'}`}
                        </Box>
                      ))}
                    </Box>
                  );
                })}
              </>
            )}
          </Grid>

          {/* เส้นแบ่งแนวตั้งระหว่างสองคอลัมน์ */}
          <Grid item xs={12} md={0.1}>
            <Divider orientation="vertical" flexItem sx={{ height: '100%' }} />
          </Grid>

          {/* คอลัมน์สำหรับแสดงรายการการจอง */}
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>รายการการจองทั้งหมด</Typography>
            <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {availableRooms.map((room) => {
                const roomBookings = sortedBookings.filter((booking) => booking.room === room);

                return (
                  <Box key={room} sx={{ marginBottom: '24px' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{`ห้อง: ${room}`}</Typography>
                    {roomBookings.length === 0 ? (
                      <Typography variant="body2">ไม่มีการจองห้องประชุม</Typography>
                    ) : (
                      roomBookings.map((booking, index) => (
                        <Paper key={index} sx={{ padding: '16px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{`นิสิต: ${booking.studentName} (${booking.studentID})`}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2">{`วันที่: ${moment(booking.date).format('DD MMMM YYYY')}`}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2">{`เวลา: ${booking.startTime} - ${booking.endTime}`}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2">{`สถานะ: ${booking.status}`}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                              <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                onClick={() => {
                                  setSelectedBooking({
                                    title: booking.room,
                                    start: moment(booking.date).set({ hour: parseInt(booking.startTime.split(':')[0]), minute: parseInt(booking.startTime.split(':')[1]) }).toDate(),
                                    end: moment(booking.date).set({ hour: parseInt(booking.endTime.split(':')[0]), minute: parseInt(booking.endTime.split(':')[1]) }).add(1, 'minutes').toDate(),
                                    room: booking.room,
                                    studentName: booking.studentName,
                                    studentID: booking.studentID,
                                    startTime: booking.startTime,
                                    endTime: booking.endTime,
                                    phoneNumber: booking.phoneNumber,
                                    purpose: booking.purpose,
                                    status: booking.status,
                                  });
                                  setCancellationModalOpen(true); // เปิด Modal การยกเลิก
                                }}
                              >
                                ยกเลิกการจอง
                              </Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))
                    )}
                    <Divider sx={{ marginTop: '16px', marginBottom: '16px' }} />
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>
        <Button onClick={handleViewBookingsClose} variant="contained" fullWidth sx={{ marginTop: '16px' }}>
          ปิด
        </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default MeetingRoomUser;
