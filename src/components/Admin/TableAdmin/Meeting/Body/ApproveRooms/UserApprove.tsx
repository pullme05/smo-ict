import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface FormData {
  meetingRoom: string;
  name: string;
  studentId: string;
  date: string;
  roomName: string;
}

interface UserApproveProps {
  formData: FormData;
}

const UserApprove: React.FC<UserApproveProps> = ({ formData }) => {
  return (
    <Card variant="outlined" sx={{ maxWidth: 400, margin: '20px auto', borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }} gutterBottom>
          User Approval
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: '500' }}>
          <strong>ชื่อหัวข้อประชุม:</strong> {formData.roomName}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: '500' }}>
          <strong>ชื่อ:</strong> {formData.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: '500' }}>
          <strong>รหัสนิสิต:</strong> {formData.studentId}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: '500' }}>
          <strong>วันที่:</strong> {formData.date}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: '500', color: '#f44336' }}>
          <strong>สถานะ:</strong> กำลังรออนุมัติ
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserApprove;
