import React, { useState, useEffect } from 'react';
import { Container, Grid, Snackbar, Alert } from '@mui/material';
import RoomSelection from './RoomSelection';
import BookingForm from './BookingForm';
import BookingHistory from './BookingHistory';
import ConfirmationDialog from './ConfirmationDialog';
import AdvanceBookingDialog from './AdvanceBookingDialog';
// import './MainAppMeeting.css';

function MainApp() {
  const [rooms, setRooms] = useState([
    { id: 'Room1', name: 'ห้องประชุม A', status: 'ว่าง', imgSrc: 'https://via.placeholder.com/250?text=Room+A' },
    { id: 'Room2', name: 'ห้องประชุม B', status: 'ว่าง', imgSrc: 'https://via.placeholder.com/250?text=Room+B' }
  ]);

  const [bookings, setBookings] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showAdvanceBooking, setShowAdvanceBooking] = useState(false);
  const [advanceBookingData, setAdvanceBookingData] = useState(null);

  // State for BookingForm
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingDuration, setMeetingDuration] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [studentID, setStudentID] = useState('');
  const [studentName, setStudentName] = useState('');
  const [errorFields, setErrorFields] = useState({});

  const handleOpenDialog = (message) => {
    setConfirmationMessage(message);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    // ยืนยันการจอง
    const newBooking = {
      meetingTitle,
      meetingDate,
      meetingTime,
      meetingDuration,
      selectedRoom,
      studentID,
      studentName,  // เพิ่ม studentName เข้าไป
      startTime: new Date(`${meetingDate}T${meetingTime}`),
      endTime: new Date(new Date(`${meetingDate}T${meetingTime}`).getTime() + meetingDuration * 60000)
    };
  
    // เพิ่มข้อมูลการจองใหม่ไปยัง bookings
    setBookings(prevBookings => [...prevBookings, newBooking]);
  
    setDialogOpen(false);
  };  

  const handleAdvanceBooking = () => {
    const errors = {};

    if (studentID.length !== 8) {
      errors.studentID = 'กรุณากรอกรหัสนักศึกษาให้ครบ 8 หลัก';
    } else if (isNaN(studentID)) {
      errors.studentID = 'กรุณากรอกรหัสนักศึกษาเป็นตัวเลขเท่านั้น';
    }

    if (!meetingTitle) {
      errors.meetingTitle = 'กรุณากรอกชื่อการประชุม';
    }

    if (!meetingDate) {
      errors.meetingDate = 'กรุณากรอกวันที่ประชุม';
    }

    if (!meetingTime) {
      errors.meetingTime = 'กรุณากรอกเวลาประชุม';
    }

    if (!selectedRoom) {
      errors.selectedRoom = 'กรุณาเลือกห้องประชุม';
    }

    if (Object.keys(errors).length > 0) {
      setErrorFields(errors);
      setErrorMessage('กรุณาตรวจสอบข้อมูลให้ครบถ้วน');
      setSnackbarOpen(true);
      return;
    }

    setAdvanceBookingData({
      meetingTitle,
      meetingDate,
      meetingTime,
      meetingDuration,
      selectedRoom,
      studentID,
      studentName
    });
    setShowAdvanceBooking(true);
  };

  const handleConfirmBooking = () => {
    // การจัดการยืนยันการจองล่วงหน้า
    setShowAdvanceBooking(false);
  };

  const handleCancelBooking = () => {
    setShowAdvanceBooking(false);
  };

  const handleStudentIDChange = (event) => {
    const value = event.target.value;
    setStudentID(value);

    // ตรวจสอบรหัสนักศึกษาแบบเรียลไทม์
    const errors = { ...errorFields };
    if (value.length !== 8) {
      errors.studentID = 'กรุณากรอกรหัสนักศึกษาให้ครบ 8 หลัก';
    } else if (isNaN(value)) {
      errors.studentID = 'กรุณากรอกรหัสนักศึกษาเป็นตัวเลขเท่านั้น';
    } else {
      delete errors.studentID;
    }

    setErrorFields(errors);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorFields({});
    setErrorMessage('');
  
    const errors = {};
  
    // ตรวจสอบเงื่อนไขทั่วไป
    if (studentID.length !== 8) {
      errors.studentID = 'กรุณากรอกรหัสนักศึกษาให้ครบ 8 หลัก';
    } else if (isNaN(studentID)) {
      errors.studentID = 'กรุณากรอกรหัสนักศึกษาเป็นตัวเลขเท่านั้น';
    }
  
    if (!meetingTitle) {
      errors.meetingTitle = 'กรุณากรอกชื่อการประชุม';
    }
  
    if (!meetingDate) {
      errors.meetingDate = 'กรุณากรอกวันที่ประชุม';
    }
  
    if (!meetingTime) {
      errors.meetingTime = 'กรุณากรอกเวลาประชุม';
    }
  
    if (!selectedRoom) {
      errors.selectedRoom = 'กรุณาเลือกห้องประชุม';
    }
  
    // คำนวณ startTime และ endTime ของการจองใหม่
    const newStartTime = new Date(`${meetingDate}T${meetingTime}`);
    const newEndTime = new Date(newStartTime.getTime() + meetingDuration * 60000);
  
    // ตรวจสอบว่าห้องประชุมที่เลือกถูกจองอยู่หรือไม่
    const isRoomBooked = bookings.some(booking => {
      const bookingStartTime = new Date(booking.startTime);
      const bookingEndTime = new Date(booking.endTime);
  
      // ตรวจสอบการทับซ้อนของเวลาจอง
      return booking.selectedRoom === selectedRoom && 
             newStartTime < bookingEndTime && 
             newEndTime > bookingStartTime;
    });
  
    if (isRoomBooked) {
      errors.selectedRoom = 'ห้องที่คุณเลือก ได้มีการจองแล้ว';
    }
  
    // หากมี error ให้แสดงข้อความและหยุดการทำงาน
    if (Object.keys(errors).length > 0) {
      setErrorFields(errors);
      setErrorMessage('กรุณาตรวจสอบข้อมูลให้ครบถ้วน');
      setSnackbarOpen(true);
      return;
    }
  
    // เปิดการยืนยันการจอง
    handleOpenDialog('ยืนยันการจองการประชุมของคุณ');
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
    <Container maxWidth="lg" className="mainContainer">
      <Grid container spacing={3} justifyContent="space-between">
        <Grid item xs={12} md={4} className="roomSelectionContainer">
          <RoomSelection rooms={rooms} bookings={bookings} /> {/* ส่ง bookings เข้าไปด้วย */}
        </Grid>
        <Grid item xs={12} md={4} className="bookingFormContainer">
          <BookingForm
            meetingTitle={meetingTitle}
            setMeetingTitle={setMeetingTitle}
            meetingDate={meetingDate}
            setMeetingDate={setMeetingDate}
            meetingTime={meetingTime}
            setMeetingTime={setMeetingTime}
            meetingDuration={meetingDuration}
            setMeetingDuration={setMeetingDuration}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            studentID={studentID}
            setStudentID={setStudentID}
            studentName={studentName}
            setStudentName={setStudentName}
            errorFields={errorFields}
            setErrorFields={setErrorFields}
            handleSubmit={handleSubmit}
            handleAdvanceBooking={handleAdvanceBooking}
            rooms={rooms}
            onStudentIDChange={handleStudentIDChange} // ส่งฟังก์ชันตรวจสอบรหัสนักศึกษาไปยัง BookingForm
          />
          <AdvanceBookingDialog
            open={showAdvanceBooking}
            onClose={handleCancelBooking}
            data={advanceBookingData}
            onConfirm={handleConfirmBooking}
          />
        </Grid>
        <Grid item xs={12} md={4} className="bookingHistoryContainer">
          <BookingHistory bookings={bookings} rooms={rooms} />
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        confirmationMessage={confirmationMessage}
        onConfirm={handleConfirm}
      />
    </Container>
  );
}

export default MainApp;
