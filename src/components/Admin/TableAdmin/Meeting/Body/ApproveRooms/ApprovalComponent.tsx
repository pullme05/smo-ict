import React, { useState } from 'react';

// สร้าง interface สำหรับข้อมูลการจอง
interface BookingData {
  id: number;
  roomName: string;
  name: string;
  studentId: string;
  contact: string;
  date: string;
  duration: number;
  participants: string;
  purpose: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
}

// สร้าง interface สำหรับ props ของ ApprovalComponent
interface ApprovalComponentProps {
  bookings: BookingData[];
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
}

// สร้าง ApprovalComponent
const ApprovalComponent: React.FC<ApprovalComponentProps> = ({ bookings, onApprove, onReject }) => {
  const [rejectReason, setRejectReason] = useState<string>(''); // สถานะของเหตุผลการปฏิเสธ
  const [isOpen, setIsOpen] = useState<boolean>(false); // สถานะเปิดปิด pop-up
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null); // ข้อมูลการจองที่เลือก

  const handleShowDetails = (booking: BookingData) => {
    setSelectedBooking(booking);
    setIsOpen(true);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">รายการการจองที่รอการอนุมัติ</h2>
      {bookings.filter(booking => booking.status === 'pending').map((booking) => (
        <div key={booking.id} className="border-b pb-2 mb-2">
          {/* แสดงรูปห้องเป็นกล่องสีเทา */}
          <div className="w-24 h-24 bg-gray-300 flex items-center justify-center mb-2">
            <span className="text-gray-700 text-sm">{booking.roomName}</span>
          </div>
          <p>ผู้จอง: {booking.name}</p>
          <p>รหัสนิสิต: {booking.studentId}</p>
          <p>วันที่: {booking.date}</p>
          <p>ระยะเวลา: {booking.duration} นาที</p>
          <button 
            className="bg-blue-500 text-white px-2 py-1 rounded mt-2" 
            onClick={() => handleShowDetails(booking)}
          >
            แสดงรายละเอียด
          </button>
          <div className="mt-2 flex gap-2">
            <button 
              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" 
              onClick={() => onApprove(booking.id)}
            >
              อนุมัติ
            </button>
            <button 
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" 
              onClick={() => onReject(booking.id, rejectReason)}
            >
              ปฏิเสธ
            </button>
            <input 
              type="text" 
              placeholder="เหตุผลการปฏิเสธ" 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)} // ใช้ setRejectReason เพื่ออัปเดตสถานะ
              className="border px-2 py-1 rounded"
            />
          </div>
        </div>
      ))}

      {/* Pop-up สำหรับรายละเอียดการจอง */}
      {isOpen && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold">รายละเอียดการจอง</h2>
            <p>ชื่อห้อง: {selectedBooking.roomName}</p>
            <p>ผู้จอง: {selectedBooking.name}</p>
            <p>รหัสนิสิต: {selectedBooking.studentId}</p>
            <p>อีเมล/เบอร์โทรศัพท์: {selectedBooking.contact}</p>
            <p>วันที่: {selectedBooking.date}</p>
            <p>ระยะเวลา: {selectedBooking.duration} นาที</p>
            <p>จำนวนผู้เข้าร่วม: {selectedBooking.participants}</p>
            <p>วัตถุประสงค์: {selectedBooking.purpose}</p>
            <p>หมายเหตุเพิ่มเติม: {selectedBooking.notes}</p>

            <button 
              className="mt-4 bg-gray-300 px-4 py-2 rounded" 
              onClick={() => setIsOpen(false)}
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalComponent;
