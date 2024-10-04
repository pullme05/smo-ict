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
  const allowedViews = ['month', 'agenda']; 

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
          ย้อนกลับ
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
          วันนี้
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
          ถัดไป
        </Button>
      </div>
      <Typography variant="h5" className="text-[#996600] font-bold">
        {label}
      </Typography>
      <div className="flex space-x-2">
        {allowedViews.map(view => (
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
  const [newEventEndDate, setNewEventEndDate] = useState<Date | null>(null); 

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
    setNewEventEndDate(slotInfo.end); 
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const handleAddEvent = async () => {
    if (newEventTitle && selectedSlot && newEventEndDate) {
      const adjustedEndDate = new Date(newEventEndDate);
      adjustedEndDate.setHours(23, 59, 59); 

      const newEvent = {
        title: newEventTitle,
        start: selectedSlot.start,
        end: adjustedEndDate,
        details: newEventDetails,
      };

      try {
        const response = await axios.post('http://localhost:8000/api/events', newEvent);
        await fetchEvents();
        console.log('Added Event:', response.data); 
        closeModal(); 
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  };

  const handleDeleteEvent = async (eventToDelete: CustomEvent) => {
    try {
      await axios.delete(`http://localhost:8000/api/events/${eventToDelete._id}`);
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
        titleAccessor="title"
        style={{ height: 700, width: '100%' }}
        defaultView="month"
        views={['month', 'agenda']} 
        selectable
        onSelectSlot={openModal}
        onSelectEvent={event => {
          setSelectedEvent(event as CustomEvent);
          setModalIsOpen(true);
        }}
        components={{
          toolbar: CustomToolbar,
          event: ({ event }) => (
            <div className="flex justify-center items-center h-full">
              <span className="text-center">{event.title}</span>
            </div>
          ), 
        }}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        shouldCloseOnOverlayClick={true} 
      >
        <div
          className="absolute inset-0"
          onClick={closeModal} 
          style={{ backgroundColor: 'transparent' }}
        />
        <Box
          onClick={(e) => e.stopPropagation()} 
          sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', zIndex: 50 }}
        >
          {selectedEvent ? (
            <div>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#996600', marginBottom: '10px' }}>
                {selectedEvent.title}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: '20px', color: '#333333' }}>
                {selectedEvent.details || 'ไม่มีรายละเอียด'}
              </Typography>
              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ backgroundColor: '#ff5050', '&:hover': { backgroundColor: '#ff3333' } }}
                onClick={() => handleDeleteEvent(selectedEvent)}
              >
                ลบกิจกรรม
              </Button>
            </div>
          ) : (
            <div>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#996600', marginBottom: '10px' }}>
                เพิ่มกิจกรรม
              </Typography>
              <TextField
                label="ชื่อกิจกรรม"
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
                fullWidth
                sx={{ marginBottom: '20px', '& .MuiInputLabel-root': { color: '#996600' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#996600' } } }}
              />
              <TextField
                label="รายละเอียดกิจกรรม"
                value={newEventDetails}
                onChange={e => setNewEventDetails(e.target.value)}
                multiline
                rows={4}
                fullWidth
                sx={{ marginBottom: '20px', '& .MuiInputLabel-root': { color: '#996600' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#996600' } } }}
              />
              <TextField
                label="วันสิ้นสุดกิจกรรม"
                type="date"
                value={newEventEndDate ? moment(newEventEndDate).format('YYYY-MM-DD') : ''}
                onChange={e => setNewEventEndDate(new Date(e.target.value))}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ marginBottom: '20px', '& .MuiInputLabel-root': { color: '#996600' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#996600' } } }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#996600', '&:hover': { backgroundColor: '#cc7a00' } }}
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
