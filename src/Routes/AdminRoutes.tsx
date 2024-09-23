import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/Admin/AdminDashboard';

interface AdminRoutesProps {
  isAdmin: boolean;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ isAdmin }) => (
  <Routes>
    <Route
      path="/admin/dashboard"
      element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
    />
  </Routes>
);

export default AdminRoutes;
