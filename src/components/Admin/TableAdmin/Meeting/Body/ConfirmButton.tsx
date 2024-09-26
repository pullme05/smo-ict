// ConfirmButton.tsx
import React from 'react';

// กำหนด type ของ props
interface ConfirmButtonProps {
  formData: {
    name: string;
    studentId: string;
    contact: string;
    date: string;
    duration: string;
    roomName: string;
    participants: string; // ถ้าต้องการเป็น number ให้เปลี่ยนเป็น number
    purpose: string;
    notes: string;
  };
  onConfirm: () => void;
}

// สร้างคอมโพเนนต์ ConfirmButton
const ConfirmButton: React.FC<ConfirmButtonProps> = ({ formData, onConfirm }) => {
  const handleClick = () => {
    // แสดงข้อมูลที่ถูกกรอกใน console
    console.log('ข้อมูลที่ถูกกรอก:', formData);
    onConfirm(); // เรียกฟังก์ชัน onConfirm
  };

  return (
    <button onClick={handleClick} className="mt-4 bg-blue-500 text-white p-2 rounded">
      ยืนยันการจอง
    </button>
  );
};

// ส่งออกคอมโพเนนต์ ConfirmButton
export default ConfirmButton;
