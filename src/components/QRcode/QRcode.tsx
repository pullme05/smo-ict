import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';

const QrcodeGenerator: React.FC = () => {
  const [userData, setUserData] = useState({ name: '', studentId: '' });
  const [key, setKey] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [qrValue, setQrValue] = useState('');

  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ที่ล็อคอินจาก backend
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token'); // ดึง token จาก localStorage
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: {
          Authorization: token, // แนบ token ใน header
        },
      });

      const { firstName, lastName, studentID } = response.data;
      setUserData({ name: `${firstName} ${lastName}`, studentId: studentID });

      // สร้าง qrValue โดยใช้ข้อมูลผู้ใช้ (ไม่รวม key)
      setQrValue(`ชื่อ: ${firstName} ${lastName}, รหัสนิสิต: ${studentID}`);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const generateKey = () => {
    return crypto.randomUUID(); // สร้าง key ใหม่ทุกครั้งที่เรียกฟังก์ชัน
  };

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้เมื่อคอมโพเนนต์โหลด
    fetchUserData();

    // ตั้งค่า interval เพื่ออัปเดต key และ timestamp ทุก 1 วินาที
    const interval = setInterval(() => {
      setKey(generateKey()); // สร้างและตั้งค่า key ใหม่
      setTimestamp(new Date().toLocaleString()); // อัปเดต timestamp ใหม่
    }, 1000); // อัปเดตทุก 1 วินาที

    return () => clearInterval(interval); // ลบ interval เมื่อคอมโพเนนต์ถูก unmount
  }, []); // ทำให้โค้ดนี้รันเพียงครั้งเดียวเมื่อโหลดคอมโพเนนต์

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#996600] text-center mb-8">
          QR Code ของคุณ
        </h1>
        <div className="flex justify-center mb-6">
          <QRCodeCanvas
            value={qrValue} // qrValue จะไม่รวม key
            size={256}
            className="cursor-pointer transform hover:scale-105 transition-transform"
          />
        </div>
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-gray-600">
            ชื่อ: <span className="text-[#996600]">{userData.name}</span>
          </p>
          <p className="text-lg font-semibold text-gray-600">
            รหัสนิสิต: <span className="text-[#996600]">{userData.studentId}</span>
          </p>
          <p className="text-lg font-semibold text-gray-600">
            Key: <span className="text-[#996600]">{key}</span> {/* แสดง key ใน UI */}
          </p>
          <p className="text-lg font-semibold text-gray-600">
            Updated At: <span className="text-[#996600]">{timestamp}</span> {/* แสดง timestamp แบบเรียลไทม์ */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrcodeGenerator;
