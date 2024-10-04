import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import { Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root');

interface CustomEvent extends Event {
  details?: string;
}

const CustomToolbar: React.FC<any> = ({ label, onNavigate, onView }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="space-x-2">
        <Button
          variant="outlined"
          className="py-2 px-4 rounded"
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
          className="py-2 px-4 rounded"
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
          className="py-2 px-4 rounded"
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

      <Typography variant="h5" className="text-lg font-bold">
        {label}
      </Typography>

      <div className="space-x-2">
        <Button
          variant="outlined"
          className="py-2 px-4 rounded"
          sx={{
            borderColor: '#996600',
            color: '#996600',
            '&:hover': {
              backgroundColor: '#996600',
              color: '#fff',
            },
          }}
          onClick={() => onView('month')}
        >
          Month
        </Button>
        <Button
          variant="outlined"
          className="py-2 px-4 rounded"
          sx={{
            borderColor: '#996600',
            color: '#996600',
            '&:hover': {
              backgroundColor: '#996600',
              color: '#fff',
            },
          }}
          onClick={() => onView('agenda')}
        >
          Agenda
        </Button>
      </div>
    </div>
  );
};

const UserCalendar: React.FC = () => {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);

  // ดึงข้อมูลกิจกรรมจาก Backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="h-screen p-4">
      <Box sx={{ backgroundColor: '#996600', color: '#fff', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>ปฏิทินกิจกรรม</Typography>
      </Box>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700, width: '100%' }}
        defaultView="month"
        views={['month', 'agenda']} // แสดงเฉพาะ month และ agenda
        selectable={false}
        components={{
          toolbar: CustomToolbar,
        }}
        onSelectEvent={event => {
          setSelectedEvent(event as CustomEvent);
          setModalIsOpen(true);
        }}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <Box sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px' }}>
          {selectedEvent && (
            <div>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#996600', marginBottom: '10px' }}>
                {selectedEvent.title}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: '20px', color: '#333333' }}>
                {selectedEvent.details || 'No details available'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ backgroundColor: '#6699cc', color: '#fff' }}
                onClick={closeModal}
              >
                ปิด
              </Button>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default UserCalendar;
