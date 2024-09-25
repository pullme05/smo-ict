import React from 'react';
import {
  Calendar,
  momentLocalizer,
  Views,
  View,
  NavigateAction,
  Components,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventModal from './EventModal';
import Toolbar from './Toolbar';
import { Event as CustomEventType } from './types';

const localizer = momentLocalizer(moment);

interface TimetableProps {
  updateSelectionData: (data: {
    roomName: string;
    date: string;
    duration: number;
  }) => void;
}

const Timetable: React.FC<TimetableProps> = ({ updateSelectionData }) => {
  const [events] = React.useState<CustomEventType[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [currentView, setCurrentView] = React.useState<View>(Views.MONTH);

  const [formData, setFormData] = React.useState({
    roomName: '',
    name: '',
    date: currentDate.toISOString().split('T')[0],
    duration: 30,
    participants: 1,
    purpose: '',
  });

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    const selectedDate = new Date(slotInfo.start);
    selectedDate.setHours(0, 0, 0, 0);
    setCurrentDate(selectedDate);
    setFormData((prevData) => ({
      ...prevData,
      date: selectedDate.toLocaleDateString('en-CA'),
    }));
    setShowModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "duration" ? Number(value) : value, // แปลงค่า duration เป็นตัวเลข
    }));
  };

  const handleSubmit = () => {
    const { roomName, duration } = formData;
    const date = currentDate.toLocaleDateString('en-CA'); // เก็บวันที่ในตัวแปร

    // อัปเดตข้อมูลที่ส่งไปยัง Selection
    updateSelectionData({
      roomName,
      date,
      duration,
    });
    setShowModal(false);
    
    // ส่งข้อมูลไปยัง Selection
    const eventModalData = {
      roomName,
      name: formData.name,
      date,
      duration,
    };

    receiveDataFromEventModal(eventModalData);
    updateSelection(eventModalData); // เรียกใช้ฟังก์ชันใหม่ที่สร้างขึ้น
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      roomName: '',
      name: '',
      date: currentDate.toISOString().split('T')[0],
      duration: 30,
      participants: 1,
      purpose: '',
    });
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const handleNavigate = (newDate: Date, view: View, action: NavigateAction) => {
    setCurrentDate(newDate);
    setCurrentView(view);

    if (action === 'TODAY') {
      setCurrentDate(new Date());
    }
  };

  const receiveDataFromEventModal = (data: { roomName: string; name: string; date: string; duration: number; }) => {
    // ทำสิ่งที่คุณต้องการกับข้อมูลที่ได้รับ
    console.log('Received data from EventModal:', data);
  };

  const updateSelection = (data: { roomName: string; name: string; date: string; duration: number; }) => {
    // ส่งข้อมูลไปยัง Selection หรือทำสิ่งที่คุณต้องการ
    console.log('Updating selection with data:', data);
  };

  const components: Components<CustomEventType> = {
    toolbar: () => (
      <Toolbar
        handleViewChange={handleViewChange}
        onNavigate={handleNavigate}
        currentDate={currentDate}
      />
    ),
  };

  return (
    <div className="p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800, width: 1500 }}
        views={Object.values(Views)}
        view={currentView}
        date={currentDate}
        defaultView={Views.MONTH}
        popup={true}
        selectable
        onSelectSlot={handleSelectSlot}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        components={components}
      />
      {showModal && (
        <EventModal 
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          receiveDataFromEventModal={receiveDataFromEventModal} // ส่งฟังก์ชันนี้เข้าไป
        />
      )}
    </div>
  );
};

export default Timetable;
