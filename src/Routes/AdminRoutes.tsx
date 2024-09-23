import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/Admin/AdminDashboard';
import CalendarMainAM from '../components/Admin/CalendarAdmin/CalendarMainAM';  
import AllNewAM from '../components/Admin/NewsAdmin/AllNewAM'

interface AdminRoutesProps {
  isAdmin: boolean;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ isAdmin }) => (
  <Routes>
    <Route
      path="/admin/dashboard"
      element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
    />
    <Route
      path="/admin/calendar"
      element={isAdmin ? <CalendarMainAM /> : <Navigate to="/" />}
    />
    <Route
      path="/admin/news"
      element={isAdmin ? <AllNewAM /> : <Navigate to="/" />}  
    />
  </Routes>
);

export default AdminRoutes;
