import React, { useState, useEffect } from 'react';
import AdminApprove from './AdminApprove';
import UserApprove from './UserApprove';
import EventModal from '../../Head/CalenTable/EventModal';

// กำหนดประเภทสำหรับข้อมูลฟอร์ม
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

// กำหนดประเภทสำหรับ props
interface FormDataDisplayProps {
  data: FormData | null; // รองรับการเป็น null
}

const FormDataDisplay: React.FC<FormDataDisplayProps> = ({ data }) => {
  const [formDataState, setFormDataState] = useState<FormData | null>(data);

  // ฟังก์ชันนี้ใช้สำหรับการเปลี่ยนแปลงข้อมูลฟอร์ม
  const handleFormDataChange = (newData: FormData) => {
    console.log("FormDataDisplay - Form data changed:", newData);
    setFormDataState(newData); // อัปเดต state เมื่อข้อมูลเปลี่ยน
  };

  // ฟังก์ชันนี้ใช้สำหรับการส่งข้อมูลฟอร์ม
  const handleFormDataSubmit = () => {
    if (formDataState) {
      console.log("Submitting formData:", formDataState);
      // ทำการส่งข้อมูลไปยังเซิร์ฟเวอร์หรือทำอย่างอื่นได้ที่นี่
    }
  };

  // useEffect นี้จะทำงานเมื่อ data เปลี่ยนแปลง
  useEffect(() => {
    setFormDataState(data);
  }, [data]);

  if (!formDataState) {
    return <div>No data available</div>; // จัดการกรณีไม่มีข้อมูล
  }

  return (
    <div>
      <h2>ข้อมูลการจอง</h2>
      {/* เรียกใช้ EventModal โดยส่ง formDataState และฟังก์ชันที่ต้องการ */}
      <EventModal 
        formData={formDataState} 
        onChange={handleFormDataChange} // ส่งฟังก์ชันเพื่อจัดการการเปลี่ยนแปลง
        onSubmit={handleFormDataSubmit} // ส่งฟังก์ชันเพื่อจัดการการส่งข้อมูล
        onClose={() => console.log("Modal closed")} // ฟังก์ชันสำหรับปิด Modal
        errors={{}} // ส่ง errors ที่จำเป็น
      />
      {/* แสดงคอมโพเนนต์ AdminApprove และ UserApprove */}
      <AdminApprove formData={formDataState} />
      <UserApprove formData={formDataState} />
    </div>
  );
};

export default FormDataDisplay;
