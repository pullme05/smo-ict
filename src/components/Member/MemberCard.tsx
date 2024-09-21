// MemberCard.tsx
import React from 'react';

interface MemberProps {
    id: number;
    name: string;
    position: string;
    phone: string;
    email: string;
    onRemove: (id: number) => void;
  }
  

// MemberCard.tsx
const MemberCard: React.FC<MemberProps> = ({ id, name, position, phone, email, onRemove }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 w-48 text-center">
        {/* ส่วนแสดงข้อมูลสมาชิก */}
        <img
          src={`https://via.placeholder.com/150`}
          alt={name}
          className="w-24 h-24 mx-auto rounded-full mb-2"
        />
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">{position}</p>
        <p className="text-sm text-gray-500">{phone}</p>
        <p className="text-sm text-gray-500">{email}</p>
        {/* ปุ่มลบสมาชิก */}
        <button
          onClick={() => onRemove(id)}
          className="mt-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          ลบ
        </button>
      </div>
    );
  };
  

export default MemberCard;
