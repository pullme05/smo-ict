import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginModal from './components/Login/LoginModel';
import UserRoutes from './Routes/UserRouter';
import AdminRoutes from './Routes/AdminRoutes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

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
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', adminLogin.toString());
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
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
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes isAdmin={isAdmin} />} />
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
