import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AllNewAM from '../components/Admin/NewsAdmin/AllNewAM';
import HeartAM from '../components/Admin/Meeting/HeartAM';
import AdminCalendar from '../components/Admin/CalendarAdminPro/AdminCalendar';
import { useEffect, useState } from 'react';

interface AdminRoutesProps {
  isAdmin: boolean;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ isAdmin }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedIsAdmin = JSON.parse(localStorage.getItem('isAdmin') || 'false');
    if (storedIsAdmin === isAdmin) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [isAdmin]);

  if (loading) {
    return <div>Loading...</div>; // หรือ Loading Spinner อื่น ๆ
  }

  return (
    <Routes>
      <Route
        path="/admin/dashboard"
        element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
      />
      {/* test calendarpro */}
      <Route
        path="/admin/AdminCalendar"
        element={isAdmin ? <AdminCalendar /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/heart"
        element={isAdmin ? <HeartAM /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/news"
        element={isAdmin ? <AllNewAM /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default AdminRoutes;
