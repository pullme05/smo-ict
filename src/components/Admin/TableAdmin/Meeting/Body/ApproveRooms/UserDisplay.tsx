// RoomDisplayComponent.tsx
import React from 'react';

interface RoomDisplayProps {
  bookings: {
    id: number;
    roomName: string;
    name: string;
    studentId: string; // เพิ่มข้อมูลรหัสนิสิต
    contact: string;   // อีเมลหรือเบอร์โทรศัพท์
    date: string;
    duration: number;
    participants: string; // จำนวนผู้เข้าร่วม
    purpose: string;    // วัตถุประสงค์
    notes: string;      // หมายเหตุเพิ่มเติม
    status: 'pending' | 'approved' | 'rejected';
    rejectReason?: string;
  }[];
  currentUserId: string; // เพิ่มข้อมูลรหัสนิสิตของผู้ใช้ปัจจุบัน
}

const UserDisplay: React.FC<RoomDisplayProps> = ({ bookings, currentUserId }) => {
  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">สถานะการจองห้องประชุม</h2>
      {bookings.map((booking) => (
        <div key={booking.id} className="border-b pb-2 mb-2">
          <p>ชื่อห้อง: {booking.roomName}</p>
          <p>ผู้จอง: {booking.name}</p>
          <p>วันที่: {booking.date}</p>
          <p>ระยะเวลา: {booking.duration} นาที</p>
          <p>สถานะ: 
            <span className={`font-bold ${booking.status === 'approved' ? 'text-green-600' : booking.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
              {booking.status === 'pending' ? 'รอการอนุมัติ' : booking.status === 'approved' ? 'อนุมัติแล้ว' : 'ถูกปฏิเสธ'}
            </span>
          </p>
          {booking.status === 'rejected' && (
            <p className="text-red-600">เหตุผลการปฏิเสธ: {booking.rejectReason}</p>
          )}
          {/* แสดงข้อมูลตามสถานะของผู้ใช้งาน */}
          {booking.studentId === currentUserId && (
            <div>
              <p>รหัสนิสิต: {booking.studentId}</p>
              <p>ติดต่อ: {booking.contact}</p>
              <p>จำนวนผู้เข้าร่วม: {booking.participants}</p>
              <p>วัตถุประสงค์: {booking.purpose}</p>
              <p>หมายเหตุเพิ่มเติม: {booking.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserDisplay;
