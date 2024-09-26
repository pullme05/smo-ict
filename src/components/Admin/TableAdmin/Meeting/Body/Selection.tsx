import React from 'react';

const Selection: React.FC = () => {
  
  return (
    <div className="w-full h-[850px] bg-gray-300 flex justify-center items-center rounded-lg p-3">
      <div className="flex w-full h-full">
        <div className="flex-[5] bg-green-500 mr-2 flex">
          <div className="flex-[3.5] bg-green-600 flex justify-center items-center text-white font-bold rounded-lg m-2">

          </div>
          
        </div>

        <div className="flex-[2] bg-blue-500 flex justify-center items-center text-white font-bold rounded-lg">
          กล่องขวา (2 ส่วน)
        </div>
      </div>
    </div>
  );
};

export default Selection;
