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
import TextFieldComponent from '../../Body/TextFieldComponent';
import { Event as CustomEventType } from './types';

const localizer = momentLocalizer(moment);

interface TimetableProps {
  updateSelectionData: (data: {
    roomName: string;
    name: string;  // เปลี่ยนเป็น name ตัวเล็ก
    date: string;
    duration: number;
  }) => void;
}

const Timetable: React.FC<TimetableProps> = ({ updateSelectionData }) => {
  const [events] = React.useState<CustomEventType[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [currentView, setCurrentView] = React.useState<View>(Views.MONTH);
  
  const [selectedData, setSelectedData] = React.useState<{
    roomName: string;
    date: string;
    duration: number;
    name: string;  // ใช้ name ตัวเล็ก
  }>({ roomName: '', name: '', date: '', duration: 30 });

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
    const { roomName, name, duration } = formData;  // เพิ่ม name ที่นี่ด้วย
    const date = currentDate.toLocaleDateString('en-CA');

    updateSelectionData({
      roomName,
      name,  // เพิ่ม name ที่นี่ด้วย
      date,
      duration,
    });

    const eventModalData = {
      roomName,
      name: formData.name,  // เพิ่ม name ที่นี่ด้วย
      date,
      duration,
    };

    updateSelection(eventModalData);
    setShowModal(false);
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
    console.log('Received data from EventModal:', data);
  };

  const updateSelection = (data: { roomName: string; name: string; date: string; duration: number; }) => {
    setSelectedData({
      roomName: data.roomName,
      name: data.name,
      date: data.date,
      duration: data.duration,
    });
  };

  // ฟังก์ชันสำหรับอัพเดตข้อมูล
  const handleUpdateFormData = (data: { roomName: string; name: string; date: string; duration: number; }) => {
    setSelectedData(data);
    // ทำการอัพเดตข้อมูลเพิ่มเติมที่จำเป็น
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
    <div className="w-5/6 flex flex-col md:flex-row p-4">
      <div className="flex-1">
        <Calendar 
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 800 }}
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
      </div>

      {/* เช็คว่าเปิด modal อยู่หรือไม่ ถ้าเปิดให้ซ่อน Selection */}
      {showModal ? (
        <EventModal 
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          receiveDataFromEventModal={receiveDataFromEventModal} 
        />
      ) : (
        <div className="mt-4">
          <TextFieldComponent 
            selectedData={selectedData} 
            onUpdateFormData={handleUpdateFormData} 
            receiveDataFromEventModal={receiveDataFromEventModal} 
            updateSelectionData={updateSelectionData} 
          />
        </div>
      )}
    </div>
  );
};

export default Timetable;
