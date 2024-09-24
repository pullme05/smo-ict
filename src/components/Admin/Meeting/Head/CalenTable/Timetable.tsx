import React from 'react';
import { Calendar, momentLocalizer, Views, View, NavigateAction } from 'react-big-calendar'; // ใช้ View ตรงๆ
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventModal from './EventModal';
import Toolbar from './Toolbar';
import AddEventBtn from './AddEventBtn';
import { Event as EventType } from './types';

const localizer = momentLocalizer(moment);

const Timetable: React.FC = () => {
  const [events, setEvents] = React.useState<EventType[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [currentEvent, setCurrentEvent] = React.useState<EventType | null>(null);
  const [currentView, setCurrentView] = React.useState<View>(Views.MONTH); // ใช้ View ตรงนี้
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());

  const handleSelectEvent = (event: EventType) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentEvent(null);
  };

  const handleViewChange = (view: View) => { // ใช้ View ตรงนี้
    setCurrentView(view);
  };

  

  const handleShowMore = (events: EventType[], date: Date) => {
    console.log("Showing more events", events, date);
  };

  const handleNavigate = (newDate: Date, view: View, action: NavigateAction) => {
    setCurrentView(view);
    setCurrentDate(newDate);
    
    // เพิ่มการเปลี่ยนแปลงวันที่ตาม action
    if (action === 'PREV') {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    } else if (action === 'NEXT') {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    } else if (action === 'TODAY') {
        setCurrentDate(new Date()); // กลับไปที่วันที่ปัจจุบัน
    }
};

  return (
    <div className="p-4">
      <AddEventBtn setEvents={setEvents} />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800, width: 1500 }}
        views={Object.values(Views)} // ใช้ Object.values เพื่อให้ได้ทุก view
        view={currentView}
        date={currentDate}
        popup={true}
        onNavigate={handleNavigate}
        onSelectEvent={handleSelectEvent}
        
        onShowMore={handleShowMore}
        selectable
        components={{
          toolbar: () => (
            <Toolbar
              handleViewChange={handleViewChange}
              onNavigate={handleNavigate}
              currentDate={currentDate}
            />
          )
        }}
      />
      {showModal && (
        <EventModal event={currentEvent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Timetable;
