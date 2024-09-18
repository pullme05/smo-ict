import React from 'react';
import { CalendarToday, MeetingRoom, Group } from '@mui/icons-material';
import { Link } from 'react-router-dom'; // นำเข้า Link จาก react-router-dom

const Oursystem: React.FC = () => {
  return (
    <div id="ระบบของเรา" className="bg-gray-100 py-10">
      <h2 className="text-2xl font-bold text-center mb-4">ระบบของเรา</h2>
      
      <div className="flex justify-center space-x-4">
        {/* Block 1: ปฏิทิน */}
        <div className="w-48 h-48 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105 duration-300">
          <div className="bg-gray-200 w-24 h-24 rounded-full mb-4 flex items-center justify-center">
            <CalendarToday style={{ fontSize: 48, color: 'gray' }} />
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md transition-colors hover:bg-blue-600 duration-300 focus:outline-none"
            onClick={() => alert('ปฏิทิน system selected!')}
          >
            ปฏิทิน
          </button>
        </div>

        {/* Block 2: การจองห้อง */}
        <div className="w-48 h-48 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105 duration-300">
          <div className="bg-gray-200 w-24 h-24 rounded-full mb-4 flex items-center justify-center">
            <MeetingRoom style={{ fontSize: 48, color: 'gray' }} />
          </div>
          <Link to="/Meeting"> 
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md transition-colors hover:bg-blue-600 duration-300 focus:outline-none"
            >
              การจองห้อง
            </button>
          </Link>
        </div>

        {/* Block 3: สมาชิกของนิสิตสโมสร */}
        <div className="w-48 h-48 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105 duration-300">
          <div className="bg-gray-200 w-24 h-24 rounded-full mb-4 flex items-center justify-center">
            <Group style={{ fontSize: 48, color: 'gray' }} />
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md transition-colors hover:bg-blue-600 duration-300 focus:outline-none"
            onClick={() => alert('สมาชิกของนิสิตสโมสร system selected!')}
          >
            สมาชิกของนิสิตสโมสร
          </button>
        </div>
      </div>
    </div>
  );
};

export default Oursystem;
