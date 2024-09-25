import React from 'react';
import { Views as CalendarViews, NavigateAction } from 'react-big-calendar';
import { Typography } from '@mui/material';

type CalendarViewType = typeof CalendarViews[keyof typeof CalendarViews]; // สร้าง type จาก CalendarViews

interface ToolbarProps {
    currentDate: Date;
    onNavigate: (newDate: Date, view: CalendarViewType, action: NavigateAction) => void; 
    handleViewChange: (view: CalendarViewType) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ currentDate, onNavigate, handleViewChange }) => {
    const handlePrev = () => {
        onNavigate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1), CalendarViews.MONTH, 'PREV');
    };

    const handleNext = () => {
        onNavigate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1), CalendarViews.MONTH, 'NEXT');
    };

    const handleToday = () => {
        onNavigate(new Date(), CalendarViews.MONTH, 'TODAY');
    };

    return (
        <div className="flex justify-between p-2">
            <div>
                <button onClick={handlePrev} className="bg-blue-500 m-1 text-white p-2 rounded">Prev</button>
                <button onClick={handleToday} className="bg-yellow-500 m-1 text-white p-2 rounded">Today</button>
                <button onClick={handleNext} className="bg-blue-500 m-1 text-white p-2 rounded">Next</button>
            </div>
            <div>
                <Typography variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Typography>
            </div>
            <div>
                <button onClick={() => handleViewChange(CalendarViews.MONTH)} className="bg-blue-500 m-1 text-white p-2 rounded">Month</button>
                <button onClick={() => handleViewChange(CalendarViews.WEEK)} className="bg-blue-500 m-1 text-white p-2 rounded">Week</button>
                <button onClick={() => handleViewChange(CalendarViews.DAY)} className="bg-blue-500 m-1 text-white p-2 rounded">Day</button>
                <button onClick={() => handleViewChange(CalendarViews.AGENDA)} className="bg-blue-500 m-1 text-white p-2 rounded">Agenda</button>
            </div>
        </div>
    );
};

export default Toolbar;
