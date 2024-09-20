import React from 'react';

const CalendarDays: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center' }}>
      {days.map(day => (
        <div key={day}>{day}</div>
      ))}
    </div>
  );
};

export default CalendarDays;
