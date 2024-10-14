import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment-timezone';
import { Typography, Box, Modal, Paper, TextField, Button, MenuItem, Divider, Grid } from '@mui/material';
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

  useEffect(() => {
    async function fetchPendingBookings() {
      try {
        const pendingResponse = await axios.get('http://localhost:8000/api/bookings/pending');
        if (pendingResponse.status === 200) {
          setPendingBookings(pendingResponse.data);
        }
      } catch (error) {
        console.error('Error fetching pending bookings:', error);
        alert('เกิดข้อผิดพลาดในการดึงข้อมูลการจองที่รอการอนุมัติ');
      }
    }

    fetchPendingBookings();
  }, []);

  function isTimeSlotAvailable(room: string | null, startTime: string, endTime: string, selectedDate: Date | null) {
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
  
      // แก้ไขเงื่อนไขเพื่อไม่ให้ newStart ตรงกับ existingEnd
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
            }).add(1, 'minutes').toDate(),
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
            const backgroundColor = event.status === 'รอการอนุมัติจากผู้ดูแล' ? '#FFFFFF' : '#008000';
            const color = event.status === 'รอการอนุมัติจากผู้ดูแล' ? '#FFA500' : '#FFFFFF';
            return { style: { backgroundColor, color, border: '1px solid #FFA500' } };
          }}
        />
      </div>

      {/* Modal สำหรับยกเลิกการจอง */}
      <Modal open={cancellationModalOpen} onClose={() => setCancellationModalOpen(false)}>
        <Paper sx={{ padding: '16px', maxWidth: '500px', margin: 'auto' }}>
          <Typography variant="h6">
            ยกเลิกการจองห้อง {selectedBooking?.room}
          </Typography>
          <Typography>
            นิสิต: {selectedBooking?.studentName}
          </Typography>
          <TextField
            label="รหัสนิสิต"
            value={cancellationStudentID}
            onChange={(e) => setCancellationStudentID(e.target.value)}
            fullWidth
            sx={{ marginTop: '16px' }}
          />
          <TextField
            label="หมายเลขโทรศัพท์"
            value={cancellationPhoneNumber}
            onChange={(e) => setCancellationPhoneNumber(e.target.value)}
            fullWidth
            sx={{ marginTop: '16px' }}
          />
          <Button variant="contained" fullWidth sx={{ marginTop: '16px' }} onClick={handleCancelBooking}>
            ยืนยันการยกเลิกการจอง
          </Button>
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

  {/* Modal สำหรับแสดงการจองห้องประชุมทั้งหมด */}
  <Modal open={viewBookingsOpen} onClose={handleViewBookingsClose}>
  <Paper sx={{ padding: '16px', maxWidth: '1200px', maxHeight: '90vh', width: '95%', margin: 'auto', overflowY: 'auto' }}>
    <Typography variant="h6">เวลาว่างและการจองห้องประชุม</Typography>
    
    {/* ใช้ Grid เพื่อแบ่งคอลัมน์ */}
    <Grid container spacing={2}>
      
      {/* คอลัมน์สำหรับเวลาว่างของห้องประชุม */}
      <Grid item xs={12} md={5}>
        <Box sx={{ marginBottom: '24px' }}>
          {availableRooms.map((room) => {
            const bookingsForRoom = sortedBookings.filter((booking) => booking.room === room);
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

            const unavailableTimes = bookingsForRoom.map((booking) => ({
              start: moment(booking.startTime, 'HH:mm'),
              end: moment(booking.endTime, 'HH:mm'),
            }));
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
                  availableIntervals.push({ start: previousEnd.format('HH:mm'), end: startMoment.format('HH:mm'), isAvailable: true });
                }
                availableIntervals.push({ start: startMoment.format('HH:mm'), end: endMoment.format('HH:mm'), isAvailable: false });
                previousEnd = endMoment;
              }
            });
            if (previousEnd.isBefore(moment('17:00', 'HH:mm'))) {
              availableIntervals.push({ start: previousEnd.format('HH:mm'), end: '17:00', isAvailable: true });
            }

            return (
              <Box key={room} sx={{ marginBottom: '16px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{`ห้อง: ${room}`}</Typography>
                <Grid container spacing={1}>
                  {availableIntervals.map(({ start, end, isAvailable }) => (
                    <Grid item xs={12} key={`${start}-${end}`}>
                      <Box
                        sx={{
                          backgroundColor: isAvailable ? '#A5D6A7' : '#EF9A9A', // สีที่สบายตามากขึ้น
                          color: '#000',
                          padding: '8px',
                          textAlign: 'center',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                        }}
                      >
                        {`${start} - ${end} ${isAvailable ? 'ว่าง' : 'ไม่ว่าง'}`}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ marginTop: '16px', marginBottom: '16px' }} />
              </Box>
            );
          })}
        </Box>
      </Grid>

      {/* เส้นแบ่งแนวตั้งระหว่างสองคอลัมน์ */}
      <Grid item xs={12} md={1}>
        <Divider orientation="vertical" flexItem sx={{ height: '100%' }} />
      </Grid>

      {/* คอลัมน์สำหรับแสดงรายการการจอง */}
      <Grid item xs={12} md={6}>
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
