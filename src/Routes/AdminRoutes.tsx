import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminCalendar from '../components/Admin/CalendarAdminPro/AdminCalendar';
import { useEffect, useState } from 'react';
import MeetingRoomAM from '../components/Admin/MeetingRoomAm/MeetingRoomAm';
import NewsAM from '../components/Admin/NewsAdmin/NewsAM'
import AdminMem from '../components/Admin/MemberAdmin/AdminMem'

interface AdminRoutesProps {
  isAdmin: boolean;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ isAdmin }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Removed 'storedIsAdmin' declaration as it's not used
    setLoading(false);
  }, [isAdmin]);

  if (loading) {
    return <div>Loading...</div>; // แสดง Loading จนกว่า state ของ admin จะถูกเช็ค
  }

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/AdminCalendar"
        element={isAdmin ? <AdminCalendar /> : <Navigate to="/" />}
      />
      <Route
        path="/heartAM"
        element={isAdmin ? <MeetingRoomAM /> : <Navigate to="/" />}
      />
      <Route
        path="/Amem"
        element={isAdmin ? <AdminMem /> : <Navigate to="/" />}
      />
      <Route
        path="/NewsAM"
        element={isAdmin ? <NewsAM /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default AdminRoutes;
