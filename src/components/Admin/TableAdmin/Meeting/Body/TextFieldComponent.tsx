import React, { useEffect } from 'react';
import FormTextField from './FormTextField';
import { Typography } from '@mui/material';
import useFormHandler from './FormHandler';

interface TextFieldComponentProps {
  selectedData: {
    roomName: string;
    date: string;
    duration: number;
    name: string; 
  };
  onUpdateFormData: (data: { roomName: string; name: string; date: string; duration: number }) => void; 
  receiveDataFromEventModal: (data: { roomName: string; name: string; date: string; duration: number }) => void; 
  updateSelectionData: (data: { roomName: string; name: string; date: string; duration: number }) => void;
  onSubmit: (data: { meetingRoom: string; roomName: string; name: string; studentId: string; contact: string; date: string; duration: number; purpose: string; }) => void; 
}

const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
  selectedData,
  onUpdateFormData,
  receiveDataFromEventModal,
  updateSelectionData,
  onSubmit
}) => {
  const initialFormData = {
    meetingRoom: '',
    name: '',
    studentId: '',
    contact: '',
    date: '',
    duration: 0, // แปลงเป็น 0 แทน string
    roomName: '',
    purpose: '',
    notes: '',
  };

  const {
    formData,
    errors,
    handleChange,
    handleConfirm,
  } = useFormHandler(initialFormData, (data) => {
    const dataToSubmit = {
      meetingRoom: data.meetingRoom,
      roomName: data.roomName,
      name: data.name,
      studentId: data.studentId,
      contact: data.contact,
      date: data.date,
      duration: data.duration as number, // ระบุชนิดให้ชัดเจน
      purpose: data.purpose,
    };

    onUpdateFormData(dataToSubmit);
    updateSelectionData(dataToSubmit);
    onSubmit(dataToSubmit);
  });

  useEffect(() => {
    if (selectedData) {
      const changeValue = (name: string, value: string) => {
        handleChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
      };

      changeValue('roomName', selectedData.roomName);
      changeValue('date', selectedData.date);
      changeValue('duration', selectedData.duration.toString());
      changeValue('name', selectedData.name);

      receiveDataFromEventModal({
        roomName: selectedData.roomName,
        name: selectedData.name,
        date: selectedData.date,
        duration: selectedData.duration,
      });
    }
  }, [selectedData, receiveDataFromEventModal, handleChange]);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    console.log('Form Data:', formData);
    console.log('Errors:', errors);

    const requiredFields = ['meetingRoom', 'roomName', 'studentId', 'name', 'contact', 'date', 'duration', 'purpose'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]); // แปลงประเภทที่นี่

    if (missingFields.length > 0) {
      alert(`กรุณากรอกข้อมูลในช่องต่อไปนี้: ${missingFields.join(', ')}`);
      return; // ยกเลิกการส่งข้อมูลหากมีช่องว่าง
    }

    handleConfirm();
    alert('ข้อมูลถูกส่งเรียบร้อยแล้ว!');
  };

  return (
    <div className="w-[350px] flex-[1.5] bg-[#996610] flex flex-col p-4 rounded-lg m-2">
      <Typography variant="h6" className="text-white mb-4 p-2">แบบฟอร์มจองห้องประชุม</Typography>

      <FormTextField
        label="ห้องประชุม"
        name="meetingRoom"
        value={formData.meetingRoom}
        onChange={handleChange}
        error={!!errors.meetingRoom}
        helperText={errors.meetingRoom}
        select={true}
        options={[
          { value: '', label: 'เลือกห้องประชุม' },
          { value: 'A', label: 'ห้อง A' },
          { value: 'B', label: 'ห้อง B' },
          { value: 'C', label: 'ห้อง C' },
        ]}
      />

      <FormTextField 
        label="หัวข้อการประชุม"
        name="roomName"
        value={formData.roomName}
        onChange={handleChange}
        error={!!errors.roomName}
        helperText={errors.roomName}
      />

      <FormTextField 
        label="รหัสนิสิต"
        name="studentId"
        value={formData.studentId}
        onChange={handleChange}
        error={!!errors.studentId}
        helperText={errors.studentId}
      />

      <FormTextField 
        label="ชื่อผู้จอง"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
      />

      <FormTextField 
        label="อีเมลหรือเบอร์โทรศัพท์"
        name="contact"
        value={formData.contact}
        onChange={handleChange}
        error={!!errors.contact}
        helperText={errors.contact}
      />

      <FormTextField 
        label="วันที่"
        name="date"
        value={formData.date}
        onChange={handleChange}
        error={!!errors.date}
        helperText={errors.date}
        type="date" 
      />

      <FormTextField 
        label="ระยะเวลา (นาที)"
        name="duration"
        value={formData.duration.toString()} // แปลงเป็น string สำหรับการแสดงผล
        onChange={handleChange}
        error={!!errors.duration}
        helperText={errors.duration}
        select
        options={[
          { value: '30', label: '30 นาที' },
          { value: '60', label: '60 นาที' },
          { value: '90', label: '90 นาที' },
        ]}
      />

      <FormTextField 
        label="วัตถุประสงค์"
        name="purpose"
        value={formData.purpose}
        onChange={handleChange}
        error={!!errors.purpose}
        helperText={errors.purpose}
      />

      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">ยืนยัน</button>
    </div>
  );
};

export default TextFieldComponent;
