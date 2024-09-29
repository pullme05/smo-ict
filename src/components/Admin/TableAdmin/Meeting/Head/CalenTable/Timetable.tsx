import React, { useState, useEffect } from 'react';
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
import FormDataDisplay from '../../Body/ApproveRooms/FormDataDisplay';

const localizer = momentLocalizer(moment);

interface TimetableProps {
  updateSelectionData: (data: {
    meetingRoom: string;
    name: string; 
    studentId: string;
    contact: string;
    date: string;
    duration: string;
    roomName: string;
    purpose: string;
  }) => void;
}

const Timetable: React.FC<TimetableProps> = ({ updateSelectionData }) => {
  const [events] = useState<CustomEventType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);

  const [formData, setFormData] = useState({
    meetingRoom: '',
    name: '',
    studentId: '',
    contact: '',
    date: currentDate.toISOString().split('T')[0],
    duration: '30',
    roomName: '',
    purpose: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedData, setSubmittedData] = useState<{
    meetingRoom: string;
    name: string;
    studentId: string;
    contact: string;
    date: string;
    duration: string;
    roomName: string;
    purpose: string;
  } | null>(null); // กำหนดประเภทให้ชัดเจน

  // useEffect เพื่ออัปเดต date ใน formData เมื่อ currentDate เปลี่ยน
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      date: currentDate.toLocaleDateString('en-CA'), // ใช้ 'en-CA' สำหรับ 'YYYY-MM-DD'
    }));
  }, [currentDate]);
  

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    const selectedDate = new Date(slotInfo.start);
    selectedDate.setHours(0, 0, 0, 0);
    setCurrentDate(selectedDate);
    setShowModal(true);
  };

  const handleSubmit = () => {
    const { meetingRoom, name, studentId, contact, date, duration, roomName, purpose } = formData;

    const newErrors: { [key: string]: string } = {};
    if (!meetingRoom) newErrors.meetingRoom = 'กรุณาเลือกห้อง.';
    if (!name) newErrors.name = 'กรุณากรอกชื่อ.';
    if (!studentId) newErrors.studentId = 'กรุณากรอกรหัสนิสิต.';
    if (!contact) newErrors.contact = 'กรุณากรอกเบอร์โทรที่ติดต่อ.';
    if (!date) newErrors.date = 'กรุณากรอกวันที่.';
    if (!duration) newErrors.duration = 'กรุณาเลือกระยะเวลา.';
    if (!roomName) newErrors.roomName = 'กรุณากรอกหัวข้อประชุม.';
    if (!purpose) newErrors.purpose = 'กรุณากรอกวัตถุประสงค์การจองห้อง.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; 
    }

    console.log('Submitting formData:', formData);

    updateSelectionData({
      meetingRoom,
      name,
      studentId,
      contact,
      date,
      duration,
      roomName,
      purpose,
    });

    setSubmittedData(formData); // เก็บข้อมูลที่ส่ง
    console.log('Submitted data for FormDataDisplay:', formData);

    setShowModal(false);
  };  

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      meetingRoom: '',
      name: '',
      studentId: '',
      contact: '',
      date: currentDate.toISOString().split('T')[0],
      duration: '30',
      roomName: '',
      purpose: '',
    });
    setErrors({});
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

      {showModal && (
        <EventModal 
          formData={formData}
          onChange={(data) => setFormData(data)}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          errors={errors}
        />
      )}

      {submittedData && <FormDataDisplay data={submittedData} />} {/* แสดงข้อมูลที่ส่ง */}
    </div>
  );
};

export default Timetable;
