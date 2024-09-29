import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, TextField, Button, Grid, MenuItem } from '@mui/material';

// ประกาศประเภท props สำหรับ TextFieldComponent
interface TextFieldComponentProps {
  formData: {
    meetingRoom: string;
    name: string;
    studentId: string;
    contact: string;
    date: string; // รูปแบบวันที่
    duration: string; 
    roomName: string;
    purpose: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void; // การส่งข้อมูล
  onClose: () => void;
  errors: { [key: string]: string }; 
  validateStudentId: (id: string) => string | null; 
  validateContact: (contact: string) => string | null; 
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
    const studentIdError = validateStudentId(formData.studentId);
    if (studentIdError) {
      errors.studentId = studentIdError;
    } else {
      delete errors.studentId; 
    }
  }, [formData.studentId]); 

  useEffect(() => {
    const contactError = validateContact(formData.contact);
    if (contactError) {
      errors.contact = contactError;
    } else {
      delete errors.contact; 
    }
  }, [formData.contact]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'date') {
        // แปลงวันที่ที่ได้มาเป็น Local Date ที่ถูกต้อง
        const selectedDate = new Date(value);
        const localDate = new Date(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000);
        const formattedDate = localDate.toISOString().split('T')[0]; // เก็บเป็นวันที่ในรูปแบบ 'YYYY-MM-DD'

        // ใช้ onChange ที่ส่งเข้ามาเพื่ออัปเดต formData
        onChange({ target: { name, value: formattedDate } } as React.ChangeEvent<HTMLInputElement>);
    } else {
        // สำหรับฟิลด์อื่น ๆ
        onChange(e); 
    }
};


  // ฟังก์ชันที่เรียกเมื่อมีการส่งข้อมูล
  const handleSubmit = () => {
    // แสดงข้อมูลวันที่ใน console
    console.log('Selected Date:', formData.date); // Log วันที่ที่ถูกเลือก
    onSubmit(); // เรียกฟังก์ชัน onSubmit ที่ถูกส่งมา
  };

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
              onChange={handleChange}
              select
              fullWidth
              variant="outlined"
              required
              error={!!errors.meetingRoom} 
              helperText={errors.meetingRoom} 
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
              onChange={handleChange}
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
              onChange={handleChange}
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
                handleChange(e); 
                validateStudentId(e.target.value); 
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
                handleChange(e); 
                validateContact(e.target.value); 
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
              onChange={handleChange} 
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
              onChange={handleChange}
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
              onChange={handleChange}
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
            <Button variant="contained" color="primary" onClick={handleSubmit}>
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
