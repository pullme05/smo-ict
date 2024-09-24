// FormTextField.tsx
import React from 'react';
import { TextField, MenuItem } from '@mui/material';

// กำหนด type ของ props
interface FormTextFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: boolean;
  helperText?: string;
  select?: boolean; // สำหรับกรณีที่เป็น select
  options?: { value: string | number; label: string }[]; // ตัวเลือกสำหรับ select
  type?: string; // สำหรับกรณีที่เป็น input type อื่น ๆ
  multiline?: boolean; // สำหรับกรณีที่เป็น TextArea
  rows?: number; // จำนวนแถวสำหรับ TextArea
}

// สร้างคอมโพเนนต์ FormTextField
const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  select,
  options,
  type = 'text', // ค่าเริ่มต้นเป็น 'text'
  multiline,
  rows,
}) => {
  return (
    <TextField
      label={label} // เปลี่ยนข้อความใน label
      name={name}
      value={value}
      onChange={onChange}
      error={error}
      helperText={error ? '' : helperText} // ไม่แสดงข้อความช่วยถ้ามีข้อผิดพลาด
      select={select}
      type={type} // กำหนด type ที่เหมาะสม
      variant="outlined"
      fullWidth
      multiline={multiline}
      rows={rows}
      InputLabelProps={{
        shrink: type === 'date' || (value !== '' && !error),
        style: { color: error ? 'red' : 'white'  }, // เปลี่ยนสี label ถ้ามีข้อผิดพลาด
      }}
      InputProps={{
        className: 'mb-1',
      }}
    >
      {select &&
        options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default FormTextField;
