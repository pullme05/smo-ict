// Import ส่วนประกอบที่จำเป็น
import React, { useState } from 'react';
import { Typography } from '@mui/material';
import ConfirmButton from './ConfirmButton'; // Import ส่วน ConfirmButton
import FormTextField from './FormTextField';

// สร้างคอมโพเนนต์หลัก
const Selection: React.FC = () => {
  // สร้าง state เพื่อเก็บข้อมูลจากแบบฟอร์ม
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

  // กำหนด type ของ errors
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของข้อมูลแบบฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value // อัปเดตค่าของฟิลด์ที่ถูกแก้ไข
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  // ฟังก์ชันสำหรับจัดการเมื่อกดปุ่มยืนยัน
  const handleConfirm = () => {
    // สร้างวัตถุสำหรับเก็บข้อผิดพลาดใหม่
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    let isValid = true;
  
    // ฟิลด์ที่ต้องการตรวจสอบ
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
  
    // ตรวจสอบความถูกต้องของข้อมูลในฟิลด์
    fieldsToValidate.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'กรุณากรอกข้อมูล'; // ถ้าไม่มีข้อมูลให้ใส่ข้อความข้อผิดพลาด
        isValid = false; // ตั้งค่า isValid เป็น false
      }
    });
    // ถ้าฟอร์มถูกต้อง ให้ดำเนินการต่อ
    if (isValid) {
      console.log('Confirmed Data:', formData);
      // สามารถทำการประมวลผลเพิ่มเติม หรือส่งข้อมูลไปยัง backend ได้ที่นี่
    } else {
      setErrors(newErrors); // ถ้าไม่ถูกต้อง ให้ตั้งค่า errors
    }
  };

  return (
    // กล่องหลักที่มีความสูง 850px และพื้นหลังสีเทา
    <div className="w-full h-[850px] bg-gray-300 flex justify-center items-center rounded-lg p-3">
      <div className="flex w-full h-full">

        {/* กล่องซ้าย */}
        <div className="flex-[5] bg-green-500 mr-2 flex">

          {/* กล่องย่อยซ้าย (ส่วนที่ 1) */}
          <div className="flex-[3.5] bg-green-600 flex justify-center items-center text-white font-bold rounded-lg m-2"></div>

          {/* กล่องย่อยซ้าย (ส่วนที่ 2) สำหรับแบบฟอร์ม */}
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
              type="date" // กำหนดให้เป็นประเภทวันที่
            />

            <FormTextField 
              label="ระยะเวลา (นาที)"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              error={!!errors.duration}
              helperText={errors.duration}
              select // ใช้ select
              options={[
                { value: 30, label: '30 นาที' },
                { value: 60, label: '60 นาที' },
                { value: 90, label: '90 นาที' },
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

            {/* ปุ่มยืนยันการจอง */}
            <ConfirmButton formData={formData} onConfirm={handleConfirm} />
          </div>
        </div>

        {/* กล่องขวา */}
        <div className="flex-[2] bg-blue-500 flex justify-center items-center text-white font-bold rounded-lg">
          กล่องขวา (2 ส่วน)
        </div>
      </div>
    </div>
  );
};

// ส่งออกคอมโพเนนต์ Selection
export default Selection;
