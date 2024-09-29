import React from 'react';
import TextFieldComponent from '../../Body/TextFieldComponent';
import useFormValidation from '../../Body/useFormValidation';

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

interface EventModalProps {
  formData: FormData; 
  onChange: (data: FormData) => void; 
  onSubmit: (data: FormData) => void;
  onClose: () => void; 
  errors: { [key: string]: string }; 
}

const EventModal: React.FC<EventModalProps> = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  errors,
}) => {
  const { validateStudentId, validateContact } = useFormValidation(formData); 

  // ประกาศ handleChange ที่นี่
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    console.log("Form field changed:", { name, value }); // ตรวจสอบค่าที่ส่ง
    onChange(updatedFormData); // ส่งข้อมูลที่อัปเดต
  };

  const handleSubmit = () => {
    console.log('Submitting form data in EventModal:', formData); // Log before submit
    onSubmit(formData); // เรียกใช้งาน onSubmit
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 z-60">
        <TextFieldComponent
          formData={formData}
          onChange={handleChange} // ใช้ handleChange ที่นี่
          onSubmit={handleSubmit} // เพิ่ม onSubmit ที่นี่
          onClose={onClose}
          errors={errors} 
          validateStudentId={validateStudentId} 
          validateContact={validateContact} 
        />
      </div>
    </div>
  );
};

export default EventModal;
