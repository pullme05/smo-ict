import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Avatar, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

type MemberProps = {
  _id?: string;
  name: string;
  position: string;
  email: string;
  avatarUrl?: string;
  avatarFile?: File;
  phoneNumber?: string;
};

const MemberForm: React.FC = () => {
  const [formData, setFormData] = useState<MemberProps>({
    name: '',
    position: '',
    email: '',
    avatarUrl: '',
    phoneNumber: '',
    avatarFile: undefined,
  });

  const [members, setMembers] = useState<MemberProps[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  // ดึงข้อมูลสมาชิกทั้งหมดจากเซิร์ฟเวอร์
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/members');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        avatarFile: file,
        avatarUrl: URL.createObjectURL(file),
      });
    }
  };

  // เพิ่มหรืออัปเดตสมาชิก
  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    // เพิ่มข้อมูลใน FormData
    formDataToSend.append('name', formData.name);
    formDataToSend.append('position', formData.position);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phoneNumber', formData.phoneNumber || '');
    if (formData.avatarFile) {
      formDataToSend.append('avatar', formData.avatarFile); // ส่งไฟล์รูปภาพ
    }

    try {
      const response = editMode
        ? await fetch(`http://localhost:8000/api/members/${editingMemberId}`, {
            method: 'PUT',
            body: formDataToSend, // ส่งข้อมูลเป็น FormData
          })
        : await fetch('http://localhost:8000/api/members', {
            method: 'POST',
            body: formDataToSend, // ส่งข้อมูลเป็น FormData
          });

      if (response.ok) {
        const updatedMember = await response.json();
        setMembers((prev) =>
          editMode
            ? prev.map((member) =>
                member._id === editingMemberId ? updatedMember : member
              )
            : [...prev, updatedMember]
        );
        setEditMode(false);
        setEditingMemberId(null);
        setFormData({
          name: '',
          position: '',
          email: '',
          avatarUrl: '',
          phoneNumber: '',
          avatarFile: undefined,
        });
      } else {
        console.error('Error adding/updating member:', response.statusText);
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
    }
  };

  // ลบสมาชิก
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/members/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMembers((prev) => prev.filter((member) => member._id !== id));
      } else {
        console.error('Error deleting member:', response.statusText);
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
    }
  };

  // ตั้งค่าโหมดแก้ไข
  const handleEdit = (member: MemberProps) => {
    setFormData({
      name: member.name,
      position: member.position,
      email: member.email,
      avatarUrl: member.avatarUrl,
      phoneNumber: member.phoneNumber,
      avatarFile: undefined,
    });
    setEditMode(true);
    setEditingMemberId(member._id || null);
  };

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
          จัดการสมาชิกนิสิตสโมสร
        </Typography>
      </Box>

      <Box className="max-w-sm mx-auto mt-4 p-4 shadow-lg rounded-lg">
        <Typography variant="h5" sx={{ marginBottom: '16px', fontWeight: 'bold' }}>
          {editMode ? 'แก้ไขสมาชิก' : 'เพิ่มสมาชิกใหม่'}
        </Typography>

        <TextField
          label="ชื่อ"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          className="mb-4"
        />
        <TextField
          label="ตำแหน่ง"
          name="position"
          value={formData.position}
          onChange={handleChange}
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          className="mb-4"
        />
        <TextField
          label="เบอร์โทร"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          fullWidth
          className="mb-4"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        {formData.avatarUrl && (
          <Avatar
            alt="Avatar Preview"
            src={formData.avatarUrl}
            sx={{ width: 128, height: 128, borderRadius: '8px', marginBottom: '16px' }}
          />
        )}
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
          {editMode ? 'อัปเดตสมาชิก' : 'เพิ่มสมาชิก'}
        </Button>
      </Box>

      {/* ส่วนสำหรับแสดงรายชื่อสมาชิก */}
      <Box className="w-full mt-4">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {members.map((member) => (
            <Box
              key={member._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                textAlign: 'center',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
            >
              <Avatar
                src={member.avatarUrl || 'https://via.placeholder.com/150'}
                alt={member.name}
                sx={{ width: 150, height: 150, marginBottom: '16px' }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {member.name}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', marginBottom: '8px' }}>
                ตำแหน่ง: {member.position}
              </Typography>
              <Typography variant="body2" sx={{ color: '#999', marginBottom: '8px' }}>
                Email: {member.email}
              </Typography>
              {member.phoneNumber && (
                <Typography variant="body2" sx={{ color: '#999' }}>
                  เบอร์โทร: {member.phoneNumber}
                </Typography>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <IconButton onClick={() => handleEdit(member)} sx={{ marginRight: '8px' }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(member._id || '')} sx={{ color: '#f00' }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default MemberForm;
