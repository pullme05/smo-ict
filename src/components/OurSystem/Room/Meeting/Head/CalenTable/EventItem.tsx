import React from 'react';

interface EventItemProps {
  event: {
    title: string;
    start: Date;
    end: Date;
  };
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  return (
    <div className="bg-blue-500 text-white p-2 rounded">
      <strong>{event.title}</strong>
      <p>{event.start.toLocaleString()}</p>
    </div>
  );
};

export default EventItem;
