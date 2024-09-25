import React, { useState } from 'react';
import { Calendar, momentLocalizer, Event, ToolbarProps, View } from 'react-big-calendar'; // นำเข้า View ด้วย

import moment from 'moment';
import Modal from 'react-modal';
import { Box, Typography, Button, TextField } from '@mui/material';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // remove this and use tailwind for calendar styles

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root');

interface CustomEvent extends Event {
  details?: string;
}

const CustomToolbar: React.FC<ToolbarProps> = ({ label, onNavigate, onView }) => {
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outlined"
              sx={{
                borderColor: '#996600',
                color: '#996600',
                '&:hover': {
                  backgroundColor: '#996600',
                  color: '#fff',
                },
              }}
            onClick={() => onNavigate('PREV')}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#996600',
              color: '#996600',
              '&:hover': {
                backgroundColor: '#996600',
                color: '#fff',
              },
            }}
            onClick={() => onNavigate('TODAY')}
          >
            Today
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#996600',
              color: '#996600',
              '&:hover': {
                backgroundColor: '#996600',
                color: '#fff',
              },
            }}
            onClick={() => onNavigate('NEXT')}
          >
            Next
          </Button>
        </div>
        <Typography variant="h5" className="text-[#996600] font-bold">
          {label}
        </Typography>
        <div className="flex space-x-2">
          {['month', 'week', 'day', 'agenda'].map(view => (
            <Button
              key={view}
              variant="outlined"
              sx={{
                borderColor: '#996600',
                color: '#996600',
                '&:hover': {
                  backgroundColor: '#996600',
                  color: '#fff',
                },
              }}
              onClick={() => onView(view as View)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    );
  };
  

const AdminCalendar: React.FC = () => {
  const [events, setEvents] = useState<CustomEvent[]>([
    {
      title: 'Watch movie',
      start: new Date(2022, 7, 8),
      end: new Date(2022, 7, 8),
      details: 'Watching movie with friends',
    },
    {
      title: 'Play game',
      start: new Date(2022, 7, 8),
      end: new Date(2022, 7, 8),
      details: 'Playing games online',
    },
    {
      title: 'Video upload',
      start: new Date(2022, 7, 9),
      end: new Date(2022, 7, 9),
      details: 'Uploading a YouTube video',
    },
    {
      title: 'Watch money heist',
      start: new Date(2022, 7, 17),
      end: new Date(2022, 7, 17),
      details: 'Watching Money Heist series',
    },
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDetails, setNewEventDetails] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);

  const openModal = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setNewEventTitle('');
    setNewEventDetails('');
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const handleAddEvent = () => {
    if (newEventTitle && selectedSlot) {
      setEvents(prevEvents => [
        ...prevEvents,
        {
          title: newEventTitle,
          start: selectedSlot.start,
          end: selectedSlot.end,
          details: newEventDetails,
        },
      ]);
    }
    closeModal();
  };

  const handleDeleteEvent = (eventToDelete: CustomEvent) => {
    setEvents(prevEvents => prevEvents.filter(event => event !== eventToDelete));
    closeModal();
  };

  return (
    <div className="h-screen p-4">
      <Box sx={{ backgroundColor: '#996600', color: '#fff', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>ปฏิทิน</Typography>
      </Box>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700, width: '100%' }} // Adjust the height to fit better
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
        selectable
        onSelectSlot={openModal}
        onSelectEvent={event => {
          setSelectedEvent(event as CustomEvent);
          setModalIsOpen(true);
        }}
        components={{
          toolbar: CustomToolbar, // Use the custom toolbar
        }}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <Box sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px' }}>
          {selectedEvent ? (
            <div>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#996600', marginBottom: '10px' }}>
                {selectedEvent.title}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: '20px', color: '#333333' }}>
                {selectedEvent.details || 'No details available'}
              </Typography>
              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ backgroundColor: '#ff5050', '&:hover': { backgroundColor: '#ff3333' } }}
                onClick={() => handleDeleteEvent(selectedEvent)}
              >
                ลบ
              </Button>
            </div>
          ) : (
            <div>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#996600', marginBottom: '10px' }}>
                เพิ่มกิจกรรม
              </Typography>
              <TextField
                label="Event Title"
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
                fullWidth
                sx={{ marginBottom: '20px', '& .MuiInputLabel-root': { color: '#996600' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#996600' } } }}
              />
              <TextField
                label="Event Details"
                value={newEventDetails}
                onChange={e => setNewEventDetails(e.target.value)}
                multiline
                rows={4}
                fullWidth
                sx={{ marginBottom: '20px', '& .MuiInputLabel-root': { color: '#996600' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#996600' } } }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#6699cc', color: '#fff', '&:hover': { backgroundColor: '#336699' } }}
                onClick={handleAddEvent}
              >
                เพิ่ม
              </Button>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default AdminCalendar;
