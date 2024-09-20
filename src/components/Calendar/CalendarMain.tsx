// CalendarMain เป็น component หลักที่รวมทุกอย่างเข้าด้วยกัน
// CalendarHeader จัดการส่วนหัวของปฏิทิน (ชื่อเดือนและปี)
// CalendarDays แสดงชื่อวันของสัปดาห์
// CalendarCells แสดงวันของเดือนโดยจัดเรียงเป็นตาราง

import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import CalendarCells from './CalendarCells';

const Calendar: React.FC = () => {

  // ใช้ useState เพื่อสร้างสถานะ meetingTime ที่เป็น string เริ่มต้นว่างเปล่า (''). 
  // ฟังก์ชัน setMeetingTime ใช้สำหรับการเปลี่ยนค่า meetingTime.
  const [meetingTime, setMeetingTime] = useState<string>('');

  // สร้างฟังก์ชัน handleDateChange เพื่อจัดการการเปลี่ยนแปลงของ input เมื่อผู้ใช้เลือกวันและเวลาใหม่ จากนั้นใช้ setMeetingTime เพื่ออัพเดตค่าของ meetingTime.
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeetingTime(e.target.value);
  };

  // แปลงค่าจาก meetingTime (ถ้ามี) เป็นชนิด Date. ถ้าไม่มีค่าใน meetingTime ให้ใช้วันที่ปัจจุบัน (new Date())
  const selectedDate = meetingTime ? new Date(meetingTime) : new Date();

  return (
    <div>
      <CalendarHeader meetingTime={meetingTime} handleDateChange={handleDateChange} />
      <CalendarDays />
      <CalendarCells currentDate={selectedDate} />
    </div>
  );
};

export default Calendar;
