import React from 'react';

interface EventModalProps {
  formData: {
    roomName: string;
    name: string; // ชื่อผู้จอง
    date: string; // วันที่
    duration: number; // ระยะเวลา (ในนาที)
  };
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => void; 
  onSubmit: (data: { roomName: string; name: string; date: string; duration: number; }) => void;
  receiveDataFromEventModal: (data: { roomName: string; name: string; date: string; duration: number }) => void; // เพิ่มที่นี่
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ formData, onChange, onSubmit, receiveDataFromEventModal, onClose }) => {
  const validateForm = () => {
    const { roomName, name, date, duration } = formData;
    if (!roomName || !name || !date || !duration) {
      alert('กรุณากรอกข้อมูลให้ครบทุกฟิลด์');
      return false; 
    }
    return true; 
  };

  const handleSubmit = () => {
  // รับข้อมูลที่กรอกจากฟอร์มใน EventModal
  const { roomName, name, date, duration } = formData;

  // ตรวจสอบความถูกต้องก่อนส่งข้อมูล
  if (!validateForm()) return; // ถ้าข้อมูลไม่ถูกต้องจะไม่ส่งข้อมูล

  const dataToSubmit = {
    roomName,
    name,
    date,
    duration,
  };

  // เรียกใช้ callback ที่ส่งจาก Timetable เพื่อนำข้อมูลไปกรอกใน Selection
  receiveDataFromEventModal(dataToSubmit);
  
  // เรียกใช้ onSubmit เพื่อส่งข้อมูล
  onSubmit(dataToSubmit); // เรียกใช้ฟังก์ชันนี้

  // ปิดโมดัล
  onClose();
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 z-60">
        <h2 className="text-lg font-bold mb-4">กรอกข้อมูลการจอง</h2>
        <form>
          <label className="block mb-2">
            ชื่อห้องประชุม:
            <input
              type="text"
              name="roomName"
              value={formData.roomName}
              onChange={onChange}
              required
              className="block w-full border border-gray-300 rounded p-2 mt-1"
            />
          </label>
          <label className="block mb-2">
            ชื่อผู้จอง:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              className="block w-full border border-gray-300 rounded p-2 mt-1"
            />
          </label>
          <label className="block mb-2">
            วัน/เดือน/ปี:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={onChange}
              required
              className="block w-full border border-gray-300 rounded p-2 mt-1"
            />
          </label>
          <label className="block mb-2">
            ระยะเวลา:
            <select
              name="duration"
              value={formData.duration}
              onChange={onChange}
              required
              className="block w-full border border-gray-300 rounded p-2 mt-1"
            >
              <option value={30}>30 นาที</option>
              <option value={60}>1 ชั่วโมง</option>
              <option value={90}>1 ชั่วโมง 30 นาที</option>
              <option value={120}>2 ชั่วโมง</option>
              <option value={150}>2 ชั่วโมง 30 นาที</option>
              <option value={180}>3 ชั่วโมง</option>
            </select>
          </label>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleSubmit} // เรียกใช้ handleSubmit
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ส่งข้อมูล
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              ปิด
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
