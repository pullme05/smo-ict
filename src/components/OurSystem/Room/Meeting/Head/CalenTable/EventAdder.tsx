import React, { useState } from 'react';

interface EventAdderProps {
  date: Date; // วันที่เราจะเพิ่ม event
  onAddEvent: (date: Date, title: string) => void; // ฟังก์ชันที่ใช้เพิ่ม event
}

const EventAdder: React.FC<EventAdderProps> = ({ date, onAddEvent }) => {
  const [eventTitle, setEventTitle] = useState<string>(''); // สถานะเก็บชื่อ event

  const handleAddEvent = () => {
    if (eventTitle.trim()) { // ตรวจสอบว่าชื่อ event ไม่ว่างเปล่า
      onAddEvent(date, eventTitle); // เรียกฟังก์ชันเพื่อเพิ่ม event
      setEventTitle(''); // เคลียร์ฟิลด์ชื่อ event
    } else {
      alert('กรุณากรอกชื่อ event'); // แสดงข้อความเตือนหากชื่อ event ว่าง
    }
  };

  return (
    <div className="flex flex-col items-start mb-2">
      <input
        type="text"
        value={eventTitle}
        onChange={(e) => setEventTitle(e.target.value)} // อัปเดตสถานะชื่อ event
        placeholder="กรุณากรอกชื่อ event"
        className="border p-2 rounded mb-1"
      />
      <button
        onClick={handleAddEvent}
        className="bg-blue-500 text-white p-2 rounded"
      >
        เพิ่ม Event
      </button>
    </div>
  );
};

export default EventAdder;