import React, { useState } from "react";
import Logo from "../../assets/smoictmain.png";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import QrcodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Button } from "@mui/material";
import { Link as ScrollLink } from 'react-scroll';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, isAdmin, onLogout, onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // ฟังก์ชันเลื่อนไปยังส่วนที่กำหนด
  const scrollToSection = (sectionId: string) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.scrollBy(0, -100); // เลื่อนหน้าต่างขึ้น 100px เพื่อลดการชนของ Navbar
    } else {
      // ลองใหม่หากยังไม่พบ element
      setTimeout(() => scrollToSection(sectionId), 100);
    }
  };

  // ฟังก์ชันที่ใช้เมื่อกดปุ่มสำหรับการเลื่อนหน้า
  const handleNavigateAndScroll = (sectionId: string) => {
    if (location.pathname !== "/" && sectionId !== 'ติดต่อเรา') {
      navigate("/");
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 500);
    } else if (sectionId === 'ติดต่อเรา') {
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  };

  const handleLogout = () => {
    if (location.pathname === '/qrcode') {
      navigate('/');
    }
    onLogout();
  };

  return (
    <nav className="sticky top-0 z-20 bg-white text-smoIct">
      <div className="flex justify-center items-center py-1 bg-smoIct text-white text-sm">
        <p>Student Club Of Information And Communication Technology University Of Phayao</p>
      </div>
      <div className="py-2">
        <div className="container mx-auto flex items-center justify-between px-6 relative">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <img src={Logo} alt="logosmo" height={60} width={60} />
              <span className="text-xl font-bold tracking-tight text-smoIct">SMOICT</span>
            </a>
          </div>

          <nav className="hidden md:flex gap-6 items-center justify-center flex-grow">
            {!isAdmin ? (
              <>
                {/* เอาเกี่ยวกับเราออก */}
                <ScrollLink
                  to="ระบบของเรา"
                  smooth={true}
                  duration={500}
                  offset={-100}
                  onClick={() => handleNavigateAndScroll('ระบบของเรา')}
                  className="hover:text-yellow-500 transition duration-300 cursor-pointer"
                >
                  ระบบของเรา
                </ScrollLink>
                <ScrollLink
                  to="ข่าวสาร"
                  smooth={true}
                  duration={500}
                  offset={-100}
                  onClick={() => handleNavigateAndScroll('ข่าวสาร')}
                  className="hover:text-yellow-500 transition duration-300 cursor-pointer"
                >
                  ข่าวสาร
                </ScrollLink>
                <ScrollLink
                  to="ติดต่อเรา"
                  smooth={true}
                  duration={500}
                  offset={-100}
                  onClick={() => handleNavigateAndScroll('ติดต่อเรา')}
                  className="hover:text-yellow-500 transition duration-300 cursor-pointer"
                >
                  ติดต่อเรา
                </ScrollLink>
              </>
            ) : (
              <>
                <div
                  onClick={() => navigate('/admin/dashboard')}
                  className="hover:text-yellow-500 transition duration-300 cursor-pointer"
                >
                  Admin Dashboard
                </div>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button
                  className="px-4 py-2 rounded-lg font-medium tracking-tight"
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    color: '#996600',
                    borderColor: '#996600',
                    '&:hover': {
                      backgroundColor: '#996600',
                      color: '#fff',
                    },
                  }}
                >
                  ออกจากระบบ
                </Button>
                <span>|</span>
                <div className="flex space-x-2">
                  <div
                    className="bg-smoIct text-white text-xs rounded-full p-2 flex items-center justify-center hover:bg-yellow-500 transition duration-300 cursor-pointer"
                    onClick={() => navigate('/qrcode')}
                  >
                    <QrcodeScannerIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div className="bg-smoIct text-white text-xs rounded-full p-2 flex items-center justify-center hover:bg-yellow-500 transition duration-300">
                    <NotificationsIcon sx={{ fontSize: 20 }} />
                  </div>
                </div>
              </>
            ) : (
              <Button
                className="px-4 py-2 rounded-lg font-medium tracking-tight"
                variant="outlined"
                onClick={onLoginClick}
                sx={{
                  color: '#996600',
                  borderColor: '#996600',
                  '&:hover': {
                    backgroundColor: '#996600',
                    color: '#fff',
                  },
                }}
              >
                ล็อคอิน
              </Button>
            )}
          </div>

          <div className="flex md:hidden">
            <MenuIcon className="h-8 w-8 text-smoIct cursor-pointer" onClick={toggleMenu} />
          </div>
        </div>

        {menuOpen && (
          <div className="fixed top-12 right-0 w-4/5 max-w-sm h-[calc(100vh-3rem)] bg-white bg-opacity-95 text-smoIct p-5 backdrop-blur-lg shadow-lg z-20 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <a href="/" className="flex items-center space-x-2">
                  <img src={Logo} alt="logosmo" height={40} width={40} />
                  <span className="text-lg font-bold">SMOICT</span>
                </a>
              </div>
              <div className="flex items-center space-x-2">
                {isLoggedIn && (
                  <div className="flex space-x-2">
                    <div
                      className="bg-smoIct text-white text-xs rounded-full p-2 flex items-center justify-center hover:bg-yellow-500 transition duration-300 cursor-pointer"
                      onClick={() => navigate('/qrcode')}
                    >
                      <QrcodeScannerIcon sx={{ fontSize: 20 }} />
                    </div>
                    <div className="bg-smoIct text-white text-xs rounded-full p-2 flex items-center justify-center hover:bg-yellow-500 transition duration-300">
                      <NotificationsIcon sx={{ fontSize: 20 }} />
                    </div>
                  </div>
                )}
                <CloseIcon className="h-8 w-8 text-smoIct cursor-pointer" onClick={toggleMenu} />
              </div>
            </div>
            <nav className="flex flex-col space-y-4">
              {!isAdmin ? (
                <>
                  {/* เอาเกี่ยวกับเราออก */}
                  <ScrollLink
                    to="ระบบของเรา"
                    smooth={true}
                    duration={500}
                    offset={-100}
                    onClick={() => {
                      toggleMenu();
                      handleNavigateAndScroll('ระบบของเรา');
                    }}
                    className="hover:text-yellow-500 transition duration-300 cursor-pointer"
                  >
                    ระบบของเรา
                  </ScrollLink>
                  <ScrollLink
                    to="ข่าวสาร"
                    smooth={true}
                    duration={500}
                    offset={-100}
                    onClick={() => {
                      toggleMenu();
                      handleNavigateAndScroll('ข่าวสาร');
                    }}
                    className="hover:text-yellow-500 transition duration-300 cursor-pointer"
                  >
                    ข่าวสาร
                  </ScrollLink>
                  <ScrollLink
                    to="ติดต่อเรา"
                    smooth={true}
                    duration={500}
                    offset={-100}
                    onClick={() => {
                      toggleMenu();
                      handleNavigateAndScroll('ติดต่อเรา');
                    }}
                    className="hover:text-yellow-500 transition duration-300 cursor-pointer"
                  >
                    ติดต่อเรา
                  </ScrollLink>
                </>
              ) : (
                <>
                  <div
                    onClick={() => {
                      toggleMenu();
                      navigate('/admin/dashboard');
                    }}
                    className="hover:text-yellow-500 transition duration-300 cursor-pointer"
                  >
                    Admin Dashboard
                  </div>
                </>
              )}
              <div className="md:hidden flex items-center">
                {isLoggedIn ? (
                  <>
                    <Button
                      className="px-4 py-2 rounded-lg font-medium tracking-tight"
                      variant="outlined"
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      sx={{
                        color: '#996600',
                        borderColor: '#996600',
                        '&:hover': {
                          backgroundColor: '#996600',
                          color: '#fff',
                        },
                      }}
                    >
                      ออกจากระบบ
                    </Button>
                  </>
                ) : (
                  <Button
                    className="px-4 py-2 rounded-lg font-medium tracking-tight"
                    variant="outlined"
                    onClick={() => {
                      onLoginClick();
                      toggleMenu();
                    }}
                    sx={{
                      color: '#996600',
                      borderColor: '#996600',
                      '&:hover': {
                        backgroundColor: '#996600',
                        color: '#fff',
                      },
                    }}
                  >
                    ล็อคอิน
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
