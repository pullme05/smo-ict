import React, { useState } from 'react';
import Timetable from './CalenTable/Timetable';

interface RoomsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Rooms: React.FC<RoomsProps> = ({ isOpen, onClose }) => {
  const [selectedData, setSelectedData] = useState<{ date: string, duration: number } | null>(null);

  if (!isOpen) return null;

  // ฟังก์ชันสำหรับอัปเดตข้อมูลที่เลือกจาก Timetable
  const handleSelectionUpdate = (data: { date: string, duration: number }) => {
    setSelectedData(data);
    console.log('Selected Data from Timetable:', data); // คุณสามารถส่งข้อมูลนี้ไปยัง Selection component ได้
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center mt-5 z-50">
      <div className="bg-white p-4 rounded-lg w-[2000px] h-[1000px] ">
        <div className="mb-4">
          <div className="h-10 bg-blue-200 flex justify-end items-center">
            <button onClick={onClose} className="bg-blue-500 text-white px-4 py-1 rounded mr-1">
              Close
            </button>
          </div>
        </div>
        <div>
          <div className="h-[910px] bg-green-200 flex justify-center items-center">
            <Timetable updateSelectionData={handleSelectionUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
