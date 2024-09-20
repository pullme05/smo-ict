import React from 'react';

// สร้าง interface ชื่อ CalendarHeaderProps เพื่อกำหนดชนิดข้อมูลของ props ที่รับเข้ามาใน CalendarHeader.
// meetingTime เป็น string.
// handleDateChange เป็นฟังก์ชันที่รับค่า React.ChangeEvent<HTMLInputElement> และไม่คืนค่า (void)
interface CalendarHeaderProps {
  meetingTime: string;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// ประกาศฟังก์ชัน component CalendarHeader ที่รับ props ตามชนิดข้อมูลที่กำหนดใน CalendarHeaderProps
const CalendarHeader: React.FC<CalendarHeaderProps> = ({ meetingTime, handleDateChange }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
      <input
        type="datetime-local"
        value={meetingTime}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default CalendarHeader;
