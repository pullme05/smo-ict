import React, { useState } from "react";
import Logo from "../../assets/smoictmain.png";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Button } from "@mui/material";
import { Link as ScrollLink } from 'react-scroll';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginModal from '../Login/LoginModel'; // Import LoginModal from the correct path

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigateAndScroll = (sectionId: string) => {
    if (location.pathname !== "/" && sectionId !== 'ติดต่อเรา') {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } else if (sectionId === 'ติดต่อเรา') {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleOpenLoginModal = () => setLoginModalOpen(true);
  const handleCloseLoginModal = () => setLoginModalOpen(false);

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
            <ScrollLink
              to="เกี่ยวกับเรา"
              smooth={true}
              duration={500}
              offset={-80}
              onClick={() => handleNavigateAndScroll('เกี่ยวกับเรา')}
              className="hover:text-yellow-500 transition duration-300 cursor-pointer"
            >
              เกี่ยวกับเรา
            </ScrollLink>
            <ScrollLink
              to="ระบบของเรา"
              smooth={true}
              duration={500}
              offset={-80}
              onClick={() => handleNavigateAndScroll('ระบบของเรา')}
              className="hover:text-yellow-500 transition duration-300 cursor-pointer"
            >
              ระบบของเรา
            </ScrollLink>
            <ScrollLink
              to="ข่าวสาร"
              smooth={true}
              duration={500}
              offset={-80}
              onClick={() => handleNavigateAndScroll('ข่าวสาร')}
              className="hover:text-yellow-500 transition duration-300 cursor-pointer"
            >
              ข่าวสาร
            </ScrollLink>
            <ScrollLink
              to="ติดต่อเรา"
              smooth={true}
              duration={500}
              offset={-80}
              onClick={() => handleNavigateAndScroll('ติดต่อเรา')}
              className="hover:text-yellow-500 transition duration-300 cursor-pointer"
            >
              ติดต่อเรา
            </ScrollLink>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              className="px-4 py-2 rounded-lg font-medium tracking-tight"
              variant="outlined"
              onClick={handleOpenLoginModal}
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
            <span>|</span>
            <div className="flex space-x-2">
              <div className="bg-smoIct text-white text-xs rounded-full p-2 flex items-center justify-center hover:bg-yellow-500 transition duration-300">
                <NotificationsIcon sx={{ fontSize: 20 }} />
              </div>
              <div className="bg-smoIct text-white text-xs rounded-full p-2 flex items-center justify-center hover:bg-yellow-500 transition duration-300">
                <LanguageIcon sx={{ fontSize: 20 }} />
              </div>
            </div>
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
                <div className="bg-smoIct text-white text-xs rounded-full p-2 flex items-center justify-center hover:bg-yellow-500 transition duration-300">
                  <NotificationsIcon sx={{ fontSize: 20 }} />
                </div>
                <div className="bg-smoIct text-white text-xs rounded-full p-2 flex items-center justify-center hover:bg-yellow-500 transition duration-300">
                  <LanguageIcon sx={{ fontSize: 20 }} />
                </div>
                <CloseIcon className="h-8 w-8 text-smoIct cursor-pointer" onClick={toggleMenu} />
              </div>
            </div>
            <nav className="flex flex-col gap-4">
              <ScrollLink
                to="เกี่ยวกับเรา"
                smooth={true}
                duration={500}
                offset={-80}
                onClick={() => handleNavigateAndScroll('เกี่ยวกับเรา')}
                className="hover:text-yellow-500 transition duration-300 cursor-pointer"
              >
                เกี่ยวกับเรา
              </ScrollLink>
              <ScrollLink
                to="ระบบของเรา"
                smooth={true}
                duration={500}
                offset={-80}
                onClick={() => handleNavigateAndScroll('ระบบของเรา')}
                className="hover:text-yellow-500 transition duration-300 cursor-pointer"
              >
                ระบบของเรา
              </ScrollLink>
              <ScrollLink
                to="ข่าวสาร"
                smooth={true}
                duration={500}
                offset={-80}
                onClick={() => handleNavigateAndScroll('ข่าวสาร')}
                className="hover:text-yellow-500 transition duration-300 cursor-pointer"
              >
                ข่าวสาร
              </ScrollLink>
              <ScrollLink
                to="ติดต่อเรา"
                smooth={true}
                duration={500}
                offset={-80}
                onClick={() => handleNavigateAndScroll('ติดต่อเรา')}
                className="hover:text-yellow-500 transition duration-300 cursor-pointer"
              >
                ติดต่อเรา
              </ScrollLink>
            </nav>
            <div className="mt-5 flex justify-center">
              <Button
                className="px-4 py-2 rounded-lg font-medium tracking-tight"
                variant="outlined"
                onClick={handleOpenLoginModal}
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
            </div>
          </div>
        )}
      </div>
      {/* Use imported LoginModal */}
      <LoginModal open={loginModalOpen} onClose={handleCloseLoginModal} />
    </nav>
  );
};

export default Navbar;
