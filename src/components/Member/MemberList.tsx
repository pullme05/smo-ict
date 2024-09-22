import React, { useState, useEffect } from 'react';
import MemberCard from './MemberCard';
import Header from './Header';
import { v4 as uuidv4 } from 'uuid';

interface Member {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
}

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<Member[][]>([]);

  const initialMembers: Member[][] = [
    [
      { id: uuidv4(), name: 'Member 1', position: 'Position 1', phone: '099-999-9999', email: 'member1@example.com' },
      { id: uuidv4(), name: 'Member 2', position: 'Position 2', phone: '099-999-9998', email: 'member2@example.com' },
      { id: uuidv4(), name: 'Member 3', position: 'Position 3', phone: '099-999-9997', email: 'member3@example.com' },
    ],
    [
      { id: uuidv4(), name: 'Member 4', position: 'Position 4', phone: '099-999-9996', email: 'member4@example.com' },
      { id: uuidv4(), name: 'Member 5', position: 'Position 5', phone: '099-999-9995', email: 'member5@example.com' },
      { id: uuidv4(), name: 'Member 6', position: 'Position 6', phone: '099-999-9994', email: 'member6@example.com' },
    ],
    [
      { id: uuidv4(), name: 'Member 7', position: 'Position 7', phone: '099-999-9993', email: 'member7@example.com' },
      { id: uuidv4(), name: 'Member 8', position: 'Position 8', phone: '099-999-9992', email: 'member8@example.com' },
      { id: uuidv4(), name: 'Member 9', position: 'Position 9', phone: '099-999-9991', email: 'member9@example.com' },
    ],
    [
      { id: uuidv4(), name: 'Member 10', position: 'Position 10', phone: '099-999-9990', email: 'member10@example.com' },
      { id: uuidv4(), name: 'Member 11', position: 'Position 11', phone: '099-999-9888', email: 'member11@example.com' },
      { id: uuidv4(), name: 'Member 12', position: 'Position 12', phone: '099-999-7777', email: 'member12@example.com' },
    ],
  ];

  useEffect(() => {
    setMembers(initialMembers);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Header
        onSave={() => members.flat()}
        onLoad={(data) => setMembers(data)}
      />

      {members.map((group, index) => (
        <div key={index} className="flex flex-row gap-4 mb-4">
          {group.map(member => (
            <div key={member.id} className="flex-1 border p-4"> {/* ใช้ flex-1 เพื่อให้กล่องมีขนาดเท่ากัน */}
              <MemberCard
                name={member.name}
                position={member.position}
                phone={member.phone}
                email={member.email}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MemberList;
