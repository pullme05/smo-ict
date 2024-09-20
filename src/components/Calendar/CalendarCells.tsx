import React from 'react';

interface CalendarCellsProps {
  currentDate: Date;
}

const CalendarCells: React.FC<CalendarCellsProps> = ({ currentDate }) => {
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = endDate.getDate();
  const firstDayIndex = startDate.getDay();

  const cells: JSX.Element[] = [];

  // Add empty cells for days before the start of the month
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(<div key={`empty-${i}`}></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(<div key={day} style={{ textAlign: 'center', padding: '10px' }}>{day}</div>);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
      {cells}
    </div>
  );
};

export default CalendarCells;
