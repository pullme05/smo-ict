import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const AdvanceBookingDialog = ({ open, onClose, data, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>ยืนยันการจองล่วงหน้า</DialogTitle>
      <DialogContent>
        <Typography variant="body1">ห้องประชุม: {data?.selectedRoom}</Typography>
        <Typography variant="body1">วันที่: {data?.meetingDate}</Typography>
        <Typography variant="body1">เวลา: {data?.meetingTime}</Typography>
        <Typography variant="body1">ระยะเวลา: {data?.meetingDuration} นาที</Typography>
        <Typography variant="body1">รหัสนักศึกษา: {data?.studentID}</Typography>
        <Typography variant="body1">ชื่อผู้จอง: {data?.studentName}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">ยกเลิก</Button>
        <Button onClick={onConfirm} color="primary">ยืนยัน</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvanceBookingDialog;
