import React, { useEffect, useState } from 'react';
import {
  Grid, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import "./BookingForm.css";

function BookingForm({
  meetingTitle, setMeetingTitle, meetingDate, setMeetingDate, meetingTime, setMeetingTime,
  meetingDuration, setMeetingDuration, selectedRoom, setSelectedRoom, studentID, setStudentID,
  studentName, setStudentName, errorFields, setErrorFields, handleSubmit, handleAdvanceBooking, rooms
}) {
  // ฟังก์ชันตรวจสอบรหัสนักศึกษา
  const validateStudentID = (value) => {
    let error = '';
    if (value.length > 0) {
      if (value.length !== 8) {
        error = 'กรุณากรอกรหัสนักศึกษาให้ครบ 8 หลัก';
      } else if (!/^\d+$/.test(value)) {
        error = 'กรุณากรอกรหัสนักศึกษาเป็นตัวเลขเท่านั้น';
      }
    }
    return error;
  };

  // ตรวจสอบค่าทุกครั้งที่ studentID เปลี่ยนแปลง
  useEffect(() => {
    const error = validateStudentID(studentID);
    setErrorFields((prevErrors) => ({
      ...prevErrors,
      studentID: error
    }));
  }, [studentID, setErrorFields]);

  return (
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
                error={!!errorFields.selectedRoom}
                required
              >
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.name}
                  </MenuItem>
                ))}
              </Select>
              {errorFields.selectedRoom && (
                <Typography variant="caption" color="error">{errorFields.selectedRoom}</Typography>
              )}
            </FormControl>
          </Grid>

          {/* ฟิลด์ชื่อการประชุม */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="ชื่อการประชุม"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              error={!!errorFields.meetingTitle}
              helperText={errorFields.meetingTitle}
              required
            />
          </Grid>

          {/* ฟิลด์รหัสนักศึกษา */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="รหัสนักศึกษา"
              type="text"
              value={studentID}
              onChange={(e) => {
                const value = e.target.value;
                setStudentID(value);
                const error = validateStudentID(value);
                setErrorFields((prevErrors) => ({
                  ...prevErrors,
                  studentID: error
                }));
              }}
              error={!!errorFields.studentID}
              helperText={errorFields.studentID}
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
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </Grid>

          {/* ฟิลด์วันที่ประชุม */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="วันที่ประชุม"
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              error={!!errorFields.meetingDate}
              helperText={errorFields.meetingDate}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* ฟิลด์เวลาเริ่มประชุม */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="เวลาเริ่มประชุม"
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              error={!!errorFields.meetingTime}
              helperText={errorFields.meetingTime}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* ฟิลด์ระยะเวลาการประชุม */}
          <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel>ระยะเวลาการประชุม (นาที)</InputLabel>
            <Select
              value={meetingDuration}
              onChange={(e) => setMeetingDuration(e.target.value)}
              required
            >
              <MenuItem value={30}>30 นาที</MenuItem>
              <MenuItem value={60}>60 นาที</MenuItem>
              <MenuItem value={90}>90 นาที</MenuItem>
            </Select>
          </FormControl>
        </Grid>

          {/* ปุ่มยืนยันการจอง */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              ยืนยันการจอง
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleAdvanceBooking}
              style={{ marginLeft: '8px' }}
            >
              จองล่วงหน้า
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default BookingForm;
