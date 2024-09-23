import { useState, useEffect } from 'react';
import './App.css';
import Banner from './components/Banner/Banner';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import News from './components/News/News';
import NewsActi from './components/News/NewsActi';
import OurSystem from './components/OurSystem/OurSystem';
import Allnews from './components/News/Allnews/Allnews';
import CalendarMain from './components/Calendar/CalendarMain';
import MemberList from './components/Member/MemberList';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// @ts-ignore
import AdminDashboard from './components/Admin/AdminDashboard'; // Dashboard admin
import LoginModal from './components/Login/LoginModel';
import Heart from './components/OurSystem/Room/MR/Heart.tsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // สถานะล็อกอิน
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // สถานะ admin
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false); // สถานะการเปิดปิด login modal

  // ตรวจสอบการล็อกอินจาก localStorage เมื่อโหลดแอป
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    const storedAdminStatus = localStorage.getItem('isAdmin');
    
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
      if (storedAdminStatus === 'true') {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLogin = (adminLogin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(adminLogin);
    
    // บันทึกสถานะการล็อกอินใน localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', adminLogin.toString());
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);

    // ลบข้อมูลสถานะล็อกอินจาก localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onLoginClick={() => setLoginModalOpen(true)} // เปิด Modal เมื่อต้องการล็อกอิน
      />
      <div className="main-content">
        <Routes>
          {/* เส้นทางสำหรับผู้ใช้งานทั่วไป */}
          <Route
            path="/"
            element={
              <>
                <Banner />
                <OurSystem />
                <News />
                <NewsActi />
              </>
            }
          />
          <Route path="/allnews" element={<Allnews />} />
          <Route path="/Heart" element={<Heart />} />
          <Route path="/CalendarMain" element={<CalendarMain />} />
          <Route path="/MemberList" element={<MemberList />} />

          {/* เส้นทางสำหรับ Admin */}
          <Route
            path="/admin/dashboard"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} // บังคับให้ admin เข้าสู่ระบบก่อน
          />
        </Routes>
      </div>
      <Footer />

      {/* Modal ล็อกอิน */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </Router>
  );
}

export default App;
