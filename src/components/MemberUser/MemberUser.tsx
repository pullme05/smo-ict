import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { Box } from '@mui/material';

type MemberProps = {
  name: string;
  position: string;
  email: string;
  avatarUrl?: string;
};

const MemberUser: React.FC<MemberProps> = ({ name, position, email, avatarUrl }) => {
  return (
    <Card className="max-w-sm mx-auto mt-4 shadow-lg rounded-lg">
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar 
          alt={name}
          src={avatarUrl || 'https://via.placeholder.com/150'}
          sx={{ width: 128, height: 128, borderRadius: '8px' }} // กำหนดให้ borderRadius เป็น 8px (สี่เหลี่ยมมุมโค้งเล็กน้อย)
        />
        <Typography variant="h6" className="text-gray-800 font-semibold">
          {name}
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          ตำแหน่ง: {position}
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Email: {email}
        </Typography>
      </CardContent>
    </Card>
  );
};

const OrganizationChart: React.FC = () => {
  const members = [
    { name: 'Member 1', position: 'Position 1', email: 'email1@example.com', avatarUrl: '' },
    { name: 'Member 2', position: 'Position 2', email: 'email2@example.com', avatarUrl: '' },
    { name: 'Member 3', position: 'Position 3', email: 'email3@example.com', avatarUrl: '' },
    { name: 'Member 4', position: 'Position 4', email: 'email4@example.com', avatarUrl: '' },
    { name: 'Member 5', position: 'Position 5', email: 'email5@example.com', avatarUrl: '' },
    { name: 'Member 6', position: 'Position 6', email: 'email6@example.com', avatarUrl: '' },
    { name: 'Member 7', position: 'Position 7', email: 'email7@example.com', avatarUrl: '' },
    { name: 'Member 8', position: 'Position 8', email: 'email8@example.com', avatarUrl: '' },
    { name: 'Member 9', position: 'Position 9', email: 'email9@example.com', avatarUrl: '' },
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <Box sx={{ backgroundColor: '#996600', color: '#fff', padding: '16px', textAlign: 'center', marginBottom: '16px', width: '100vw', position: 'relative', left: 'calc(-50vw + 50%)' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>สมาชิกของนิสิตสโมสร</Typography>
      </Box>
      {/* แถวที่ 1 */}
      <MemberUser
        name={members[0].name}
        position={members[0].position}
        email={members[0].email}
        avatarUrl={members[0].avatarUrl}
      />

      {/* แถวที่ 2 */}
      <div className="flex space-x-4">
        {members.slice(1, 3).map((member, index) => (
          <MemberUser
            key={index}
            name={member.name}
            position={member.position}
            email={member.email}
            avatarUrl={member.avatarUrl}
          />
        ))}
      </div>

      {/* แถวที่ 3 */}
      <div className="flex space-x-4">
        {members.slice(3, 6).map((member, index) => (
          <MemberUser
            key={index}
            name={member.name}
            position={member.position}
            email={member.email}
            avatarUrl={member.avatarUrl}
          />
        ))}
      </div>

      {/* แถวที่ 4 */}
      <div className="flex space-x-4">
        {members.slice(6, 9).map((member, index) => (
          <MemberUser
            key={index}
            name={member.name}
            position={member.position}
            email={member.email}
            avatarUrl={member.avatarUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default OrganizationChart;
