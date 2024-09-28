import React from 'react';
import AdminApprove from './ApproveRooms/AdminApprove';
import UserApprove from './ApproveRooms/UserApprove';

interface FormData {
  meetingRoom: string;
  name: string;
  studentId: string;
  contact: string;
  date: string;
  duration: string;
  roomName: string;
  purpose: string;
}

// สมมติว่าเรามีข้อมูลฟอร์มตัวอย่าง
const exampleFormData: FormData = {
  meetingRoom: 'A',
  name: 'John Doe',
  studentId: '64020338',
  contact: '0952191988',
  date: '2024-09-10',
  duration: '60', // เปลี่ยนเป็น string ตามที่คุณต้องการ
  roomName: 'การประชุมทางวิชาการ',
  purpose: 'การนำเสนอผลงาน',
};

const Selection: React.FC = () => {
  return (
    <div className="w-full h-[850px] bg-gray-300 flex justify-center items-center rounded-lg p-3">
      <div className="flex w-full h-full">
        <div className="flex-[5] bg-green-500 mr-2 flex">
          <div className="flex-[3.5] bg-green-600 flex flex-col justify-center items-center text-white font-bold rounded-lg m-2">
            <div className='MuiBox-root css-130f50 text-black'>
              <UserApprove formData={exampleFormData} />                  
            </div>
          </div>
        </div>
        <div className="flex-[2] bg-blue-500 flex flex-col justify-start items-center text-black font-bold rounded-lg p-2">
          <AdminApprove formData={exampleFormData} /> 
        </div>
      </div>
    </div>
  );
};

export default Selection;
