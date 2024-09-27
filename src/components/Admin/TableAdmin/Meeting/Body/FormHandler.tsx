import { useState } from 'react';

interface FormData {
  meetingRoom: string;
  name: string;
  studentId: string;
  contact: string;
  date: string;
  duration: string | number; // ระยะเวลาสามารถเป็น string หรือ number
  roomName: string;
  purpose: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

const FormHandler = (
  initialData: FormData,
  onSubmit: (data: FormData) => void
) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // การตรวจสอบข้อมูลสำหรับ studentId
    if (name === 'studentId') {
      const isNumeric = /^\d+$/.test(value);
      const isValidLength = value.length <= 8;

      if (!isNumeric) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          studentId: 'กรุณากรอกเป็นตัวเลขเท่านั้น',
        }));
      } else if (!isValidLength) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          studentId: 'กรุณากรอกไม่เกิน 8 หลัก',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          studentId: '',
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleConfirm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const fieldsToValidate: (keyof FormData)[] = [
      'meetingRoom',
      'name',
      'studentId',
      'contact',
      'date',
      'duration',
      'roomName',
      'purpose',
    ];

    fieldsToValidate.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'กรุณากรอกข้อมูล';
        isValid = false;
      }
    });

    // ตรวจสอบ studentId
    if (formData.studentId.length > 8 || !/^\d+$/.test(formData.studentId)) {
      newErrors.studentId = 'กรุณากรอกเป็นตัวเลขและไม่เกิน 8 หลัก';
      isValid = false;
    }

    if (isValid) {
      onSubmit(formData);
      setFormData(initialData); // รีเซ็ตข้อมูลในฟอร์ม
    } else {
      setErrors(newErrors);
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleConfirm,
  };
};

export default FormHandler;
