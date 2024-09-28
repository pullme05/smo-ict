import React from 'react';
import TextFieldComponent from '../../Body/TextFieldComponent';
import useFormValidation from '../../Body/useFormValidation';

interface EventModalProps {
  formData: {
    meetingRoom: string;
    name: string;
    studentId: string;
    contact: string;
    date: string;
    duration: string; // changed to string to match TextFieldComponent
    roomName: string;
    purpose: string;
  };
  onChange: (data: {
    meetingRoom: string;
    name: string;
    studentId: string;
    contact: string;
    date: string;
    duration: string; // changed to string
    roomName: string;
    purpose: string;
  }) => void;
  onSubmit: () => void;
  onClose: () => void;
  errors: { [key: string]: string }; // added errors prop
}

const EventModal: React.FC<EventModalProps> = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  errors,
}) => {
  const { validateStudentId, validateContact } = useFormValidation(formData); // เรียกใช้ฟังก์ชันการตรวจสอบ

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 z-60">
        <TextFieldComponent
          formData={formData}
          onChange={handleChange}
          onSubmit={onSubmit}
          onClose={onClose}
          errors={errors} // pass errors to TextFieldComponent
          validateStudentId={validateStudentId} // ส่ง validateStudentId
          validateContact={validateContact} // ส่ง validateContact
        />
      </div>
    </div>
  );
};

export default EventModal;
