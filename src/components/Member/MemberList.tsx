import React, { useState } from 'react';
import MemberCard from './MemberCard';
import Header from './Header';

interface Member {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
}

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<Member[][]>([[], [], [], []]); // 4 Columns

  const addMember = (index: number) => {
    const newMember: Member = {
      id: Date.now(),
      name: 'New Member',
      position: 'New Position',
      phone: '099-999-9999',
      email: 'new.member@example.com',
    };
    const updatedMembers = [...members];
    updatedMembers[index].push(newMember);
    setMembers(updatedMembers);
  };

  const removeMember = (columnIndex: number, id: number) => {
    const updatedMembers = members.map((column, index) => 
      index === columnIndex ? column.filter(member => member.id !== id) : column
    );
    setMembers(updatedMembers);
  };

  return (
    <div className="flex flex-col items-center">
      <Header onSave={() => members.flat()} onLoad={(data) => {
        const newMembers: Member[][] = [[], [], [], []];
        data.forEach((member: Member, index: number) => {
          newMembers[index % 4].push(member); // แบ่งสมาชิกตามคอลัมน์
        });
        setMembers(newMembers);
      }} />

      <div className="flex flex-col gap-4">
        {members.map((column, columnIndex) => (
          <div key={columnIndex} className="border p-4">
            <div className="mb-2 font-bold">Column {columnIndex + 1}</div>
            <div className="flex flex-col gap-2 mb-2">
              {column.map(member => (
                <MemberCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  position={member.position}
                  phone={member.phone}
                  email={member.email}
                  onRemove={() => removeMember(columnIndex, member.id)}
                />
              ))}
            </div>
            <button
              onClick={() => addMember(columnIndex)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              เพิ่มสมาชิก
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;
