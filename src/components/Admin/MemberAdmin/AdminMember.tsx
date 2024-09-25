import React, { useState } from 'react';
import {
  Button, TextField, Box, Modal, Avatar, Typography, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Container
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type MemberProps = {
  id: number;
  name: string;
  position: string;
  email: string;
  avatarUrl?: string;
};

const AdminMember: React.FC = () => {
  const [members, setMembers] = useState<MemberProps[]>([
    { id: 1, name: 'Member 1', position: 'Position 1', email: 'email1@example.com', avatarUrl: '' },
    { id: 2, name: 'Member 2', position: 'Position 2', email: 'email2@example.com', avatarUrl: '' },
    { id: 3, name: 'Member 3', position: 'Position 3', email: 'email3@example.com', avatarUrl: '' },
    { id: 4, name: 'Member 4', position: 'Position 4', email: 'email4@example.com', avatarUrl: '' },
  ]);

  const [currentMember, setCurrentMember] = useState<MemberProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>(null);

  const handleOpenModal = (member: MemberProps | null = null) => {
    setCurrentMember(member || { id: 0, name: '', position: '', email: '', avatarUrl: '' });
    setImageUrl(member?.avatarUrl || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMember(null);
    setImageUrl(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentMember) {
      setCurrentMember({ ...currentMember, [e.target.name]: e.target.value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (currentMember) {
      const updatedMember = { ...currentMember, avatarUrl: imageUrl as string };
      if (currentMember.id) {
        setMembers(members.map((member) => (member.id === currentMember.id ? updatedMember : member)));
      } else {
        setMembers([...members, { ...updatedMember, id: members.length + 1 }]);
      }
    }
    handleCloseModal();
  };

  const handleDeleteConfirmOpen = (id: number) => {
    setDeleteConfirmOpen(true);
    setMemberToDelete(id);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setMemberToDelete(null);
  };

  const handleDelete = () => {
    if (memberToDelete !== null) {
      setMembers(members.filter((member) => member.id !== memberToDelete));
    }
    handleDeleteConfirmClose();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          จัดการสมาชิกนิสิตสโมสร
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
          เพิ่มสมาชิก
        </Button>
      </Box>

      <Grid container spacing={3}>
        {members.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', border: '1px solid #ddd', borderRadius: 2, p: 2 }}>
              <Avatar
                alt={member.name}
                src={member.avatarUrl || 'https://via.placeholder.com/150'}
                sx={{ width: 128, height: 128, borderRadius: '8px' }} // ปรับให้เป็นสี่เหลี่ยม
              />
              <Typography variant="h6" sx={{ mt: 2 }}>{member.name}</Typography>
              <Typography variant="body1" color="textSecondary">{member.position}</Typography>
              <Typography variant="body2" color="textSecondary">{member.email}</Typography>
              <Box sx={{ mt: 2 }}>
                <IconButton color="primary" onClick={() => handleOpenModal(member)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteConfirmOpen(member.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Modal สำหรับเพิ่ม/แก้ไขสมาชิก */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{ bgcolor: 'white', padding: 4, width: 400, mx: 'auto', mt: 8, borderRadius: 2 }}>
          <Typography variant="h6">{currentMember?.id ? 'แก้ไขสมาชิก' : 'เพิ่มสมาชิก'}</Typography>

          <TextField
            label="ชื่อ"
            name="name"
            value={currentMember?.name || ''}
            onChange={handleChange}
            fullWidth
            sx={{ mt: 2 }}
          />

          <TextField
            label="ตำแหน่ง"
            name="position"
            value={currentMember?.position || ''}
            onChange={handleChange}
            fullWidth
            sx={{ mt: 2 }}
          />

          <TextField
            label="Email"
            name="email"
            value={currentMember?.email || ''}
            onChange={handleChange}
            fullWidth
            sx={{ mt: 2 }}
            helperText="กรุณากรอกอีเมลที่ถูกต้อง"
          />

          <Box sx={{ mt: 2 }}>
            {/* input แบบ HTML */}
            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {/* ใช้ TextField แบบ MUI */}
            {/* <TextField
              type="file"
              InputProps={{
                inputProps: {
                  accept: "image/*"
                }
              }}
              onChange={handleImageUpload}
              fullWidth
              sx={{ mt: 2 }}
            /> */}

            {imageUrl && (
              <Box sx={{ mt: 2 }}>
                <Avatar
                  alt="Preview"
                  src={imageUrl as string}
                  sx={{ width: 128, height: 128, borderRadius: '8px' }} // แสดงพรีวิวรูปภาพ
                />
              </Box>
            )}
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal} variant="outlined" sx={{ mr: 1 }}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              บันทึก
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Dialog ยืนยันการลบ */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
        <DialogTitle>ยืนยันการลบสมาชิก</DialogTitle>
        <DialogContent>
          <DialogContentText>คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิกนี้?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} variant="outlined">ยกเลิก</Button>
          <Button onClick={handleDelete} variant="contained" color="secondary">ลบ</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminMember;
