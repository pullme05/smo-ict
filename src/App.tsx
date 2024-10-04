import { useState,  } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // เพิ่ม Navigate
import LoginModal from './components/Login/LoginModel';
import UserRoutes from './Routes/UserRouter';
import AdminRoutes from './Routes/AdminRoutes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  const handleLogin = (adminLogin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(adminLogin);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onLoginClick={() => setLoginModalOpen(true)}
      />
      <div className="main-content">
        <Routes>
          {/* Routes สำหรับ User */}
          <Route path="/*" element={<UserRoutes />} />
          
          {/* Routes สำหรับ Admin */}
          <Route 
            path="/admin/*" 
            element={
              isAdmin ? (
                <AdminRoutes isAdmin={isAdmin} />
              ) : (
                <Navigate to="/" replace />  
              )
            } 
          />
        </Routes>
      </div>
      <Footer />
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </Router>
  );
}

export default App;
