import React from 'react';
import ApprovalComponent from './ApproveRooms/ApprovalComponent'; // อย่าลืม import ApprovalComponent
import { Box, Typography, CardContent, Card} from '@mui/material';

// สร้าง interface สำหรับข้อมูลการจอง
interface BookingData {
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
}

// สร้าง Selection component
const Selection: React.FC = () => {
  // ตัวอย่างข้อมูลการจอง
  const bookings: BookingData[] = [
    {
      id: 1,
      roomName: 'ห้องประชุม A',
      name: 'สมชาย',
      studentId: 'S001',
      contact: 'somchai@example.com',
      date: '2024-10-01',
      duration: 60,
      participants: '10',
      purpose: 'ประชุมทีม',
      notes: 'ไม่มี',
      status: 'pending', // ใช้ค่าที่ถูกต้อง
    },
    // คุณสามารถเพิ่มข้อมูลอื่น ๆ ได้ที่นี่
  ];

  const handleApprove = (id: number) => {
    // ฟังก์ชันในการอนุมัติการจอง
    console.log(`อนุมัติการจอง ID: ${id}`);
  };

  const handleReject = (id: number, reason: string) => {
    // ฟังก์ชันในการปฏิเสธการจอง
    console.log(`ปฏิเสธการจอง ID: ${id}, เหตุผล: ${reason}`);
  };

  return (
    <div className="w-full h-[850px] bg-gray-300 flex justify-center items-center rounded-lg p-3">
      <div className="flex w-full h-full">
        <div className="flex-[5] bg-green-500 mr-2 flex">
          <div className="flex-[3.5] bg-green-600 flex flex-col justify-center items-center text-white font-bold rounded-lg m-2">

            <div className='MuiBox-root css-130f50 text-black'>
              <h2 className="text-xl">ข้อมูลการจอง</h2>
                {bookings.map((booking) => (
                  <Card key={booking.id} variant="outlined" sx={{ mb: 1, bgcolor: 'background.paper', border: '1px solid grey' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', p: 1  }}>
                        <Typography variant="body1" fontWeight="bold">ชื่อห้อง: {booking.roomName}</Typography>
                        <Typography variant="body1">ผู้จอง: {booking.name}</Typography>
                        <Typography variant="body1">วันที่: {booking.date}</Typography>
                        <Typography variant="body1">
                          สถานะ: 
                          <span className={`font-bold ${booking.status === 'approved' ? 'text-green-500' : booking.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                            {booking.status === 'pending' ? 'รอการอนุมัติ' : booking.status === 'approved' ? 'อนุมัติแล้ว' : 'ถูกปฏิเสธ'}
                          </span>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}                        
            </div>

          </div>
        </div>

        <div className="flex-[2] bg-blue-500 flex flex-col justify-start items-center text-black font-bold rounded-lg p-2">
          <ApprovalComponent
            bookings={bookings}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
};

export default Selection;
