import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import { Typography, Box, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const localizer = momentLocalizer(moment);

const MeetingRoomAM = () => {
  const [events, setEvents] = useState<any[]>([]); // สำหรับตารางปฏิทิน
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);
  const [rejectedBookingHistory, setRejectedBookingHistory] = useState<any[]>([]); // เพิ่มส่วนนี้สำหรับการจองที่ถูกปฏิเสธ
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // ดึงข้อมูลการจองที่รออนุมัติจาก server
  async function fetchPendingBookings() {
    try {
      const response = await axios.get('http://localhost:8000/api/bookings/pending');
      if (response.status === 200) {
        setPendingBookings(response.data);
      } else {
        alert('ไม่สามารถดึงข้อมูลการจองที่รอการอนุมัติได้');
      }
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลการจองที่รอการอนุมัติ');
    }
  }

  // ดึงข้อมูลประวัติการจองที่อนุมัติแล้ว
  async function fetchApprovedBookings() {
    try {
      const response = await axios.get('http://localhost:8000/api/bookings/approved');
      if (response.status === 200) {
        setBookingHistory(response.data);
        setEvents(response.data.map((booking: any) => ({
          title: `${booking.room} - ${booking.studentName}`,
          start: new Date(booking.date),
          end: new Date(booking.date),
        }))); // เพิ่มข้อมูลการจองเข้าไปในปฏิทิน
      } else {
        alert('ไม่สามารถดึงข้อมูลประวัติการจองได้');
      }
    } catch (error) {
      console.error('Error fetching approved bookings:', error);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการจอง');
    }
  }

  // ดึงข้อมูลประวัติการจองที่ถูกปฏิเสธ
  async function fetchRejectedBookings() {
    try {
      const response = await axios.get('http://localhost:8000/api/bookings/rejected');
      if (response.status === 200) {
        setRejectedBookingHistory(response.data);
      } else {
        alert('ไม่สามารถดึงข้อมูลการจองที่ถูกปฏิเสธได้');
      }
    } catch (error) {
      console.error('Error fetching rejected bookings:', error);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลการจองที่ถูกปฏิเสธ');
    }
  }

  useEffect(() => {
    fetchPendingBookings();
    fetchApprovedBookings(); // ดึงข้อมูลการจองที่อนุมัติแล้ว
    fetchRejectedBookings(); // ดึงข้อมูลการจองที่ถูกปฏิเสธ
  }, []);

  async function handleApproveBooking(bookingId: string) {
    try {
      const response = await axios.post(`http://localhost:8000/api/bookings/approve/${bookingId}`);
      if (response.status === 200) {
        alert('อนุมัติการจองสำเร็จ');
        fetchPendingBookings(); // รีเฟรชข้อมูลการจองที่รออนุมัติ
        fetchApprovedBookings(); // รีเฟรชข้อมูลการจองที่อนุมัติแล้ว
      } else {
        alert(response.data.message || 'เกิดข้อผิดพลาดในการอนุมัติการจอง');
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      alert('เกิดข้อผิดพลาดในการอนุมัติการจอง');
    }
  }

  async function handleRejectBooking() {
    if (!selectedBookingId) return;
    try {
      const response = await axios.post(`http://localhost:8000/api/bookings/reject/${selectedBookingId}`, {
        reason: rejectionReason,
      });
      if (response.status === 200) {
        alert('ยกเลิกการจองสำเร็จ');
        fetchPendingBookings(); // รีเฟรชข้อมูลการจองที่รออนุมัติ
        fetchRejectedBookings(); // รีเฟรชข้อมูลการจองที่ถูกปฏิเสธ
        setRejectDialogOpen(false);
        setRejectionReason('');
      } else {
        alert(response.data.message || 'เกิดข้อผิดพลาดในการยกเลิกการจอง');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('เกิดข้อผิดพลาดในการยกเลิกการจอง');
    }
  }

  function handleOpenRejectDialog(bookingId: string) {
    setSelectedBookingId(bookingId);
    setRejectDialogOpen(true);
  }

  function handleCloseRejectDialog() {
    setSelectedBookingId(null);
    setRejectionReason('');
    setRejectDialogOpen(false);
  }

  return (
    <div className="w-full h-full p-4">
      <Box sx={{ backgroundColor: '#996600', color: '#fff', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>การจัดการการจองห้องประชุม (Admin)</Typography>
      </Box>

      {/* ส่วนของปฏิทิน */}
      <Box mb={5}>
        <Typography variant="h6" sx={{ mb: 2 }}>ตารางปฏิทินการจอง:</Typography>
        <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month']} // แสดงเฉพาะมุมมอง month และ agenda
        defaultView="month" // กำหนดให้เริ่มต้นด้วยมุมมอง month
      />

      </Box>

      {/* ส่วนของการจองที่รออนุมัติ */}
      <Box mt={3}>
        <Typography variant="h6" sx={{ mb: 2 }}>การจองที่รอการอนุมัติ:</Typography>
        {pendingBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {pendingBookings.map((booking) => (
              <Paper key={uuidv4()} elevation={4} style={{ padding: '16px', margin: '8px', width: '30%' }}>
                <Typography>ห้อง: {booking.room}</Typography>
                <Typography>วันที่จอง: {moment(booking.date).format('DD MMMM YYYY')}</Typography>
                <Typography>ชื่อนิสิต: {booking.studentName}</Typography>
                <Typography>รหัสนิสิต: {booking.studentID}</Typography>
                <Typography>เวลา: {booking.startTime} - {booking.endTime}</Typography>
                <Typography>วัตถุประสงค์: {booking.purpose}</Typography>
                <Typography color={booking.status === 'อนุมัติแล้ว' ? 'green' : 'orange'} sx={{ mt: 1 }}>สถานะ: {booking.status}</Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                  {booking.status === 'รอการอนุมัติจากผู้ดูแล' && (
                    <>
                      <Button variant="contained" color="success" onClick={() => handleApproveBooking(booking._id)}>อนุมัติ</Button>
                      <Button variant="contained" color="error" onClick={() => handleOpenRejectDialog(booking._id)}>ปฎิเสธ</Button>
                    </>
                  )}
                </Box>
              </Paper>
            ))}
          </div>
        ) : <Typography variant="body1">ไม่มีการจองที่รอการอนุมัติ</Typography>}
      </Box>

      {/* ส่วนของประวัติการจองที่อนุมัติแล้ว */}
      <Box mt={5}>
        <Typography variant="h6" sx={{ mb: 2 }}>ประวัติการจองที่อนุมัติแล้ว:</Typography>
        {bookingHistory.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {bookingHistory.map((history) => (
              <Paper key={uuidv4()} elevation={4} style={{ padding: '16px', margin: '8px', width: '30%' }}>
                <Typography>ห้อง: {history.room}</Typography>
                <Typography>วันที่จอง: {moment(history.date).format('DD MMMM YYYY')}</Typography>
                <Typography>ชื่อนิสิต: {history.studentName}</Typography>
                <Typography>รหัสนิสิต: {history.studentID}</Typography>
                <Typography>เวลา: {history.startTime} - {history.endTime}</Typography>
                <Typography>วัตถุประสงค์: {history.purpose}</Typography>
                <Typography color="green" sx={{ mt: 1 }}>สถานะ: อนุมัติแล้ว</Typography>
              </Paper>
            ))}
          </div>
        ) : <Typography variant="body1">ไม่มีประวัติการจองที่อนุมัติแล้ว</Typography>}
      </Box>

      {/* ส่วนของประวัติการจองที่ถูกปฏิเสธ */}
      <Box mt={5}>
        <Typography variant="h6" sx={{ mb: 2 }}>ประวัติการจองที่ถูกปฏิเสธ:</Typography>
        {rejectedBookingHistory.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {rejectedBookingHistory.map((history) => (
              <Paper key={uuidv4()} elevation={4} style={{ padding: '16px', margin: '8px', width: '30%' }}>
                <Typography>ห้อง: {history.room}</Typography>
                <Typography>วันที่จอง: {moment(history.date).format('DD MMMM YYYY')}</Typography>
                <Typography>ชื่อนิสิต: {history.studentName}</Typography>
                <Typography>รหัสนิสิต: {history.studentID}</Typography>
                <Typography>เวลา: {history.startTime} - {history.endTime}</Typography>
                <Typography>วัตถุประสงค์: {history.purpose}</Typography>
                <Typography color="red" sx={{ mt: 1 }}>สถานะ: ถูกปฏิเสธ</Typography>
              </Paper>
            ))}
          </div>
        ) : <Typography variant="body1">ไม่มีประวัติการจองที่ถูกปฏิเสธ</Typography>}
      </Box>

      {/* Popup for rejection reason */}
      <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog}>
        <DialogTitle>ป้อนเหตุผลในการปฏิเสธ</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="เหตุผล" type="text" fullWidth value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>ยกเลิก</Button>
          <Button onClick={handleRejectBooking} color="primary">ปฏิเสธ</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MeetingRoomAM;
