import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import ConfirmButton from './ConfirmButton'; 
import FormTextField from './FormTextField';

interface SelectionProps {
  selectedData: {
    date: string;
    duration: number;
  };
  onUpdateFormData: (data: { roomName: string; name: string; date: string; duration: number }) => void; 
  receiveDataFromEventModal: (data: { roomName: string; name: string; date: string; duration: number }) => void; // เพิ่มที่นี่
}

const Selection: React.FC<SelectionProps> = ({ selectedData, onUpdateFormData, receiveDataFromEventModal }) => {
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

  // ฟังก์ชันสำหรับรับข้อมูลจาก EventModal
  const handleReceiveDataFromEventModal = (data: { roomName: string; name: string; date: string; duration: number }) => {
    console.log('Received Data from EventModal:', data); // เพิ่ม log ที่นี่
    setFormData((prevData) => ({
      ...prevData,
      roomName: data.roomName,
      name: data.name,
      date: data.date,
      duration: data.duration.toString(),
    }));
  };

  // อัพเดตข้อมูลฟอร์มเมื่อ selectedData เปลี่ยน
  useEffect(() => {
    if (selectedData) {
      setFormData((prevData) => ({
        ...prevData,
        date: selectedData.date || prevData.date,
        duration: selectedData.duration ? selectedData.duration.toString() : prevData.duration,
      }));
  
      // เรียกใช้ receiveDataFromEventModal เพื่อกรอกข้อมูลในฟอร์ม
      handleReceiveDataFromEventModal({
        roomName: formData.roomName, // หรือใส่ค่าจาก props ถ้ามี
        name: formData.name,          // หรือใส่ค่าจาก props ถ้ามี
        date: selectedData.date,
        duration: selectedData.duration,
      });
    }
  }, [selectedData]);

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของฟิลด์ในฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  // ฟังก์ชันสำหรับตรวจสอบความถูกต้องของข้อมูลและยืนยัน
  const handleConfirm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    let isValid = true;

    // ฟิลด์ที่ต้องตรวจสอบความถูกต้อง
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

    // ตรวจสอบแต่ละฟิลด์
    fieldsToValidate.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'กรุณากรอกข้อมูล'; // ถ้าไม่กรอกข้อมูลจะมีข้อความแจ้งเตือน
        isValid = false;
      }
    });

    if (isValid) {
      console.log('Confirmed Data:', formData);

      // เตรียมข้อมูลสำหรับส่ง
      const dataToSubmit = {
        roomName: formData.roomName,
        name: formData.name,
        date: formData.date,
        duration: Number(formData.duration), // แปลงระยะเวลาเป็นตัวเลข
      };
      
      // ส่งข้อมูลไปยังคอมโพเนนต์แม่
      onUpdateFormData(dataToSubmit);

      // เรียกใช้ receiveDataFromEventModal เพื่อกรอกข้อมูลในฟอร์ม
      receiveDataFromEventModal(dataToSubmit);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="w-full h-[850px] bg-gray-300 flex justify-center items-center rounded-lg p-3">
      <div className="flex w-full h-full">
        <div className="flex-[5] bg-green-500 mr-2 flex">
          <div className="flex-[3.5] bg-green-600 flex justify-center items-center text-white font-bold rounded-lg m-2"></div>
          <div className="flex-[1.5] bg-[#996610] flex flex-col p-4 rounded-lg m-2">
            <Typography variant="h6" className="text-white mb-4 p-2">แบบฟอร์มจองห้องประชุม</Typography>

            <FormTextField 
              label="ชื่อห้องประชุม"
              name="roomName"
              value={formData.roomName}
              onChange={handleChange}
              error={!!errors.roomName}
              helperText={errors.roomName}
            />

            <FormTextField 
              label="รหัสนิสิต"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              error={!!errors.studentId}
              helperText={errors.studentId}
            />

            <FormTextField 
              label="ชื่อผู้จอง"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />

            <FormTextField 
              label="อีเมลหรือเบอร์โทรศัพท์"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              error={!!errors.contact}
              helperText={errors.contact}
            />

            <FormTextField 
              label="วันที่"
              name="date"
              value={formData.date}
              onChange={handleChange}
              error={!!errors.date}
              helperText={errors.date}
              type="date" 
            />

            <FormTextField 
              label="ระยะเวลา (นาที)"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              error={!!errors.duration}
              helperText={errors.duration}
              select
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
            />

            <ConfirmButton formData={formData} onConfirm={handleConfirm} /> 
          </div>
        </div>

        <div className="flex-[2] bg-blue-500 flex justify-center items-center text-white font-bold rounded-lg">
          กล่องขวา (2 ส่วน)
        </div>
      </div>
    </div>
  );
};

export default Selection;
