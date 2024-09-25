import React from 'react';
import { TextField, MenuItem } from '@mui/material'; // นำเข้า MenuItem ด้วย

interface FormTextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error: boolean;
  helperText?: string;
  disabled?: boolean; // เพิ่มตัวนี้เพื่อรองรับการใช้งาน disabled
  type?: string; // เพิ่มเพื่อให้รองรับประเภทอื่น ๆ
  multiline?: boolean; 
  rows?: number;
  select?: boolean; 
  options?: Array<{ value: string | number; label: string }>; // สำหรับ select
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  disabled,
  type,
  multiline,
  rows,
  select,
  options,
}) => {
  if (select && options) {
    return (
      <TextField
        select
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        disabled={disabled} // ใช้งาน disabled ที่นี่
        fullWidth
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      disabled={disabled} // ใช้งาน disabled ที่นี่
      type={type}
      multiline={multiline}
      rows={rows}
      fullWidth
    />
  );
};

export default FormTextField;
