import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box, Modal } from '@mui/material';

type MemberProps = {
  id: number;
  name: string;
  position: string;
  email: string;
  avatarUrl?: string;
  column: number; // เพิ่มฟิลด์คอลัมน์
  block: number; // เพิ่มฟิลด์บล็อค
};

const AdminMember: React.FC = () => {
  // ข้อมูลสมาชิก พร้อมระบุตำแหน่งคอลัมน์และบล็อค
  const [members, setMembers] = useState<MemberProps[]>([
    { id: 1, name: 'Member 1', position: 'Position 1', email: 'email1@example.com', avatarUrl: '', column: 1, block: 1 },
    { id: 2, name: 'Member 2', position: 'Position 2', email: 'email2@example.com', avatarUrl: '', column: 2, block: 1 },
    { id: 3, name: 'Member 3', position: 'Position 3', email: 'email3@example.com', avatarUrl: '', column: 2, block: 2 },
  ]);

  // จัดการ state สำหรับการแก้ไข/เพิ่มสมาชิก
  const [currentMember, setCurrentMember] = useState<MemberProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ฟังก์ชันเปิด modal เพื่อเพิ่ม/แก้ไขสมาชิก
  const handleOpenModal = (member: MemberProps | null = null) => {
    setCurrentMember(member);
    setIsModalOpen(true);
  };

  // ฟังก์ชันปิด modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMember(null);
  };

  // ฟังก์ชันจัดการการแก้ไขข้อมูลสมาชิก
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentMember) {
      setCurrentMember({ ...currentMember, [e.target.name]: e.target.value });
    }
  };

  // ฟังก์ชันบันทึกสมาชิกใหม่หรือแก้ไขสมาชิกเดิม
  const handleSave = () => {
    if (currentMember) {
      if (currentMember.id) {
        setMembers(
          members.map((member) =>
            member.id === currentMember.id ? currentMember : member
          )
        );
      } else {
        setMembers([
          ...members,
          { ...currentMember, id: members.length + 1, column: 1, block: members.length + 1 }, // เพิ่ม ID, column, และ block ให้กับสมาชิกใหม่
        ]);
      }
    }
    handleCloseModal();
  };

  // ฟังก์ชันลบสมาชิก
  const handleDelete = (id: number) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Box sx={{ backgroundColor: '#996600', color: '#fff', padding: '16px', textAlign: 'center', marginBottom: '16px', width: '100vw', position: 'relative', left: 'calc(-50vw + 50%)' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>จัดการสมาชิกนิสิตสโมสร</Typography>
      </Box>

      <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
        เพิ่มสมาชิก
      </Button>

      {/* แสดงรายการสมาชิก */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="max-w-sm mx-auto mt-4 shadow-lg rounded-lg">
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar
                alt={member.name}
                src={member.avatarUrl || 'https://via.placeholder.com/150'}
                sx={{ width: 128, height: 128, borderRadius: '8px' }}
              />
              <Typography variant="h6" className="text-gray-800 font-semibold">
                {member.name}
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                ตำแหน่ง: {member.position}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Email: {member.email}
              </Typography>
              {/* แสดงข้อมูลคอลัมน์และบล็อค */}
              <Typography variant="body2" className="text-gray-600">
                คอลัมน์: {member.column} บล็อค: {member.block}
              </Typography>
              <div className="flex space-x-2">
                <Button variant="outlined" color="primary" onClick={() => handleOpenModal(member)}>
                  แก้ไข
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => handleDelete(member.id)}>
                  ลบ
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal สำหรับเพิ่ม/แก้ไขสมาชิก */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box className="bg-white p-4 rounded-md shadow-lg mx-auto mt-20 w-96">
          <Typography variant="h6">{currentMember?.id ? 'แก้ไขสมาชิก' : 'เพิ่มสมาชิก'}</Typography>

          {/* ฟิลด์ชื่อ */}
          <TextField
            label="ชื่อ"
            name="name"
            value={currentMember?.name || ''}
            onChange={handleChange}
            fullWidth
            className="mt-4"
            placeholder="กรอกชื่อสมาชิก"
          />

          {/* ฟิลด์ตำแหน่ง */}
          <TextField
            label="ตำแหน่ง"
            name="position"
            value={currentMember?.position || ''}
            onChange={handleChange}
            fullWidth
            className="mt-4"
            placeholder="กรอกตำแหน่งของสมาชิก"
          />

          {/* ฟิลด์อีเมล */}
          <TextField
            label="Email"
            name="email"
            value={currentMember?.email || ''}
            onChange={handleChange}
            fullWidth
            className="mt-4"
            placeholder="กรอกอีเมลของสมาชิก"
          />

          <Box className="flex justify-end space-x-2 mt-4">
            <Button onClick={handleCloseModal} variant="outlined">ยกเลิก</Button>
            <Button onClick={handleSave} variant="contained" color="primary">บันทึก</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminMember;
