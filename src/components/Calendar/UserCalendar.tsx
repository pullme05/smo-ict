import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Remove this and use tailwind for custom styles
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Admin/FirebaseConfig'; // แก้ไขเส้นทางให้ถูกต้อง

const localizer = momentLocalizer(moment);

interface CustomEvent extends Event {
  id?: string;
  details?: string;
}

const UserCalendar: React.FC = () => {
  const [events, setEvents] = useState<CustomEvent[]>([]);

  useEffect(() => {
    const eventsRef = collection(db, "events");

    // Fetch events from Firestore and update in real-time
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const updatedEvents = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        start: doc.data().start.toDate(),
        end: doc.data().end.toDate(),
      })) as CustomEvent[];
      setEvents(updatedEvents);
    });

    return () => unsubscribe(); // Cleanup subscription when component unmounts
  }, []);

  return (
    <div className="h-screen p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700, width: '100%' }}
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
      />
    </div>
  );
};

export default UserCalendar;
