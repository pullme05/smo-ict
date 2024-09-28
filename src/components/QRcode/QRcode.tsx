import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QrcodeGenerator: React.FC = () => {
  const studentData = {
    name: 'หมีพูห์ สุดหล่อ',
    studentId: '64020383',
  };

  const generateKey = () => {
    return crypto.randomUUID();
  };

  const [key, setKey] = useState(generateKey());
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString());

  // เข้ารหัสข้อมูลในรูปแบบ (ชื่อ John Doe รหัสนิสิต 64020383)
  const [qrValue, setQrValue] = useState(
    `(ชื่อ ${studentData.name} รหัสนิสิต ${studentData.studentId})`
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newKey = generateKey();
      const newTimestamp = new Date().toLocaleString();
      setKey(newKey);
      setTimestamp(newTimestamp);

      // อัปเดตรูปแบบ qrValue
      setQrValue(
        `(ชื่อ ${studentData.name} รหัสนิสิต ${studentData.studentId})`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#996600] text-center mb-8">
          QR Code ของคุณ
        </h1>
        <div className="flex justify-center mb-6">
          <QRCodeCanvas
            value={qrValue}
            size={256}
            className="cursor-pointer transform hover:scale-105 transition-transform"
          />
        </div>
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-gray-600">
            ชื่อ: <span className="text-[#996600]">{studentData.name}</span>
          </p>
          <p className="text-lg font-semibold text-gray-600">
            รหัสนิสิต: <span className="text-[#996600]">{studentData.studentId}</span>
          </p>
          <p className="text-lg font-semibold text-gray-600">
            Key: <span className="text-[#996600]">{key}</span>
          </p>
          <p className="text-lg font-semibold text-gray-600">
            Updated At: <span className="text-[#996600]">{timestamp}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrcodeGenerator;
