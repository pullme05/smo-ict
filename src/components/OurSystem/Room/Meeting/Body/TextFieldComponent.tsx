import React, { useState, useEffect } from 'react';
import FormTextField from './FormTextField';
import { Typography } from '@mui/material'; // เพิ่มการนำเข้า Typography

interface TextFieldComponentProps {
  selectedData: {
    roomName: string;
    date: string;
    duration: number;
    name: string; // 
  };
  onUpdateFormData: (data: { roomName: string; name: string; date: string; duration: number }) => void; 
  receiveDataFromEventModal: (data: { roomName: string; name: string; date: string; duration: number }) => void; 
  updateSelectionData: (data: { roomName: string; name: string; date: string; duration: number }) => void;
}


const TextFieldComponent: React.FC<TextFieldComponentProps> = ({ selectedData, onUpdateFormData, receiveDataFromEventModal, updateSelectionData }) => {
  // สร้างสถานะสำหรับข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    contact: '',
    date: '',
    duration: '',
    roomName: '',
    participants: '',
    purpose: '',
    notes: '',
  });

  // สร้างสถานะสำหรับเก็บข้อผิดพลาด
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  // อัพเดตข้อมูลฟอร์มเมื่อ selectedData เปลี่ยน
  useEffect(() => {
    if (selectedData) {
      // อัปเดต formData โดยรับค่าจาก selectedData
      setFormData((prevData) => ({
        ...prevData,
        roomName: selectedData.roomName || prevData.roomName,
        date: selectedData.date || prevData.date,
        duration: selectedData.duration.toString() || prevData.duration,
        name: selectedData.name || prevData.name, // ตรวจสอบให้แน่ใจว่ามีการอัปเดต name ด้วย
      }));
  
      // ส่งข้อมูลที่อัปเดตกลับไปที่ EventModal
      receiveDataFromEventModal({
        roomName: selectedData.roomName,
        name: selectedData.name, // ส่ง name ที่อัปเดตไปให้ EventModal
        date: selectedData.date,
        duration: selectedData.duration,
      });
    }
  }, [selectedData, receiveDataFromEventModal]);
  

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของฟิลด์ในฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  // ฟังก์ชันสำหรับตรวจสอบความถูกต้องของข้อมูลและยืนยัน
  const handleConfirm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    let isValid = true;

    const fieldsToValidate: (keyof typeof formData)[] = [
      'name',
      'studentId',
      'contact',
      'date',
      'duration',
      'roomName',
      'participants',
      'purpose',
    ];

    fieldsToValidate.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'กรุณากรอกข้อมูล';
        isValid = false;
      }
    });

    if (isValid) {
      console.log('Confirmed Data:', formData);

      const dataToSubmit = {
        roomName: formData.roomName,
        name: formData.name,
        date: formData.date,
        duration: Number(formData.duration),
      };
      
      onUpdateFormData(dataToSubmit);
      updateSelectionData(dataToSubmit);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="w-[350px] flex-[1.5] bg-[#996610] flex flex-col p-4 rounded-lg m-2">
      <Typography variant="h6" className="text-white mb-4 p-2">แบบฟอร์มจองห้องประชุม</Typography>
      
      <FormTextField 
        label="ชื่อห้องประชุม"
        name="roomName"
        value={formData.roomName}
        onChange={handleChange}
        error={!!errors.roomName}
        helperText={errors.roomName}
        sx={{ padding: '5px' }}
      />

      <FormTextField 
        label="รหัสนิสิต"
        name="studentId"
        value={formData.studentId}
        onChange={handleChange}
        error={!!errors.studentId}
        helperText={errors.studentId}
        sx={{ padding: '5px' }}
      />

      <FormTextField 
        label="ชื่อผู้จอง"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        sx={{ padding: '5px' }}
      />

      <FormTextField 
        label="อีเมลหรือเบอร์โทรศัพท์"
        name="contact"
        value={formData.contact}
        onChange={handleChange}
        error={!!errors.contact}
        helperText={errors.contact}
        sx={{ padding: '5px' }}
      />

      <FormTextField 
        label="วันที่"
        name="date"
        value={formData.date}
        onChange={handleChange}
        error={!!errors.date}
        helperText={errors.date}
        type="date" 
        sx={{ padding: '5px' }}
      />

      <FormTextField 
        label="ระยะเวลา (นาที)"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        error={!!errors.duration}
        helperText={errors.duration}
        select
        sx={{ padding: '5px' }}
        options={[
          { value: 30, label: '30 นาที' },
          { value: 60, label: '1 ชั่วโมง' },
          { value: 90, label: '1 ชั่วโมง 30 นาที' },
          { value: 120, label: '2 ชั่วโมง' },
          { value: 150, label: '2 ชั่วโมง 30 นาที' },
          { value: 180, label: '3 ชั่วโมง' },
          
        ]}
      />

      <FormTextField 
        label="จำนวนผู้เข้าร่วม"
        name="participants"
        value={formData.participants}
        onChange={handleChange}
        error={!!errors.participants}
        helperText={errors.participants}
        type="number"
        sx={{ padding: '5px' }}
      />

      <FormTextField 
        label="วัตถุประสงค์ของการประชุม"
        name="purpose"
        value={formData.purpose}
        onChange={handleChange}
        error={!!errors.purpose}
        helperText={errors.purpose}
        multiline
        rows={4}
        sx={{ padding: '5px' }}
      />

      <FormTextField 
        label="หมายเหตุเพิ่มเติม"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        error={!!errors.notes}
        helperText={errors.notes}
        multiline
        rows={4}
        sx={{ padding: '5px' }}
      />

      <button onClick={handleConfirm} className="bg-blue-500 m-1 text-white p-2 rounded">ยืนยัน</button>

    </div>
  );
};

export default TextFieldComponent;
