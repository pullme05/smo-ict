import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Modal, 
  TextField 
} from '@mui/material';

// สร้าง interface สำหรับข้อมูลการจอง
interface BookingData {
  id: number;
  roomName: string;
  name: string;
  studentId: string;
  contact: string;
  date: string;
  duration: number;
  participants: string;
  purpose: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
}

// สร้าง interface สำหรับ props ของ ApprovalComponent
interface ApprovalComponentProps {
  bookings: BookingData[];
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
}

// สร้าง ApprovalComponent
const ApprovalComponent: React.FC<ApprovalComponentProps> = ({ bookings, onApprove, onReject }) => {
  const [rejectReason, setRejectReason] = useState<string>(''); // สถานะของเหตุผลการปฏิเสธ
  const [isOpen, setIsOpen] = useState<boolean>(false); // สถานะเปิดปิด pop-up
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null); // ข้อมูลการจองที่เลือก

  const handleShowDetails = (booking: BookingData) => {
    setSelectedBooking(booking);
    setIsOpen(true);
  };

  // เช็คว่ามีการจองที่รอการอนุมัติหรือไม่
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');

  return (
    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        รายการการจองที่รอการอนุมัติ
      </Typography>
      {/* แสดงเฉพาะถ้ามีการจองที่รออนุมัติ */}
      {pendingBookings.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          ไม่มีการจองที่รอการอนุมัติ
        </Typography>
      ) : (
        pendingBookings.map((booking) => (
          <Card key={booking.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 60, height: 60, bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
                  <Typography variant="caption" color="textSecondary">{booking.roomName}</Typography>
                </Box>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body1">ผู้จอง: {booking.name}</Typography>
                  <Typography variant="body2" color="textSecondary">รหัสนิสิต: {booking.studentId}</Typography>
                  <Typography variant="body2" color="textSecondary">วันที่: {booking.date}</Typography>
                  <Typography variant="body2" color="textSecondary">ระยะเวลา: {booking.duration} นาที</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button variant="contained" color="success" onClick={() => onApprove(booking.id)}>
                  อนุมัติ
                </Button>
                <Button variant="contained" color="error" onClick={() => onReject(booking.id, rejectReason)}>
                  ปฏิเสธ
                </Button>
                <Button variant="outlined" onClick={() => handleShowDetails(booking)}>
                  แสดงรายละเอียด
                </Button>
              </Box>
              <TextField 
                label="เหตุผลการปฏิเสธ" 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mt: 1, width: '100%' }} 
              />
            </CardContent>
          </Card>
        ))
      )}

      {/* Pop-up สำหรับรายละเอียดการจอง */}
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', bgcolor: 'rgba(0, 0, 0, 0.5)' }}>
          <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6">รายละเอียดการจอง</Typography>
            {selectedBooking && (
              <>
                <Typography>ชื่อห้อง: {selectedBooking.roomName}</Typography>
                <Typography>ผู้จอง: {selectedBooking.name}</Typography>
                <Typography>รหัสนิสิต: {selectedBooking.studentId}</Typography>
                <Typography>อีเมล/เบอร์โทรศัพท์: {selectedBooking.contact}</Typography>
                <Typography>วันที่: {selectedBooking.date}</Typography>
                <Typography>ระยะเวลา: {selectedBooking.duration} นาที</Typography>
                <Typography>จำนวนผู้เข้าร่วม: {selectedBooking.participants}</Typography>
                <Typography>วัตถุประสงค์: {selectedBooking.purpose}</Typography>
                <Typography>หมายเหตุเพิ่มเติม: {selectedBooking.notes}</Typography>
              </>
            )}
            <Button variant="outlined" onClick={() => setIsOpen(false)} sx={{ mt: 2 }}>
              ปิด
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ApprovalComponent;
