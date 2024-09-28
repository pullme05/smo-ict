import { useState } from 'react';

interface FormData {
  meetingRoom: string;
  name: string;
  studentId: string;
  contact: string;
  date: string;
  duration: string;
  roomName: string;
  purpose: string;
}

const useFormValidation = (initialData: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.meetingRoom) newErrors.meetingRoom = 'กรุณาเลือกห้องประชุม';
    if (!formData.name) newErrors.name = 'กรุณากรอกชื่อ';
    if (!formData.studentId) newErrors.studentId = 'กรุณากรอกรหัสนิสิต';
    if (!formData.contact) newErrors.contact = 'กรุณากรอกเบอร์ที่ใช้ในการติดต่อ';
    if (!formData.date) newErrors.date = 'กรุณาเลือกวันที่';
    if (!formData.duration) newErrors.duration = 'กรุณาเลือกระยะเวลา';
    if (!formData.roomName) newErrors.roomName = 'กรุณากรอกชื่อหัวข้อประชุม';
    if (!formData.purpose) newErrors.purpose = 'กรุณากรอกวัตถุประสงค์';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // คืนค่า true ถ้าไม่มีข้อผิดพลาด
  };

  // ฟังก์ชันสำหรับตรวจสอบรหัสนิสิต
  const validateStudentId = (value: string): string | null => {
    const newErrors = { ...errors };
    if (!/^\d{1,8}$/.test(value)) {
      newErrors.studentId = 'รหัสนิสิตต้องเป็นตัวเลขไม่เกิน 8 ตัว';
      setErrors(newErrors); // อัปเดตข้อผิดพลาด
      return newErrors.studentId; // คืนค่าข้อผิดพลาด
    } else {
      delete newErrors.studentId;
      setErrors(newErrors); // อัปเดตข้อผิดพลาด
      return null; // คืนค่า null ถ้าไม่มีข้อผิดพลาด
    }
  };

  // ฟังก์ชันสำหรับตรวจสอบเบอร์โทร
  const validateContact = (value: string): string | null => {
    const newErrors = { ...errors };
    if (!/^\d{1,10}$/.test(value)) {
      newErrors.contact = 'เบอร์โทรต้องเป็นตัวเลขไม่เกิน 10 ตัว';
      setErrors(newErrors); // อัปเดตข้อผิดพลาด
      return newErrors.contact; // คืนค่าข้อผิดพลาด
    } else {
      delete newErrors.contact;
      setErrors(newErrors); // อัปเดตข้อผิดพลาด
      return null; // คืนค่า null ถ้าไม่มีข้อผิดพลาด
    }
  };

  return {
    formData,
    setFormData,
    errors,
    validateForm,
    validateStudentId, // ส่งออกฟังก์ชัน validateStudentId
    validateContact,    // ส่งออกฟังก์ชัน validateContact
  };
};

export default useFormValidation;
