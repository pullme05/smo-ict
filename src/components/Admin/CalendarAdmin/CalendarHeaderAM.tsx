import React from 'react';
import { Button, IconButton, Typography, Box } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onToggleView: () => void;
  isListView: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, onPrevMonth, onNextMonth, onToday, onToggleView, isListView }) => {
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
      <Box>
        <IconButton onClick={onPrevMonth}>
          <ArrowBackIos />
        </IconButton>
        <Button 
          variant="outlined" 
          onClick={onToday} 
          sx={{
            color: '#996600', // เปลี่ยนสีตัวอักษร
            borderColor: '#996600', // เปลี่ยนสีกรอบ
            '&:hover': {
              backgroundColor: '#996600', // สีพื้นหลังเมื่อ hover
              color: '#fff', // สีตัวอักษรเมื่อ hover
            }
          }}
        >
          วันนี้
        </Button>
        <IconButton onClick={onNextMonth}>
          <ArrowForwardIos />
        </IconButton>
      </Box>
      <Typography variant="h6">{monthYear}</Typography>
      <Box>
        <Button 
          variant={isListView ? 'outlined' : 'contained'} 
          onClick={onToggleView} 
          sx={{
            color: isListView ? '#996600' : '#fff', // เปลี่ยนสีตัวอักษรตามสถานะ
            backgroundColor: isListView ? 'transparent' : '#996600', // สีพื้นหลังตามสถานะ
            borderColor: '#996600', // เปลี่ยนสีกรอบ
            '&:hover': {
              backgroundColor: isListView ? '#f0f0f0' : '#996600', // สีพื้นหลังเมื่อ hover
              color: isListView ? '#996600' : '#fff', // สีตัวอักษรเมื่อ hover
            }
          }}
        >
          {isListView ? 'เดือน' : 'รายการ'}
        </Button>
      </Box>
    </Box>
  );
};

export default CalendarHeader;
