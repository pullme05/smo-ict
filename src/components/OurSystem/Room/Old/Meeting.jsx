import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, TextField, Button, MenuItem, Select,
  FormControl, InputLabel, Snackbar, Alert, Dialog, DialogActions,
  DialogContent, DialogTitle, Card, CardContent, CardMedia
} from '@mui/material';
// import './Meeting.css';

function Meeting() {
  // สถานะต่างๆ
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('00:00');
  const [meetingDuration, setMeetingDuration] = useState('30');
  const [selectedRoom, setSelectedRoom] = useState('Room1');
  const [studentID, setStudentID] = useState('');
  const [studentName, setStudentName] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorFields, setErrorFields] = useState({
    studentID: false,
    meetingTitle: false,
    studentName: false,
    meetingDate: false
  });
  const [bookings, setBookings] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState(null); // เพิ่มสถานะสำหรับข้อมูลฟอร์ม

  // ข้อมูลห้องประชุม
  const [rooms, setRooms] = useState([
    { id: 'Room1', name: 'ห้องประชุม A', status: 'ว่าง', imgSrc: 'https://via.placeholder.com/250?text=Room+A' },
    { id: 'Room2', name: 'ห้องประชุม B', status: 'ว่าง', imgSrc: 'https://via.placeholder.com/250?text=Room+B' }
  ]);

  // ตรวจสอบรหัสนักศึกษา
  const validateStudentID = (id) => {
    if (id.length !== 8 || isNaN(id)) {
      setErrorFields(prev => ({ ...prev, studentID: true }));
      setErrorMessage(isNaN(id) ? 'รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้น' : 'กรุณากรอกรหัสนักศึกษาให้ถูกต้อง');
    } else {
      setErrorFields(prev => ({ ...prev, studentID: false }));
      setErrorMessage('');
    }
  };

  const handleAdvanceBooking = () => {
    // ลอจิกสำหรับการจองล่วงหน้า
    console.log('จองล่วงหน้า');
    // เพิ่มโค้ดสำหรับการจัดการจองล่วงหน้า
  };
  
  // จัดการการเปลี่ยนแปลงของฟอร์ม
  const handleChange = (setter, validator) => (event) => {
    const value = event.target.value;
    setter(value);
    validator(value);
  };

  // เปิด Dialog สำหรับการยืนยัน
  const handleOpenDialog = () => {
    setConfirmationMessage(
      `การประชุม "${meetingTitle}" ถูกจองในวันที่ ${meetingDate} เวลา ${meetingTime} เป็นเวลา ${meetingDuration} นาที.\nรหัสนักศึกษา: ${studentID}, ชื่อ-นามสกุล: ${studentName}\nห้องประชุมที่เลือก: ${rooms.find(room => room.id === selectedRoom).name}`
    );
    setDialogOpen(true);
  };

// ฟังก์ชันตรวจสอบเวลาจองซ้ำ และจำกัดจำนวนการจองห้อง
const isTimeSlotAvailable = (newStartTime, newEndTime, selectedRoom) => {
  const isSlotAvailable = !bookings.some(booking => {
    const existingStartTime = new Date(booking.startTime);
    const existingEndTime = new Date(booking.endTime);
    return booking.selectedRoom === selectedRoom &&
      ((newStartTime >= existingStartTime && newStartTime < existingEndTime) || // เวลาจองใหม่อยู่ระหว่างการจองเดิม
      (newEndTime > existingStartTime && newEndTime <= existingEndTime) || // เวลาสิ้นสุดจองใหม่อยู่ระหว่างการจองเดิม
      (newStartTime <= existingStartTime && newEndTime >= existingEndTime)); // จองใหม่ครอบคลุมการจองเดิม
  });

  // ตรวจสอบจำนวนการจองของห้องที่เลือก
  const bookingCount = bookings.filter(booking => booking.selectedRoom === selectedRoom).length;
  const isRoomLimitExceeded = bookingCount >= 2;

  return isSlotAvailable && !isRoomLimitExceeded;
};

// จัดการการส่งฟอร์ม
const handleSubmit = (event) => {
  event.preventDefault();

  // ตรวจสอบข้อมูลว่ากรอกครบหรือยัง
  if (!meetingDate || !studentName || studentID.length !== 8) {
    setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
    setSnackbarOpen(true);
    return;
  }

  const meetingStartTime = new Date(`${meetingDate}T${meetingTime}`);
  const meetingEndTime = new Date(meetingStartTime.getTime() + parseInt(meetingDuration) * 60000);
  const now = new Date(); // เวลาปัจจุบัน

  // ตรวจสอบว่าเวลาที่เลือกไม่อยู่ในอดีต
  if (meetingStartTime < now) {
    setErrorMessage('ไม่สามารถ้ลือกเวลาในอดีตได้');
    setSnackbarOpen(true);
    return;
  }

  // เช็คสถานะห้องที่เลือก
  const selectedRoomStatus = rooms.find(room => room.id === selectedRoom)?.status;

  if (selectedRoomStatus === 'ไม่ว่าง') {
    setErrorMessage('ห้องนี้ได้มีการใช่งานอยู่ กรุณาเลือกห้องอื่น');
    setSnackbarOpen(true);
    return;
  }

  // ตรวจสอบเวลาทับซ้อน และจำนวนการจองห้อง
  if (!isTimeSlotAvailable(meetingStartTime, meetingEndTime, selectedRoom)) {
    setErrorMessage('ห้องนี้มีการจองเต็มแล้ว หรือเวลาที่เลือกทับซ้อนกับการจองอื่น');
    setSnackbarOpen(true);
    return;
  }

  setFormData({
    meetingDate,
    meetingTime,
    meetingDuration,
    selectedRoom,
    studentID,
    studentName,
    startTime: meetingStartTime.toISOString(),
    endTime: meetingEndTime.toISOString(),
  });

  handleOpenDialog(); // เปิด dialog ยืนยันการจอง
};

  // ยืนยันการจองใน Dialog
  const handleConfirm = () => {
    if (formData) {
      const newBooking = {
        ...formData,
        timeToMeeting: new Date(formData.startTime).getTime() - new Date().getTime(),
      };

      setBookings([...bookings, newBooking]);

      // เคลียร์ข้อมูลฟอร์ม
      setMeetingTitle('');
      setMeetingDate('');
      setMeetingTime('00:00');
      setMeetingDuration('30');
      setSelectedRoom('Room1');
      setStudentID('');
      setStudentName('');

      setFormData(null); // ล้างข้อมูลฟอร์ม
      setSnackbarOpen(true); // แสดงข้อความสำเร็จ
    }
    setDialogOpen(false);
  };

  // ยกเลิกการจองใน Dialog
  const handleCancel = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setBookings(prevBookings => prevBookings.map(booking => {
        const startTime = new Date(booking.startTime);
        const endTime = new Date(booking.endTime);

        const timeToMeeting = startTime.getTime() - now.getTime();
        const hoursToMeeting = Math.max(0, Math.floor(timeToMeeting / 3600000));
        const minutesToMeeting = Math.max(0, Math.floor((timeToMeeting % 3600000) / 60000));
        const secondsToMeeting = Math.max(0, Math.floor((timeToMeeting % 60000) / 1000));

        const timeDiff = endTime.getTime() - now.getTime();
        const hoursLeft = Math.max(0, Math.floor(timeDiff / 3600000));
        const minutesLeft = Math.max(0, Math.floor((timeDiff % 3600000) / 60000));
        const secondsLeft = Math.max(0, Math.floor((timeDiff % 60000) / 1000));

        const isMeetingStarted = now >= startTime && now <= endTime;

        return {
          ...booking,
          isMeetingStarted,
          timeToMeeting: { hours: hoursToMeeting, minutes: minutesToMeeting, seconds: secondsToMeeting },
          timeLeft: { hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft },
        };
      }));

      // อัพเดตสถานะห้องประชุม
      const updatedRooms = rooms.map(room => {
        const isRoomOccupied = bookings.some(booking => booking.selectedRoom === room.id && now < new Date(booking.endTime));
        return {
          ...room,
          status: isRoomOccupied ? 'ไม่ว่าง' : 'ว่าง'
        };
      });

      setRooms(updatedRooms);

    }, 1000);

    return () => clearInterval(interval);
  }, [bookings, rooms]);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <div className="leftColumn">
            {rooms.map(room => (
              <div
                key={room.id}
                className={room.id === selectedRoom ? 'selectedRoom' : ''}
              >
                <img src={room.imgSrc} alt={room.name} className="image" />
                <Typography variant="h6">{room.name}</Typography>
                <div className={room.status === 'ว่าง' ? 'available' : 'notAvailable'}>
                  <span className="statusIndicator"></span>
                  <Typography>{room.status}</Typography>
                </div>
              </div>
            ))}
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <div className="formContainer">
            <Typography variant="h5">จองการประชุม</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* ฟิลด์เลือกห้องประชุม */}
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>เลือกห้องประชุม</InputLabel>
                    <Select
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      required
                    >
                      {rooms.map(room => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* ฟิลด์ชื่อการประชุม */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="ชื่อการประชุม"
                    value={meetingTitle}
                    onChange={handleChange(setMeetingTitle, value => !value ? setErrorFields(prev => ({ ...prev, meetingTitle: true })) : setErrorFields(prev => ({ ...prev, meetingTitle: false })))}
                    error={errorFields.meetingTitle}
                    helperText={errorFields.meetingTitle ? 'กรุณากรอกชื่อการประชุม' : ''}
                    required
                  />
                </Grid>

                {/* ฟิลด์รหัสนักศึกษา */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="รหัสนักศึกษา"
                    value={studentID}
                    onChange={handleChange(setStudentID, value => validateStudentID(value))}
                    error={errorFields.studentID}
                    helperText={errorFields.studentID ? errorMessage : ''}
                    required
                  />
                </Grid>

                {/* ฟิลด์ชื่อ-นามสกุล */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="ชื่อ-นามสกุล"
                    value={studentName}
                    onChange={handleChange(setStudentName, value => !value ? setErrorFields(prev => ({ ...prev, studentName: true })) : setErrorFields(prev => ({ ...prev, studentName: false })))}
                    error={errorFields.studentName}
                    helperText={errorFields.studentName ? 'กรุณากรอกชื่อ-นามสกุล' : ''}
                    required
                  />
                </Grid>

                {/* ฟิลด์ระยะเวลา */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>ระยะเวลา (นาที)</InputLabel>
                    <Select
                      value={meetingDuration}
                      onChange={(e) => setMeetingDuration(e.target.value)}
                      required
                    >
                      <MenuItem value="30">30 นาที</MenuItem>
                      <MenuItem value="60">60 นาที</MenuItem>
                      <MenuItem value="90">90 นาที</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* ฟิลด์เวลาประชุม */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="เวลาประชุม (HH:MM)"
                    type="time"
                    value={meetingTime}
                    onChange={handleChange(setMeetingTime)}
                    required
                  />
                </Grid>

                {/* ฟิลด์วันที่ประชุม */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="วันที่ประชุม (YYYY-MM-DD)"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={meetingDate}
                    onChange={handleChange(setMeetingDate, value => !value ? setErrorFields(prev => ({ ...prev, meetingDate: true })) : setErrorFields(prev => ({ ...prev, meetingDate: false })))}
                    error={errorFields.meetingDate}
                    helperText={errorFields.meetingDate ? 'กรุณากรอกวันที่ประชุม' : ''}
                    required
                  />
                </Grid>
                {/* ปุ่มยืนยันการจอง และปุ่มจองล่วงหน้า */}
                <Grid item xs={12}>
                  <div className="buttonContainer">
                    <Button type="submit" variant="contained" color="primary" style={{ marginBottom: '8px' }}>
                      ยืนยันการจอง
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={handleAdvanceBooking}
                    >
                      จองล่วงหน้า
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
            <div className="historyContainer">
        <Typography variant="h5">ประวัติการจอง</Typography>
        {bookings.map((booking, index) => (
          <Card key={index} style={{ marginBottom: '16px' }}>
            <CardMedia
              component="img"
              height="140"
              image={rooms.find(room => room.id === booking.selectedRoom)?.imgSrc}
              alt={rooms.find(room => room.id === booking.selectedRoom)?.name}
            />
            <CardContent>
              <Typography variant="h6">{booking.meetingTitle}</Typography>
              <Typography>วันที่: {booking.meetingDate}</Typography>
              <Typography>เวลาเริ่ม: {booking.meetingTime}</Typography>
              <Typography>ระยะเวลา: {booking.meetingDuration} นาที</Typography>
              <Typography>ห้องประชุม: {rooms.find(room => room.id === booking.selectedRoom)?.name}</Typography>
              
              {/* ส่วนที่ 1: เวลาที่เหลือจนถึงเวลาที่จอง */}
              <Typography>
                {booking && !booking.isMeetingStarted ? (
                  `เวลาที่จองไว้อีก: ${booking.timeToMeeting ? `${booking.timeToMeeting.hours || 0} ชั่วโมง ${booking.timeToMeeting.minutes || 0} นาที ${booking.timeToMeeting.seconds || 0} วินาที` : 'ข้อมูลไม่พร้อม'}`
                ) : (
                  `ระยะเวลาที่เลือก: ${booking.meetingDuration} นาที`
                )}
              </Typography>

              {/* ส่วนที่ 2: ระยะเวลาที่นับถอยหลังหลังจากการประชุมเริ่มต้นแล้ว */}
              <Typography>
                {booking && booking.isMeetingStarted ? (
                  booking.timeLeft ? (
                    `เหลือเวลา: ${booking.timeLeft.hours || 0} ชั่วโมง ${booking.timeLeft.minutes || 0} นาที ${booking.timeLeft.seconds || 0} วินาที`
                  ) : (
                    "Stand by"
                  )
                ) : null}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          {errorMessage} {/* ข้อความจะแสดงตาม errorMessage ที่ตั้งค่าไว้ */}
        </Alert>
      </Snackbar>

      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>ยืนยันการจอง</DialogTitle>
        <DialogContent>
          <Typography>{confirmationMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">ยกเลิก</Button>
          <Button onClick={handleConfirm} color="primary">ยืนยัน</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Meeting;
