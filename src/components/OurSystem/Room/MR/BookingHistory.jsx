import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import "./BookingHistory.css"; 

function calculateTimeLeft(meetingDate, meetingTime) {
  const now = new Date();
  const meetingStartTime = new Date(`${meetingDate}T${meetingTime}:00`);
  
  const timeDifference = meetingStartTime - now;
  
  if (timeDifference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

function calculateTimeLeftAfterMeeting(meetingDuration, meetingStartTime) {
  const now = new Date();
  const endTime = new Date(meetingStartTime.getTime() + meetingDuration * 60000); // เวลาสิ้นสุดการประชุม

  const timeDifference = endTime - now;

  if (timeDifference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

function BookingHistory({ bookings, rooms }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // อัพเดตเวลาใหม่ทุกวินาที
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const booking = bookings.find(b => b.isMeetingStarted);
        if (booking) {
          const meetingStartTime = new Date(`${booking.meetingDate}T${booking.meetingTime}:00`);
          return calculateTimeLeftAfterMeeting(booking.meetingDuration, meetingStartTime);
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer); // ทำความสะอาด timer เมื่อคอมโพเนนต์ถูกทำลาย
  }, [bookings]);

  return (
    <div className="historyContainer">
      <Typography variant="h5">ประวัติการจอง</Typography>
      {bookings.map((booking, index) => {
        const timeToMeeting = calculateTimeLeft(booking.meetingDate, booking.meetingTime);
        const isMeetingStarted = booking.isMeetingStarted;
        const meetingStartTime = new Date(`${booking.meetingDate}T${booking.meetingTime}:00`);

        return (
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
                {!isMeetingStarted ? (
                  timeToMeeting ? (
                    `เวลาที่จองไว้อีก: ${timeToMeeting.hours || 0} ชั่วโมง ${timeToMeeting.minutes || 0} นาที ${timeToMeeting.seconds || 0} วินาที`
                  ) : (
                    'ข้อมูลไม่พร้อม'
                  )
                ) : null}
              </Typography>

              {/* ส่วนที่ 2: ระยะเวลาที่นับถอยหลังหลังจากการประชุมเริ่มต้นแล้ว */}
              <Typography>
                {isMeetingStarted ? (
                  timeLeft ? (
                    timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
                      'เวลาหมด'
                    ) : (
                      `Stand by: ${timeLeft.hours || 0} ชั่วโมง ${timeLeft.minutes || 0} นาที ${timeLeft.seconds || 0} วินาที`
                    )
                  ) : (
                    'Stand by'
                  )
                ) : null}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default BookingHistory;
