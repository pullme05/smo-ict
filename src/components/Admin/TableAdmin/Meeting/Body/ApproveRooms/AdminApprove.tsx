import React, { useState } from 'react';
import { Card, CardContent, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface FormData {
  meetingRoom: string;
  name: string;
  studentId: string;
  contact: string;
  date: string;
  duration: string;
  roomName: string;
  purpose: string;
}

interface AdminApproveProps {
  formData: FormData;
}

const AdminApprove: React.FC<AdminApproveProps> = ({ formData }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleShowDetails = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // สร้างอ็อบเจ็กต์เพื่อแมพห้องกับ URL ของภาพ
  const roomImages: { [key: string]: string } = {
    A: 'https://via.placeholder.com/250?text=Room+A',
    B: 'https://via.placeholder.com/250?text=Room+B',
    C: 'https://via.placeholder.com/250?text=Room+C',
  };

  return (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'row', maxWidth: 800, margin: 'px auto', borderRadius: 2, boxShadow: 2 }}>
      
      {/* แสดงรูปภาพห้องประชุมด้านซ้าย */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <img 
          src={roomImages[formData.meetingRoom]} 
          alt={`ห้อง ${formData.meetingRoom}`} 
          style={{ width: '200px', borderRadius: 8 }} 
        />
      </div>

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }} gutterBottom>
          Admin Approval
        </Typography>
        
        {/* แสดงข้อมูลการจอง */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
          <strong>ห้อง:</strong> {formData.meetingRoom}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
          <strong>ชื่อหัวข้อประชุม:</strong> {formData.roomName}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
          <strong>ชื่อ:</strong> {formData.name}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
          <strong>รหัสนิสิต:</strong> {formData.studentId}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
          <strong>วันที่:</strong> {formData.date}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
          <strong>ระยะเวลา:</strong> {formData.duration} นาที
        </Typography>
        <Button variant="contained" color="primary" onClick={handleShowDetails} sx={{ marginTop: 2 }}>
          แสดงรายละเอียด
        </Button>
      </CardContent>

      <Dialog open={showPopup} onClose={handleClosePopup} sx={{ padding: 2 }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1976d2' }}>รายละเอียดทั้งหมด</DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <Card variant="outlined" sx={{ padding: 2, borderRadius: 1, boxShadow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
              ข้อมูลการจอง
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
              <strong>ห้อง:</strong> {formData.meetingRoom}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
              <strong>ชื่อหัวข้อประชุม:</strong> {formData.roomName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
              <strong>ชื่อ:</strong> {formData.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
              <strong>รหัสนิสิต:</strong> {formData.studentId}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
              <strong>เบอร์โทร:</strong> {formData.contact}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
              <strong>วันที่:</strong> {formData.date}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
              <strong>ระยะเวลา:</strong> {formData.duration} นาที
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
              <strong>วัตถุประสงค์:</strong> {formData.purpose}
            </Typography>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AdminApprove;
