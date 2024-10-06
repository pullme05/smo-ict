import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

type MemberProps = {
  _id?: string;
  name: string;
  position: string;
  email: string;
  avatarUrl?: string;
  phoneNumber?: string; // เพิ่มฟิลด์เบอร์โทร
};

const MemberUser: React.FC<MemberProps> = ({ name, position, email, avatarUrl, phoneNumber }) => {
  return (
    <Card className="max-w-sm mx-auto mt-4 shadow-lg rounded-lg">
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar
          alt={name}
          src={avatarUrl || 'https://via.placeholder.com/150'}
          sx={{ width: 128, height: 128, borderRadius: '8px' }}
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
        {phoneNumber && ( // แสดงเบอร์โทรถ้ามีข้อมูล
          <Typography variant="body2" className="text-gray-600">
            เบอร์โทร: {phoneNumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const OrganizationChart: React.FC = () => {
  const [members, setMembers] = useState<MemberProps[]>([]);

  // เรียก API เพื่อดึงข้อมูลสมาชิก
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/members');
        const data = await response.json();
        setMembers(data);  // เก็บข้อมูลสมาชิกใน state
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <Box
        sx={{
          backgroundColor: '#996600',
          color: '#fff',
          padding: '16px',
          textAlign: 'center',
          marginBottom: '16px',
          width: '100vw',
          position: 'relative',
          left: 'calc(-50vw + 50%)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          สมาชิกของนิสิตสโมสร
        </Typography>
      </Box>

      {/* Loop สมาชิกจาก state เพื่อแสดง */}
      {members.length > 0 && (
        <>
          <MemberUser
            name={members[0].name}
            position={members[0].position}
            email={members[0].email}
            avatarUrl={members[0].avatarUrl}
            phoneNumber={members[0].phoneNumber} // ส่งเบอร์โทรไปด้วย
          />

          {/* Row ที่ 2 */}
          <div className="flex space-x-4">
            {members.slice(1, 3).map((member) => (
              <MemberUser
                key={member._id}
                name={member.name}
                position={member.position}
                email={member.email}
                avatarUrl={member.avatarUrl}
                phoneNumber={member.phoneNumber} // ส่งเบอร์โทรไปด้วย
              />
            ))}
          </div>

          {/* Row ที่ 3 */}
          <div className="flex space-x-4">
            {members.slice(3, 6).map((member) => (
              <MemberUser
                key={member._id}
                name={member.name}
                position={member.position}
                email={member.email}
                avatarUrl={member.avatarUrl}
                phoneNumber={member.phoneNumber} // ส่งเบอร์โทรไปด้วย
              />
            ))}
          </div>

          {/* Row ที่ 4 */}
          <div className="flex space-x-4">
            {members.slice(6, 9).map((member) => (
              <MemberUser
                key={member._id}
                name={member.name}
                position={member.position}
                email={member.email}
                avatarUrl={member.avatarUrl}
                phoneNumber={member.phoneNumber} // ส่งเบอร์โทรไปด้วย
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrganizationChart;
