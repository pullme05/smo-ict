import React, { useState } from 'react';
import { TextField, MenuItem, Typography, Button } from '@mui/material';

const BigBox: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    contact: '',
    date: '',
    duration: '',
    roomName: '',
    participants: 0,
    purpose: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // ที่นี่คุณสามารถเพิ่มการจัดการการส่งฟอร์มหรือทำอะไรตามต้องการ
    console.log("Form Data Submitted:", formData);
    // เพิ่มโค้ดสำหรับยืนยันการจอง
  };

  const textFieldProps = {
    variant: 'outlined' as 'outlined',
    fullWidth: true,
    InputLabelProps: {
      style: { color: 'white' }
    },
    InputProps: {
      className: 'mb-1'
    }
  };

  return (
    <div className="w-full h-[830px] bg-gray-300 flex justify-center items-center rounded-lg p-3">
      <div className="flex w-full h-full">
        <div className="flex-[5] bg-green-500 mr-2 flex">
          <div className="flex-[3.5] bg-green-600 flex justify-center items-center text-white font-bold rounded-lg m-2">
            {/* อาจจะใส่เนื้อหาเพิ่มเติมที่นี่ */}
          </div>
          <div className="flex-[1.5] bg-[#996610] flex flex-col p-4 rounded-lg m-2">
            <Typography variant="h6" className="text-white mb-4 p-2">แบบฟอร์มจองห้องประชุม</Typography>

            <TextField
              label="ชื่อห้องประชุม"
              name="roomName"
              value={formData.roomName}
              onChange={handleChange}
              {...textFieldProps}
            />

            <TextField
              label="รหัสนิสิต"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              {...textFieldProps}
            />

            <TextField
              label="ชื่อผู้จอง"
              name="name"
              value={formData.name}
              onChange={handleChange}
              {...textFieldProps}
            />

            <TextField
              label="อีเมลหรือเบอร์โทรศัพท์"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              {...textFieldProps}
            />

            <TextField
              label="วันที่"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              {...textFieldProps}
            />

            <TextField
              label="ระยะเวลา (นาที)"
              select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              {...textFieldProps}
            >
              <MenuItem value={30}>30 นาที</MenuItem>
              <MenuItem value={60}>60 นาที</MenuItem>
              <MenuItem value={90}>90 นาที</MenuItem>
            </TextField>

            <TextField
              label="จำนวนผู้เข้าร่วม"
              type="number"
              name="participants"
              value={formData.participants}
              onChange={handleChange}
              {...textFieldProps}
            />

            <TextField
              label="วัตถุประสงค์ของการประชุม"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              multiline
              rows={4}
              {...textFieldProps}
            />

            <TextField
              label="หมายเหตุเพิ่มเติม"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={4}
              {...textFieldProps}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className="mt-4" // เพิ่ม margin ด้านบน
            >
              ยืนยันการจอง
            </Button>
          </div>
        </div>
        <div className="flex-[2] bg-blue-500 flex justify-center items-center text-white font-bold rounded-lg">
          กล่องขวา (2 ส่วน)
        </div>
      </div>
    </div>
  );
};

export default BigBox;
