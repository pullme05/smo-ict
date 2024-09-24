import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/Admin/AdminDashboard';
import CalendarMainAM from '../components/Admin/CalendarAdmin/CalendarMainAM';
import AllNewAM from '../components/Admin/NewsAdmin/AllNewAM';
import { useEffect, useState } from 'react';

const AdminRoutes: React.FC = () => {
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);

  useEffect(() => {
    // ดึงค่า isAdmin จาก localStorage
    const savedAdminStatus = localStorage.getItem('isAdmin');
    if (savedAdminStatus) {
      setAdminStatus(JSON.parse(savedAdminStatus));
    } else {
      setAdminStatus(false);  // ถ้าไม่มีค่าให้ตั้งเป็น false
    }
  }, []);

  if (adminStatus === null) {
    // แสดง Loading หรือ Spinner ขณะเช็คสิทธิ์
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/admin/dashboard"
        element={adminStatus ? <AdminDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/calendar"
        element={adminStatus ? <CalendarMainAM /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/news"
        element={adminStatus ? <AllNewAM /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default AdminRoutes;
