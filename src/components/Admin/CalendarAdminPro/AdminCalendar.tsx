import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import Modal from 'react-modal';
import { Box, Typography, Button, TextField } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'chart.js/auto';

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root');

interface CustomEvent extends Event {
  _id?: string;
  details?: string;
}

const AdminCalendar: React.FC = () => {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDetails, setNewEventDetails] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [newEventEndDate, setNewEventEndDate] = useState<Date | null>(null);
  const [monthlySummary, setMonthlySummary] = useState<Record<string, CustomEvent[]>>({});
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/events');
      const eventData = response.data;
      setEvents(eventData);
      calculateMonthlySummary(eventData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const calculateMonthlySummary = (events: CustomEvent[]) => {
    const summary = events.reduce((acc: Record<string, CustomEvent[]>, event) => {
      const month = moment(event.start).format('MMMM YYYY');
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(event);
      return acc;
    }, {});

    setMonthlySummary(summary);
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
        await axios.post('http://localhost:8000/api/events', newEvent);
        await fetchEvents();
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

  const getChartData = () => {
    const labels = Object.keys(monthlySummary);
    const data = Object.values(monthlySummary).map((events) => events.length);

    const backgroundColors = labels.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));

    return {
      labels,
      datasets: [
        {
          label: 'จำนวนกิจกรรม',
          data,
          backgroundColor: backgroundColors.slice(0, data.length),
        },
      ],
    };
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Display integers only
        },
      },
    },
  };

  const renderEventDetails = (month: string, events: CustomEvent[]) => {
    return (
      <div key={month} style={{ marginBottom: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
          {month} - {events.length} กิจกรรม
        </Typography>
        {events.map((event, index) => (
          <Typography key={index} variant="body1" sx={{ marginBottom: '5px' }}>
            {event.title} - {moment(event.start).format('DD/MM/YYYY')}
          </Typography>
        ))}
        <hr style={{ marginTop: '20px', marginBottom: '20px', borderColor: '#996600' }} />
      </div>
    );
  };

  return (
    <div className="h-screen p-4" style={{ overflowY: 'auto' }}>
      <Box
        sx={{
          backgroundColor: '#996600',
          color: '#fff',
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          ปฏิทิน
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#fff',
            color: '#996600',
            position: 'absolute',
            right: 10,
          }}
          onClick={() => setSummaryModalOpen(true)}
        >
          ดูสรุปกิจกรรมรายเดือน
        </Button>
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
        onSelectEvent={(event) => {
          setSelectedEvent(event as CustomEvent);
          setModalIsOpen(true);
        }}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        shouldCloseOnOverlayClick={true}
      >
        <div className="absolute inset-0" onClick={closeModal} style={{ backgroundColor: 'transparent' }} />
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '400px',
            zIndex: 50,
          }}
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
                onChange={(e) => setNewEventTitle(e.target.value)}
                fullWidth
                sx={{
                  marginBottom: '20px',
                  '& .MuiInputLabel-root': { color: '#996600' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#996600' } },
                }}
              />
              <TextField
                label="รายละเอียดกิจกรรม"
                value={newEventDetails}
                onChange={(e) => setNewEventDetails(e.target.value)}
                fullWidth
                multiline
                rows={4}
                sx={{
                  marginBottom: '20px',
                  '& .MuiInputLabel-root': { color: '#996600' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#996600' } },
                }}
              />
              <Button variant="contained" sx={{ backgroundColor: '#996600', width: '100%' }} onClick={handleAddEvent}>
                เพิ่มกิจกรรม
              </Button>
            </div>
          )}
        </Box>
      </Modal>

      <Modal
        isOpen={summaryModalOpen}
        onRequestClose={() => setSummaryModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        shouldCloseOnOverlayClick={true}
      >
        <div className="absolute inset-0" onClick={() => setSummaryModalOpen(false)} style={{ backgroundColor: 'transparent' }} />
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '800px',
            maxHeight: '80%',
            overflowY: 'auto',
            zIndex: 50,
          }}
        >
          {/* แสดงกราฟ Bar อยู่ด้านบน */}
          <Box sx={{ marginBottom: '40px' }}>
            <Bar data={getChartData()} options={options} />
          </Box>

          {/* ข้อมูลกิจกรรมรายเดือนอยู่ด้านล่าง */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#996600', marginBottom: '20px' }}>
            สรุปกิจกรรมรายเดือน
          </Typography>
          {Object.entries(monthlySummary).map(([month, events]) => renderEventDetails(month, events))}
        </Box>
      </Modal>
    </div>
  );
};

export default AdminCalendar;
