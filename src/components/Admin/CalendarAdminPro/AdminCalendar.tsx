import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event, ToolbarProps, View } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import Modal from 'react-modal';
import { Box, Typography, Button, TextField } from '@mui/material';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root');

interface CustomEvent extends Event {
  _id?: string;
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
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDetails, setNewEventDetails] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);

  // Fetch events from backend on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

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

  const handleAddEvent = async () => {
    if (newEventTitle && selectedSlot) {
      const newEvent = {
        title: newEventTitle,
        start: selectedSlot.start,
        end: selectedSlot.end,
        details: newEventDetails,
      };
      try {
        const response = await axios.post('http://localhost:8000/api/events', newEvent);

        // Fetch updated events after successfully adding a new event
        await fetchEvents();

        console.log('Added Event:', response.data); // Debugging
        closeModal(); // Close modal after adding event
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  };

  const handleDeleteEvent = async (eventToDelete: CustomEvent) => {
    try {
      await axios.delete(`http://localhost:8000/api/events/${eventToDelete._id}`);
      // Fetch updated events after deleting
      await fetchEvents();
      closeModal();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
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
        titleAccessor="title" // Ensure title is displayed
        style={{ height: 700, width: '100%' }}
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
