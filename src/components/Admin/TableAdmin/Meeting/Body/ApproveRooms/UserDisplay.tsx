import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

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
  currentUserId: string; // รหัสผู้ใช้ที่ลงชื่อเข้าใช้
}

const UserDisplay: React.FC<RoomDisplayProps> = ({ bookings, currentUserId }) => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        สถานะการจองห้องประชุม
      </Typography>
      <Grid container spacing={2}>
        {bookings.map((booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{booking.roomName}</Typography>
                <Typography variant="subtitle1">ผู้จอง: {booking.name}</Typography>
                <Typography variant="body2">วันที่: {booking.date}</Typography>
                <Typography variant="body2">ระยะเวลา: {booking.duration} นาที</Typography>
                <Typography variant="body2">
                  สถานะ: 
                  <span className={`font-bold ${booking.status === 'approved' ? 'text-green-600' : booking.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {booking.status === 'pending' ? 'รอการอนุมัติ' : booking.status === 'approved' ? 'อนุมัติแล้ว' : 'ถูกปฏิเสธ'}
                  </span>
                </Typography>
                {booking.status === 'rejected' && (
                  <Typography variant="body2" color="error">เหตุผลการปฏิเสธ: {booking.rejectReason}</Typography>
                )}
                {/* แสดงข้อมูลตามสถานะของผู้ใช้งาน */}
                {booking.studentId === currentUserId && (
                  <div>
                    <Typography variant="body2">รหัสนิสิต: {booking.studentId}</Typography>
                    <Typography variant="body2">ติดต่อ: {booking.contact}</Typography>
                    <Typography variant="body2">จำนวนผู้เข้าร่วม: {booking.participants}</Typography>
                    <Typography variant="body2">วัตถุประสงค์: {booking.purpose}</Typography>
                    <Typography variant="body2">หมายเหตุเพิ่มเติม: {booking.notes}</Typography>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserDisplay;
