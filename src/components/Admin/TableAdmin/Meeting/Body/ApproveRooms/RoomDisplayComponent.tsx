import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

interface RoomDisplayProps {
  bookings: {
    id: number;
    roomName: string;   // ชื่อห้องประชุม
    name: string;       // ชื่อผู้จอง
    studentId: string;  // รหัสนิสิต
    contact: string;    // อีเมลหรือเบอร์โทรศัพท์
    date: string;       // วันที่
    duration: number;   // ระยะเวลา
    participants: string; // จำนวนผู้เข้าร่วม
    purpose: string;    // วัตถุประสงค์
    notes: string;      // หมายเหตุเพิ่มเติม
    status: 'pending' | 'approved' | 'rejected'; // สถานะการจอง
    rejectReason?: string; // เหตุผลการปฏิเสธ
  }[];
  currentUser: string; // รหัสผู้ใช้ที่ลงชื่อเข้าใช้
}

const RoomDisplayComponent: React.FC<RoomDisplayProps> = ({ bookings, currentUser }) => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        สถานะการจองห้องประชุม
      </Typography>
      {bookings.map((booking) => (
        <Card key={booking.id} variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{booking.roomName}</Typography>
            <Typography variant="subtitle1">ผู้จอง: {booking.name}</Typography>
            {booking.name === currentUser ? (
              <>
                <Typography variant="body2">รหัสนิสิต: {booking.studentId}</Typography>
                <Typography variant="body2">อีเมล/เบอร์โทรศัพท์: {booking.contact}</Typography>
                <Typography variant="body2">วันที่: {booking.date}</Typography>
                <Typography variant="body2">ระยะเวลา: {booking.duration} นาที</Typography>
                <Typography variant="body2">จำนวนผู้เข้าร่วม: {booking.participants}</Typography>
                <Typography variant="body2">วัตถุประสงค์: {booking.purpose}</Typography>
                <Typography variant="body2">หมายเหตุเพิ่มเติม: {booking.notes}</Typography>
                {booking.status === 'rejected' && (
                  <Typography variant="body2" color="error">เหตุผลการปฏิเสธ: {booking.rejectReason}</Typography>
                )}
              </>
            ) : (
              <>
                <Typography variant="body2">วันที่: {booking.date}</Typography>
                <Typography variant="body2">ระยะเวลา: {booking.duration} นาที</Typography>
                <Typography variant="body2">สถานะ: 
                  <span className={`font-bold ${booking.status === 'approved' ? 'text-green-600' : booking.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {booking.status === 'pending' ? 'รอการอนุมัติ' : booking.status === 'approved' ? 'อนุมัติแล้ว' : 'ถูกปฏิเสธ'}
                  </span>
                </Typography>
                {booking.status === 'rejected' && (
                  <Typography variant="body2" color="error">เหตุผลการปฏิเสธ: {booking.rejectReason}</Typography>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default RoomDisplayComponent;
