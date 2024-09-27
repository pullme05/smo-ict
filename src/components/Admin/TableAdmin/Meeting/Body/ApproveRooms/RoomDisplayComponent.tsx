// RoomDisplayComponent.tsx
import React from 'react';

interface RoomDisplayProps {
  bookings: {
    id: number;
    roomName: string;   // ชื่อห้องประชุม
    name: string;       // ชื่อผู้จอง
    studentId: string;  // รหัสนิสิต
    contact: string;    // อีเมลหรือเบอร์โทรศัพท์
    date: string;       // วันที่
    duration: number;   // ระยะเวลา
    participants: string; // จำนวนผู้เข้าร่วม
    purpose: string;    // วัตถุประสงค์
    notes: string;      // หมายเหตุเพิ่มเติม
    status: 'pending' | 'approved' | 'rejected'; // สถานะการจอง
    rejectReason?: string; // เหตุผลการปฏิเสธ
  }[];
  currentUser: string; // รหัสผู้ใช้ที่ลงชื่อเข้าใช้
}

const RoomDisplayComponent: React.FC<RoomDisplayProps> = ({ bookings, currentUser }) => {
  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">สถานะการจองห้องประชุม</h2>
      {bookings.map((booking) => (
        <div key={booking.id} className="border-b pb-2 mb-2">
          <p>ชื่อห้องประชุม: {booking.roomName}</p>
          <p>ชื่อผู้จอง: {booking.name}</p>
          {booking.name === currentUser && (
            <>
              <p>รหัสนิสิต: {booking.studentId}</p>
              <p>อีเมล/เบอร์โทรศัพท์: {booking.contact}</p>
              <p>วันที่: {booking.date}</p>
              <p>ระยะเวลา: {booking.duration} นาที</p>
              <p>จำนวนผู้เข้าร่วม: {booking.participants}</p>
              <p>วัตถุประสงค์: {booking.purpose}</p>
              <p>หมายเหตุเพิ่มเติม: {booking.notes}</p>
              {booking.status === 'rejected' && (
                <p className="text-red-600">เหตุผลการปฏิเสธ: {booking.rejectReason}</p>
              )}
            </>
          )}
          {booking.name !== currentUser && (
            <>
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
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoomDisplayComponent;
