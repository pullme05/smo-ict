import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Typography, Box, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider, TextField } from '@mui/material';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Modal from '@mui/material/Modal';

const localizer = momentLocalizer(moment);

const MeetingRoomAM = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);
  const [rejectedBookingHistory, setRejectedBookingHistory] = useState<any[]>([]);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

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

  async function fetchApprovedBookings() {
    try {
      const response = await axios.get('http://localhost:8000/api/bookings/approved');
      if (response.status === 200) {
        setBookingHistory(response.data);
        setEvents(response.data.map((booking: any) => ({
          title: `${booking.room} - ${booking.studentName}`,
          start: new Date(booking.date),
          end: new Date(booking.date),
          studentID: booking.studentID,
          description: booking.purpose,
        })));
      } else {
        alert('ไม่สามารถดึงข้อมูลประวัติการจองได้');
      }
    } catch (error) {
      console.error('Error fetching approved bookings:', error);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการจอง');
    }
  }

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
    fetchApprovedBookings();
    fetchRejectedBookings();
  }, []);

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  async function handleApproveBooking(bookingId: string) {
    try {
      const response = await axios.post(`http://localhost:8000/api/bookings/approve/${bookingId}`);
      if (response.status === 200) {
        alert('อนุมัติการจองสำเร็จ');
        fetchPendingBookings();
        fetchApprovedBookings();
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
        fetchPendingBookings();
        fetchRejectedBookings();
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

  // คำนวณสรุปรายเดือน
  const currentMonth = moment().month();
  const bookingsThisMonth = [...bookingHistory, ...rejectedBookingHistory].filter(
    (booking) => moment(booking.date).month() === currentMonth
  );

  const approvedThisMonth = bookingHistory.filter(
    (booking) => moment(booking.date).month() === currentMonth
  );

  const rejectedThisMonth = rejectedBookingHistory.filter(
    (booking) => moment(booking.date).month() === currentMonth
  );

  return (
    <div className="w-full h-full p-4">
      <Box sx={{ backgroundColor: '#996600', color: '#fff', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>การจัดการการจองห้องประชุม (Admin)</Typography>
      </Box>

      <Box mb={5}>
        <Typography variant="h6" sx={{ mb: 2 }}>ตารางปฏิทินการจอง:</Typography>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={['month']}
          defaultView="month"
          popup={true}
          onSelectEvent={handleSelectEvent}
        />
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedEvent && (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: '#1976d2' }}>
                {selectedEvent.title}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography>
                <strong>วันที่:</strong> {moment(selectedEvent.start).format('dddd, MMMM D, YYYY')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>รายละเอียด:</strong> {selectedEvent.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>รหัสนิสิต:</strong> {selectedEvent.studentID}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={handleClose}>ปิด</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

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
                <Typography color={booking.status === 'อนุมัติแล้ว' ? 'green' : 'orange'} sx={{ fontWeight: 'bold' }}>สถานะ: {booking.status}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: '8px' }}
                  onClick={() => handleApproveBooking(booking._id)}
                >
                  อนุมัติ
                </Button>
                <Button variant="contained" color="error" onClick={() => handleOpenRejectDialog(booking._id)}>ปฏิเสธ</Button>
              </Paper>
            ))}
          </div>
        ) : (
          <Typography>ไม่มีการจองที่รอการอนุมัติ</Typography>
        )}
      </Box>

      <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog}>
        <DialogTitle>ปฏิเสธการจอง</DialogTitle>
        <DialogContent>
          <Typography>กรุณาระบุเหตุผลในการปฏิเสธ:</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="เหตุผล"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} color="primary">ยกเลิก</Button>
          <Button onClick={handleRejectBooking} color="error">ปฏิเสธการจอง</Button>
        </DialogActions>
      </Dialog>

      <Box mt={3}>
        <Typography variant="h6">ประวัติการจองที่อนุมัติแล้ว:</Typography>
        {bookingHistory.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {bookingHistory.map((booking) => (
              <Paper key={uuidv4()} elevation={4} style={{ padding: '16px', margin: '8px', width: '30%' }}>
                <Typography>ห้อง: {booking.room}</Typography>
                <Typography>วันที่จอง: {moment(booking.date).format('DD MMMM YYYY')}</Typography>
                <Typography>ชื่อนิสิต: {booking.studentName}</Typography>
                <Typography>รหัสนิสิต: {booking.studentID}</Typography>
                <Typography>เวลา: {booking.startTime} - {booking.endTime}</Typography>
                <Typography>วัตถุประสงค์: {booking.purpose}</Typography>
                <Typography color="green" sx={{ fontWeight: 'bold' }}>สถานะ: อนุมัติแล้ว</Typography>
              </Paper>
            ))}
          </div>
        ) : (
          <Typography>ไม่มีประวัติการจองที่อนุมัติแล้ว</Typography>
        )}
      </Box>

      <Box mt={3}>
        <Typography variant="h6">ประวัติการจองที่ถูกปฏิเสธ:</Typography>
        {rejectedBookingHistory.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {rejectedBookingHistory.map((booking) => (
              <Paper key={uuidv4()} elevation={4} style={{ padding: '16px', margin: '8px', width: '30%' }}>
                <Typography>ห้อง: {booking.room}</Typography>
                <Typography>วันที่จอง: {moment(booking.date).format('DD MMMM YYYY')}</Typography>
                <Typography>ชื่อนิสิต: {booking.studentName}</Typography>
                <Typography>รหัสนิสิต: {booking.studentID}</Typography>
                <Typography>เวลา: {booking.startTime} - {booking.endTime}</Typography>
                <Typography>วัตถุประสงค์: {booking.purpose}</Typography>
                <Typography color="red" sx={{ fontWeight: 'bold' }}>สถานะ: ถูกปฏิเสธ</Typography>
              </Paper>
            ))}
          </div>
        ) : (
          <Typography>ไม่มีประวัติการจองที่ถูกปฏิเสธ</Typography>
        )}
      </Box>

      <Box mt={3}>
  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>สรุปรายเดือน:</Typography>
  <Paper elevation={4} sx={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
    {/* การจองทั้งหมด */}
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>การจองทั้งหมดในเดือนนี้:</Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>{bookingsThisMonth.length}</Typography>
    </Box>
    <Box mb={2}>
      {bookingsThisMonth.map((booking) => (
        <Typography key={booking._id}>
          {booking.studentName} - ห้อง: {booking.room}, วันที่: {moment(booking.date).format('DD MMMM YYYY')}
        </Typography>
      ))}
    </Box>
    <Divider />

    {/* การจองที่อนุมัติ */}
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" my={2}>
      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4caf50' }}>การจองที่อนุมัติในเดือนนี้:</Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>{approvedThisMonth.length}</Typography>
    </Box>
    <Box mb={2}>
      {approvedThisMonth.map((booking) => (
        <Typography key={booking._id}>
          {booking.studentName} - ห้อง: {booking.room}, วันที่: {moment(booking.date).format('DD MMMM YYYY')}
        </Typography>
      ))}
    </Box>
    <Divider />

    {/* การจองที่ถูกปฏิเสธ */}
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" my={2}>
      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#f44336' }}>การจองที่ถูกปฏิเสธในเดือนนี้:</Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>{rejectedThisMonth.length}</Typography>
    </Box>
    <Box mb={2}>
      {rejectedThisMonth.map((booking) => (
        <Typography key={booking._id}>
          {booking.studentName} - ห้อง: {booking.room}, วันที่: {moment(booking.date).format('DD MMMM YYYY')}
        </Typography>
      ))}
    </Box>
  </Paper>
</Box>


    </div>
  );
};

export default MeetingRoomAM;
