import React from 'react';

interface MemberCardProps {
  name: string;
  position: string;
  phone: string;
  email: string;
}

const MemberCard: React.FC<MemberCardProps> = ({ name, position, phone, email }) => {
  return (
    <div className="border border-gray-300 p-4 rounded shadow-md text-center">
      <img
        src={`https://via.placeholder.com/150`}
        alt={name}
        className="w-24 h-24 mx-auto rounded-full mb-2"
      />
      <h3 className="font-bold">{name}</h3>
      <p>{position}</p>
      <p>{phone}</p>
      <p>{email}</p>
    </div>
  );
};

export default MemberCard;
