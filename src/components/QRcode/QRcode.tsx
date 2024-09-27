import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QrcodeGenerator: React.FC = () => {
  const studentData = {
    name: "John Doe",
    studentId: "64020383"
  };

  // สร้างฟังก์ชันเพื่อสร้างคีย์ที่ยาก
  const generateKey = () => {
    return crypto.randomUUID(); // ใช้ UUID เป็นคีย์
  };

  // สร้างฟังก์ชันเพื่อสร้างเวลาอัปเดต
  const generateTimestamp = () => {
    return new Date().toLocaleString(); // เวลาปัจจุบันในรูปแบบ string
  };

  // ค่าเริ่มต้นของ key และ timestamp
  const [key, setKey] = useState(generateKey());
  const [timestamp, setTimestamp] = useState(generateTimestamp());
  const [qrValue, setQrValue] = useState(
    `ชื่อ: ${studentData.name}, รหัสนิสิต: ${studentData.studentId}, Key: ${key}, Updated At: ${timestamp}`
  );

  const handleScan = () => {
    // เมื่อสแกน QR Code ให้สร้าง key และ timestamp ใหม่
    const newKey = generateKey();
    const newTimestamp = generateTimestamp();

    // อัปเดตค่า key, timestamp และ qrValue ใหม่
    setKey(newKey);
    setTimestamp(newTimestamp);
    setQrValue(
      `ชื่อ: ${studentData.name}, รหัสนิสิต: ${studentData.studentId}, Key: ${newKey}, Updated At: ${newTimestamp}`
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">QR Code ของคุณ</h1>
      <QRCodeCanvas value={qrValue} size={256} onClick={handleScan} />
      <div className="mt-4">
        <p className="text-lg">ชื่อ: {studentData.name}</p>
        <p className="text-lg">รหัสนิสิต: {studentData.studentId}</p>
        <p className="text-lg">Key: {key}</p>
        <p className="text-lg">Updated At: {timestamp}</p>
      </div>
    </div>
  );
};

export default QrcodeGenerator;
