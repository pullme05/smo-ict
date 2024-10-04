import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import LoginModal from './components/Login/LoginModel';
import UserRoutes from './Routes/UserRouter';
import AdminRoutes from './Routes/AdminRoutes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // ใช้ null เพื่อระบุว่ากำลังโหลดข้อมูลอยู่
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  // ดึงข้อมูลการล็อกอินจาก localStorage เมื่อโหลดหน้าเว็บใหม่
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedAdmin = localStorage.getItem('isAdmin') === 'true';
    
    setIsLoggedIn(storedLoggedIn);
    setIsAdmin(storedAdmin);
  }, []);

  const handleLogin = (adminLogin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(adminLogin);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', adminLogin ? 'true' : 'false');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
  };

  if (isLoggedIn === null) {
    // Return loading screen หรือสัญลักษณ์การโหลดเพื่อรอให้สถานะการล็อกอินถูกกำหนดค่า
    return <div>Loading...</div>;
  }

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
