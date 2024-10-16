  import { useState, useEffect } from 'react';
  import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
  import moment from 'moment-timezone';
  import { Typography, Box, Modal, Paper, TextField, Button, MenuItem,Divider, Grid, Card,  } from '@mui/material';
  import axios from 'axios';
  import 'react-big-calendar/lib/css/react-big-calendar.css';
  import { Bar } from 'react-chartjs-2';
  import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
  moment.tz.setDefault('Asia/Bangkok');
  const localizer = momentLocalizer(moment);
  
  // ลงทะเบียนกราฟที่ใช้
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
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
    const [selectedBooking, setSelectedBooking] = useState<CustomEvent | Booking | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
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
    // เพิ่มฟังก์ชันสำหรับปฏิเสธการจอง
    async function handleRejectBooking() {
      if (selectedBooking) {
      try {
        const response = await axios.post(`http://localhost:8000/api/bookings/reject/${selectedBooking.studentID}`, {
          startTime: selectedBooking.startTime,
          endTime: selectedBooking.endTime,
          status: 'ปฏิเสธการจอง',
        });

        if (response.status === 200) {
          alert('ปฏิเสธการจองสำเร็จ');
          // อัปเดตสถานะการจองใน state
          setPendingBookings((prev) =>
            prev.map((booking) =>
              booking.studentID === selectedBooking.studentID
                ? { ...booking, status: 'ปฏิเสธการจอง' }
                : booking
            )
          );
          setCancellationModalOpen(false);
        } else {
          alert('ไม่สามารถอัปเดตฐานข้อมูลได้');
        }
      } catch (error) {
        console.error('Error rejecting booking:', error);
        alert('เกิดข้อผิดพลาดในการปฏิเสธการจอง');
      }
    }
  }

  async function handleEditBooking() {
    if (selectedBooking) {
      if (!selectedBooking.studentID) {
        alert('ไม่พบ Student ID การจองที่ต้องการแก้ไข');
        return;
      }

      const updatedBooking = {
        startTime,
        endTime,
        room: selectedRoom || selectedBooking.room,
        // เพิ่มฟิลด์อื่นๆ ที่ต้องการอัปเดตที่นี่
      };

      try {
        const studentID = selectedBooking.studentID.toString();  // เปลี่ยน studentID เป็น string ก่อนส่ง (ถ้าจำเป็น)
        const url = `http://localhost:8000/api/bookings/update/${studentID}`;
        console.log('Updating booking with URL:', url);  // Debugging URL

        const response = await axios.put(url, updatedBooking);
        
        if (response.status === 200) {
          alert('แก้ไขข้อมูลการจองสำเร็จ');
          setPendingBookings((prev) =>
            prev.map((booking) =>
              booking.studentID === selectedBooking.studentID ? { ...booking, ...updatedBooking } : booking
            )
          );
          setEditModalOpen(false);
          setCancellationModalOpen(false);
        } else {
          alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
        }
      } catch (error) {
        console.error('Error updating booking:', error);
        alert('เกิดข้อผิดพลาดในการแก้ไขการจอง');
      }
    } else {
      alert('กรุณาเลือกการจองที่ต้องการแก้ไข');
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

    // State สำหรับควบคุมการแสดง Modal
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  // เปิด/ปิด Modal
  const handleSummaryModalOpen = () => setSummaryModalOpen(true);
  const handleSummaryModalClose = () => setSummaryModalOpen(false);

  // ดึงข้อมูลการจองและสรุปจำนวนห้อง
  const totalBookings = pendingBookings.length;
  const room1Bookings = pendingBookings.filter((booking) => booking.room === 'ห้อง 1').length;
  const room2Bookings = pendingBookings.filter((booking) => booking.room === 'ห้อง 2').length;
  const room3Bookings = pendingBookings.filter((booking) => booking.room === 'ห้อง 3').length;
  const approvedBookings = pendingBookings.filter((booking) => booking.status === 'อนุมัติแล้ว').length;
  const rejectedBookings = pendingBookings.filter((booking) => booking.status === 'ถูกปฏิเสธ').length;

  // ข้อมูลสำหรับกราฟ
  const data = {
    labels: ['ห้องทั้งหมด', 'ห้อง 1', 'ห้อง 2', 'ห้อง 3', 'อนุมัติแล้ว', 'ถูกปฏิเสธ'],
    datasets: [
      {
        label: 'จำนวนการจองห้องทั้งหมด',
        data: [totalBookings, room1Bookings, room2Bookings, room3Bookings, approvedBookings, rejectedBookings],
        backgroundColor: ['#996600', '#8d38c9', '#c4996c', '#FFCC33', '#33CC33', '#FF3333'], // สีที่ไม่ซ้ำกัน
      },
  
    ],
  };

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
          <Button variant="contained" onClick={handleViewBookingsOpen} sx={{ marginBottom: '16px' }}>
            ดูการจองห้องประชุม
          </Button>
          <br/>
          <Button variant="contained" onClick={handleSummaryModalOpen}>
        ผลสรุปการจองห้องประชุม
      </Button>
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

        {/* Modal สำหรับยกเลิกและอนุมัติการจองและปฎิเสธ */}
        <Modal open={cancellationModalOpen} onClose={() => setCancellationModalOpen(false)}>
          <Paper sx={{ padding: '16px', maxWidth: '650px', margin: 'auto' }}>
            <Typography variant="h6">การจองห้อง {selectedBooking?.room}</Typography>
            {
              selectedBooking && 'start' in selectedBooking && (
                <Typography>
                  วันที่จอง: {moment(selectedBooking.start).format('DD MMMM YYYY')}
                </Typography>
              )
            }
            {
              selectedBooking && 'end' in selectedBooking && (
                <Typography>
                  เวลา: {moment(selectedBooking.start).format('HH:mm')} - {moment(selectedBooking.end).format('HH:mm')}
                </Typography>
              )
            }
            <Typography>ชื่อผู้จอง: {selectedBooking?.studentName}</Typography>
            <Typography>รหัสนิสิต: {selectedBooking?.studentID}</Typography>
            <Typography>หมายเลขโทรศัพท์: {selectedBooking?.phoneNumber}</Typography>
            <Typography>วัตถุประสงค์: {selectedBooking?.purpose || 'ไม่ระบุ'}</Typography>
            
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="contained" color="primary" onClick={handleApproveBooking}>
                อนุมัติการจอง
              </Button>
              <Button variant="contained" color="warning" onClick={handleRejectBooking}>
                ปฏิเสธการจอง
              </Button>
              <Button variant="contained" color="info" onClick={() => setEditModalOpen(true)}>
                แก้ไขการจองห้อง
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

        {/* Modal สำหรับแก้ไขการจอง */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Paper sx={{ padding: '16px', maxWidth: '500px', margin: 'auto' }}>
          <Typography variant="h6">แก้ไขการจอง</Typography>

          <TextField
            label="เลือกห้อง"
            value={selectedRoom ?? selectedBooking?.room ?? ''}
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
        label="เวลาเริ่ม"
        select
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        fullWidth
        sx={{ marginTop: '16px' }}
        InputLabelProps={{ shrink: true }}
      >
        {times.map((time) => (
          <MenuItem key={time} value={time}>
            {time}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="เวลาสิ้นสุด"
        select
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        fullWidth
        sx={{ marginTop: '16px' }}
        InputLabelProps={{ shrink: true }}
      >
        {times.map((time) => (
          <MenuItem key={time} value={time}>
            {time}
          </MenuItem>
        ))}
      </TextField>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary" onClick={handleEditBooking}>
              บันทึกการแก้ไข
            </Button>
          </Box>
        </Paper>
      </Modal>
      
      {/* Modal สำหรับแสดงการจองห้องประชุมทั้งหมด */}
      <Modal open={viewBookingsOpen} onClose={handleViewBookingsClose}>
        <Paper sx={{ padding: '16px', maxWidth: '1200px', maxHeight: '90vh', width: '95%', margin: 'auto', overflowY: 'auto' }}>
          <Typography variant="h6">เวลาว่างและการจองห้องประชุม</Typography>

          {/* ใช้ Grid เพื่อแบ่งคอลัมน์ */}
          <Grid container spacing={2} alignItems="flex-start">

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
                                backgroundColor: isAvailable ? '#A5D6A7' : '#EF9A9A',
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

            {/* Divider เส้นแนวตั้ง */}
            <Divider orientation="vertical" flexItem sx={{ marginLeft: '16px', marginRight: '16px' }} />

            {/* คอลัมน์สำหรับรายการจองทั้งหมด */}
          <Grid item xs={12} md={6}>
            <Box sx={{ marginTop: '16px' }}>
              <Typography variant="h6" sx={{ marginBottom: '16px', fontWeight: 'bold' }}>รายการการจองทั้งหมด</Typography>

              {availableRooms.map((room) => (
                <Box key={room} sx={{ marginBottom: '32px' }}>
                  <Typography variant="h6" sx={{ marginBottom: '8px', color: 'black', fontWeight: 'bold' }}>
                    {room}
                  </Typography>

                  {/* รอการตอบรับจากผู้ดูแล (สีส้มอ่อน) */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginTop: '16px' }}>รอการตอบรับจากผู้ดูแล</Typography>
                  {pendingBookings
                    .filter((booking) => booking.room === room && booking.status === 'รอการอนุมัติจากผู้ดูแล')
                    .map((booking) => (
                      <Card key={booking.studentID} sx={{ padding: '16px', backgroundColor: '#FFE0B2', marginBottom: '16px' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>{booking.studentName} ({booking.studentID})</Typography>
                        <Typography>{`เวลา: ${booking.startTime} ถึง ${booking.endTime}`}</Typography>
                        <Typography>{`เบอร์โทร: ${booking.phoneNumber}`}</Typography>
                        <Typography>{`วัตถุประสงค์: ${booking.purpose}`}</Typography>
                        <Typography>{`สถานะ: ${booking.status}`}</Typography>

                        {/* ปุ่มอนุมัติ, ปฏิเสธ, แก้ไขการจอง, ยกเลิกการจอง */}
                        <Box sx={{ marginTop: '16px' }}>
                          <Button variant="contained" color="success" sx={{ marginRight: '8px' }} onClick={() => {
                              setSelectedBooking(booking);
                              handleApproveBooking();
                          }}>อนุมัติการจอง</Button>
                          <Button variant="contained" color="error" sx={{ marginRight: '8px' }} onClick={() => {
                              setSelectedBooking(booking);
                              handleRejectBooking();
                          }}>ปฏิเสธการจอง</Button>
                          <Button variant="outlined" sx={{ marginRight: '8px' }} onClick={() => {
                              setSelectedBooking(booking);
                              setEditModalOpen(true); // เปิด Modal สำหรับแก้ไขการจอง
                          }}>แก้ไขการจอง</Button>
                          <Button variant="outlined" color="secondary" onClick={() => {
                              setSelectedBooking(booking);
                              handleCancelBooking();
                          }}>ยกเลิกการจอง</Button>
                        </Box>
                      </Card>
                    ))}

                  {/* อนุมัติแล้ว (สีเขียวอ่อน) */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginTop: '16px' }}>อนุมัติแล้ว</Typography>
                  {pendingBookings
                    .filter((booking) => booking.room === room && booking.status === 'อนุมัติแล้ว')
                    .map((booking) => (
                      <Card key={booking.studentID} sx={{ padding: '16px', backgroundColor: '#C8E6C9', marginBottom: '16px' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>{booking.studentName} ({booking.studentID})</Typography>
                        <Typography>{`เวลา: ${booking.startTime} ถึง ${booking.endTime}`}</Typography>
                        <Typography>{`เบอร์โทร: ${booking.phoneNumber}`}</Typography>
                        <Typography>{`วัตถุประสงค์: ${booking.purpose}`}</Typography>
                        <Typography>{`สถานะ: ${booking.status}`}</Typography>

                        {/* ปุ่มยกเลิกการจอง */}
                        <Box sx={{ marginTop: '16px' }}>
                          <Button variant="outlined" color="secondary" onClick={() => {
                              setSelectedBooking(booking);
                              handleCancelBooking();
                          }}>ยกเลิกการจอง</Button>
                        </Box>
                      </Card>
                    ))}

                  {/* ปฏิเสธ (สีแดงอ่อน) */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginTop: '16px' }}>ปฏิเสธ</Typography>
                  {pendingBookings
                    .filter((booking) => booking.room === room && booking.status === 'ถูกปฏิเสธ')
                    .map((booking) => (
                      <Card key={booking.studentID} sx={{ padding: '16px', backgroundColor: '#FFCDD2', marginBottom: '16px' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>{booking.studentName} ({booking.studentID})</Typography>
                        <Typography>{`เวลา: ${booking.startTime} ถึง ${booking.endTime}`}</Typography>
                        <Typography>{`เบอร์โทร: ${booking.phoneNumber}`}</Typography>
                        <Typography>{`วัตถุประสงค์: ${booking.purpose}`}</Typography>
                        <Typography>{`สถานะ: ${booking.status}`}</Typography>

                        {/* ปุ่มยกเลิกการจอง */}
                        <Box sx={{ marginTop: '16px' }}>
                          <Button variant="outlined" color="secondary" onClick={() => {
                              setSelectedBooking(booking);
                              handleCancelBooking();
                          }}>ยกเลิกการจอง</Button>
                        </Box>
                      </Card>
                    ))}
                </Box>
              ))}
            </Box>
          </Grid>

          </Grid>
          <Button onClick={handleViewBookingsClose} variant="contained" fullWidth sx={{ marginTop: '16px' }}>
            ปิด
          </Button>
        </Paper>
      </Modal>
      
        {/* Modal สำหรับแสดงกราฟสรุป */}
      <Modal open={summaryModalOpen} onClose={handleSummaryModalClose}>
        <Paper sx={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
          <Typography variant="h6" sx={{ marginBottom: '16px' }}>
            ผลสรุปการจองห้องประชุม
          </Typography>

          {/* กลุ่ม: ข้อมูลการจองห้อง */}
          <Typography variant="subtitle1" sx={{ marginBottom: '8px', fontWeight: 'bold' }}>
            ข้อมูลการจองห้อง
          </Typography>

          {/* ใช้ Flexbox เพื่อจัดหัวข้อและค่าให้อยู่แถวเดียวกัน พร้อมชิดกัน */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px', gap: '4px' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              การจองห้องทั้งหมด:
            </Typography>
            <Typography variant="body1">
              {totalBookings} ห้อง
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px', gap: '4px' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              ห้อง 1:
            </Typography>
            <Typography variant="body1">
              {room1Bookings} ห้อง
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px', gap: '4px' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              ห้อง 2:
            </Typography>
            <Typography variant="body1">
              {room2Bookings} ห้อง
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px', gap: '4px' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              ห้อง 3:
            </Typography>
            <Typography variant="body1">
              {room3Bookings} ห้อง
            </Typography>
          </Box>

          {/* Divider เพื่อแยกกลุ่มข้อมูล */}
          <Divider sx={{ marginY: '16px' }} />

          {/* กลุ่ม: ข้อมูลสถานะการจอง */}
          <Typography variant="subtitle1" sx={{ marginBottom: '8px', fontWeight: 'bold' }}>
            สถานะการจอง
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px', gap: '4px' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              อนุมัติแล้ว:
            </Typography>
            <Typography variant="body1">
              {approvedBookings} ห้อง
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px', gap: '4px' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              ถูกปฏิเสธ:
            </Typography>
            <Typography variant="body1">
              {rejectedBookings} ห้อง
            </Typography>
          </Box>

          {/* Divider เพื่อแยกส่วนกราฟ */}
          <Divider sx={{ marginY: '16px' }} />

          {/* แสดงกราฟ */}
          <Typography variant="subtitle1" sx={{ marginBottom: '8px', fontWeight: 'bold' }}>
            กราฟสรุป:
          </Typography>
          <Bar data={data} />

          {/* ปุ่มปิด Modal */}
          <Button onClick={handleSummaryModalClose} sx={{ marginTop: '16px' }}>
            ปิด
          </Button>
        </Paper>
      </Modal>
      </div>
    );
  };

  export default MeetingRoomAM;
