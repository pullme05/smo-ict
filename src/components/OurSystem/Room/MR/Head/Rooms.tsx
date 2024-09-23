// Rooms.tsx
import React from 'react';

interface RoomsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Rooms: React.FC<RoomsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center mt-5 z-50">
      {/* เพิ่มขนาดให้ modal */}
      <div className="bg-white p-4 rounded-lg w-[2000px] h-[900px] "> 
        
        <div className="mb-4 ">
          <h2 className="text-lg font-bold "></h2>
          
          {/* กล่องแรก */}
          <div className="h-10 bg-blue-200 flex justify-end items-center "> 
            <button onClick={onClose} className=" bg-blue-500 text-white px-4 py-1 rounded mr-1">
          Close
        </button>
          </div>
        </div>

        <div>
          {/* กล่องที่สอง */}
          <div className="h-[800px] bg-green-200 flex justify-center items-center">                     
          </div>
        </div>

        

      </div>
    </div>
  );
};

export default Rooms;
