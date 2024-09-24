import React from 'react';
import { NavigateAction, Views, View } from 'react-big-calendar'; // ใช้ View ตรงๆ
import { Typography } from '@mui/material';

interface ToolbarProps {
    handleViewChange: (view: View) => void; // ใช้ View ตรงนี้
    onNavigate: (newDate: Date, view: View, action: NavigateAction) => void; // ใช้ View ตรงนี้
    currentDate: Date; // รับ currentDate เพื่อแสดงใน toolbar
}

const Toolbar: React.FC<ToolbarProps> = ({ handleViewChange, onNavigate, currentDate }) => {
  return (
    <div className="flex justify-between p-2">
      <div>
        <button onClick={() => onNavigate(new Date(), Views.MONTH, 'PREV')} className="bg-blue-500 m-1 text-white p-2 rounded">Prev</button>
        <button onClick={() => onNavigate(new Date(), Views.MONTH, 'TODAY')} className="bg-yellow-500 m-1 text-white p-2 rounded">Today</button>
        <button onClick={() => onNavigate(new Date(), Views.MONTH, 'NEXT')} className="bg-blue-500 m-1 text-white p-2 rounded">Next</button>
      </div>
      <div>
        <Typography variant="h6" component="div" style={{ fontWeight: 'bold' }}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Typography>
        </div>
      <div>
        <button onClick={() => handleViewChange(Views.MONTH)} className="bg-blue-500 m-1 text-white p-2 rounded">Month</button>
        <button onClick={() => handleViewChange(Views.WEEK)} className="bg-blue-500 m-1 text-white p-2 rounded">Week</button>
        <button onClick={() => handleViewChange(Views.DAY)} className="bg-blue-500 m-1 text-white p-2 rounded">Day</button>
        <button onClick={() => handleViewChange(Views.AGENDA)} className="bg-blue-500 m-1 text-white p-2 rounded">Agenda</button>
      </div>
    </div>
  );
};

export default Toolbar;
