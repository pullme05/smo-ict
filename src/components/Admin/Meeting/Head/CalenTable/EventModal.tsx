import React from 'react';

interface EventModalProps {
  event: any;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold">Event Details</h2>
        {event ? (
          <>
            <p>Title: {event.title}</p>
            <p>Start: {event.start.toLocaleString()}</p>
            <p>End: {event.end.toLocaleString()}</p>
          </>
        ) : (
          <p>No event selected</p>
        )}
        <button onClick={onClose} className="mt-4 bg-red-500 text-white p-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default EventModal;
