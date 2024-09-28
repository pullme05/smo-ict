import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, TextField, Button, Grid, MenuItem } from '@mui/material';

// ประกาศประเภท props สำหรับ TextFieldComponent
interface TextFieldComponentProps {
  formData: {
    meetingRoom: string;
    name: string;
    studentId: string;
    contact: string;
    date: string;
    duration: string; // ต้องเป็น string ตามที่คุณได้เปลี่ยนใน EventModal
    roomName: string;
    purpose: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
  errors: { [key: string]: string }; // เพิ่ม errors
  validateStudentId: (id: string) => string | null; // ฟังก์ชันตรวจสอบรหัสนิสิต
  validateContact: (contact: string) => string | null; // ฟังก์ชันตรวจสอบเบอร์โทร
}

// ฟังก์ชันหลักของ TextFieldComponent
const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  errors,
  validateStudentId,
  validateContact,
}) => {
  useEffect(() => {
    // ตรวจสอบรหัสนิสิตเมื่อมีการเปลี่ยนแปลง
    const studentIdError = validateStudentId(formData.studentId);
    if (studentIdError) {
      errors.studentId = studentIdError;
    } else {
      delete errors.studentId; // ลบข้อผิดพลาดถ้าไม่มี
    }
  }, [formData.studentId]); // เรียกใช้เมื่อ studentId เปลี่ยนแปลง

  useEffect(() => {
    // ตรวจสอบเบอร์โทรเมื่อมีการเปลี่ยนแปลง
    const contactError = validateContact(formData.contact);
    if (contactError) {
      errors.contact = contactError;
    } else {
      delete errors.contact; // ลบข้อผิดพลาดถ้าไม่มี
    }
  }, [formData.contact]); // เรียกใช้เมื่อ contact เปลี่ยนแปลง

  return (
    <Card variant="outlined" style={{ maxWidth: 500, margin: '5px auto', padding: '5px' }}>
      <CardHeader title="แบบฟอร์มการจองห้องประชุม" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="ห้องประชุม"
              name="meetingRoom"
              value={formData.meetingRoom}
              onChange={onChange}
              select
              fullWidth
              variant="outlined"
              required
              error={!!errors.meetingRoom} // แสดงข้อผิดพลาดถ้ามี
              helperText={errors.meetingRoom} // ข้อความข้อผิดพลาด
            >
              <MenuItem value="A">ห้อง A</MenuItem>
              <MenuItem value="B">ห้อง B</MenuItem>
              <MenuItem value="C">ห้อง C</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="ชื่อหัวข้อประชุม"
              name="roomName"
              value={formData.roomName}
              onChange={onChange}
              fullWidth
              variant="outlined"
              required
              error={!!errors.roomName}
              helperText={errors.roomName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="ชื่อ"
              name="name"
              value={formData.name}
              onChange={onChange}
              fullWidth
              variant="outlined"
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="รหัสนิสิต"
              name="studentId"
              value={formData.studentId}
              onChange={(e) => {
                onChange(e); // ใช้ onChange ที่ส่งเข้ามา
                validateStudentId(e.target.value); // เรียกใช้ validateStudentId
              }}
              fullWidth
              variant="outlined"
              required
              error={!!errors.studentId}
              helperText={errors.studentId}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="เบอร์ที่ใช้ในการติดต่อ"
              name="contact"
              value={formData.contact}
              onChange={(e) => {
                onChange(e); // ใช้ onChange ที่ส่งเข้ามา
                validateContact(e.target.value); // เรียกใช้ validateContact
              }}
              fullWidth
              variant="outlined"
              required
              error={!!errors.contact}
              helperText={errors.contact}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="วันที่"
              name="date"
              type="date"
              value={formData.date}
              onChange={onChange}
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.date}
              helperText={errors.date}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="ระยะเวลา (นาที)"
              name="duration"
              value={formData.duration}
              onChange={onChange}
              select
              fullWidth
              variant="outlined"
              required
              error={!!errors.duration}
              helperText={errors.duration}
            >
              <MenuItem value="30">30 นาที</MenuItem>
              <MenuItem value="60">1 ชั่วโมง</MenuItem>
              <MenuItem value="90">1 ชั่วโมง 30 นาที</MenuItem>
              <MenuItem value="120">2 ชั่วโมง</MenuItem>
              <MenuItem value="150">2 ชั่วโมง 30 นาที</MenuItem>
              <MenuItem value="180">3 ชั่วโมง</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="วัตถุประสงค์"
              name="purpose"
              value={formData.purpose}
              onChange={onChange}
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              required
              error={!!errors.purpose}
              helperText={errors.purpose}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={onSubmit}>
              ส่งข้อมูล
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose} style={{ marginLeft: '10px' }}>
              ยกเลิก
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TextFieldComponent;
