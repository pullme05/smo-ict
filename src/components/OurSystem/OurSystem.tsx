import React from 'react';
import { CalendarToday, MeetingRoom, Group } from '@mui/icons-material';
import { Link } from 'react-router-dom'; // นำเข้า Link จาก react-router-dom

const Oursystem: React.FC = () => {
  return (
    <div id="ระบบของเรา" className="bg-gray-100 py-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-[#996600]">ระบบของเรา</h2>
      
      <div className="flex justify-center space-x-6">
        {/* Block 1: ปฏิทินกิจกรรม*/}
        <div className="w-64 h-64 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105 duration-300">
          <div className="bg-gray-200 w-32 h-32 rounded-full mb-4 flex items-center justify-center">
            <CalendarToday style={{ fontSize: 64, color: 'gray' }} />
          </div>
          <Link to="/UserCalendar">
            <button
              className="px-6 py-3 bg-[#996600] text-white rounded-lg shadow-md transition-colors hover:bg-[#664400] duration-300 focus:outline-none"
            >
              ปฎิทินกิจกรรม
            </button>
          </Link>
        </div>

        {/* Block 2: การจองห้อง */}
        <div className="w-64 h-64 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105 duration-300">
          <div className="bg-gray-200 w-32 h-32 rounded-full mb-4 flex items-center justify-center">
            <MeetingRoom style={{ fontSize: 64, color: 'gray' }} />
          </div>
          <Link to="/Heart">
            <button
              className="px-6 py-3 bg-[#996600] text-white rounded-lg shadow-md transition-colors hover:bg-[#664400] duration-300 focus:outline-none"
            >
              การจองห้อง
            </button>
          </Link>
        </div>

        {/* Block 3: สมาชิกของนิสิตสโมสร */}
        <div className="w-64 h-64 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105 duration-300">
          <div className="bg-gray-200 w-32 h-32 rounded-full mb-4 flex items-center justify-center">
            <Group style={{ fontSize: 64, color: 'gray' }} />
          </div>
          <Link to="/MemberList">
          <button
            className="px-6 py-3 bg-[#996600] text-white rounded-lg shadow-md transition-colors hover:bg-[#664400] duration-300 focus:outline-none"           
          >
            สมาชิกของนิสิตสโมสร
          </button>
          </Link>
          {/* test */}
          <Link to="/MemberUser">
          <button
            className="px-6 py-3 bg-[#996600] text-white rounded-lg shadow-md transition-colors hover:bg-[#664400] duration-300 focus:outline-none"           
          >
            สมาชิกของนิสิตสโมสร
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Oursystem;
