// Header.tsx
import React, { useState } from 'react';
import Groups3Icon from '@mui/icons-material/Groups3';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Modal from './Rooms';

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  

  return (
    <div className="flex flex-col justify-center items-center p-5 mt-8">
      {/* กล่องบน */}
      <div className="w-[300px] h-[35px] bg-gray-500 mb-5 flex justify-center items-center text-white font-bold rounded-lg">
        Meeting room system
      </div>

      {/* กล่องล่าง */}
      <div className="w-[300px] h-[50px] bg-blue-500 flex justify-between p-4 items-center text-white font-bold rounded-lg ">

        <div className="mr-4">
          <Groups3Icon fontSize='large' />
        </div>
        <button onClick={handleOpenModal} className="flex-grow text-center">
          RoomMeeting
        </button>
        <div className="ml-4">
          {isModalOpen ? (<VisibilityOffIcon fontSize='small' />):
          (<VisibilityIcon fontSize='small' />)}
        </div>

      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
      
    </div>
  );
};

export default Header;
