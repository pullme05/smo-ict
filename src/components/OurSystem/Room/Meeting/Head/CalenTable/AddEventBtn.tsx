import React from 'react';
import { Event as EventType } from './types'; // นำเข้า Event จาก types.ts

interface AddEventBtnProps {
  setEvents: React.Dispatch<React.SetStateAction<EventType[]>>;  // ใช้ EventType ที่นำเข้า
}

const AddEventBtn: React.FC<AddEventBtnProps> = ({ setEvents }) => {
  const handleAddEvent = () => {
    const newEvent: EventType = {
      title: 'เหตุการณ์ใหม่',
      start: new Date(),
      end: new Date(),
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <button
      onClick={handleAddEvent}
      className="mb-4 bg-green-500 text-white p-2 rounded"
    >
      เพิ่มเหตุการณ์
    </button>
  );
};

export default AddEventBtn;
