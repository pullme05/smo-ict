import Logo from "../../assets/smoictmain.png";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Button } from "@mui/material";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <nav className="sticky top-0 z-20 bg-white text-smoIct">
      {/* Top bar */}
      <div className="flex justify-center items-center py-1 bg-smoIct text-white text-sm">
        <p>Student Club Of Information And Communication Technology University Of Phayao</p>
      </div>
      {/* Navbar */}
      <div className="py-2">
        <div className="container mx-auto flex items-center justify-between px-6 relative">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <img src={Logo} alt="logosmo" height={60} width={60} />
              <span className="text-xl font-bold tracking-tight text-smoIct">SMOICT</span>
            </a>
          </div>
          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-6 items-center justify-center flex-grow">
            <a href="#เกี่ยวกับเรา" className="hover:text-yellow-500 transition duration-300">เกี่ยวกับเรา</a>
            <a href="#ระบบของเรา" className="hover:text-yellow-500 transition duration-300">ระบบของเรา</a>
            <a href="#ข่าวสาร" className="hover:text-yellow-500 transition duration-300">ข่าวสาร</a>
            <a href="#ติดต่อเรา" className="hover:text-yellow-500 transition duration-300">ติดต่อเรา</a>
          </nav>
          {/* Login Button and Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              className="px-4 py-2 rounded-lg font-medium tracking-tight"
              variant="outlined" href="/ล็อคอิน"
              sx={{
                color: '#996600',
                borderColor: '#996600',
                '&:hover': {
                  backgroundColor: '#996600',
                  color: '#fff',
                },
              }}>ล็อคอิน
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
          {/* Mobile Menu Icon */}
          <div className="flex md:hidden">
            <MenuIcon className="h-8 w-8 text-smoIct cursor-pointer" onClick={toggleMenu} />
          </div>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed top-12 right-0 w-4/5 max-w-sm h-[calc(100vh-3rem)] bg-white bg-opacity-95 text-smoIct p-5 backdrop-blur-lg shadow-lg z-20 overflow-y-auto flex flex-col">
            {/* Header with Logo, Close Button, and Icons */}
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
            {/* Navigation Links */}
            <nav className="flex flex-col items-center space-y-4 flex-grow">
              <a href="#เกี่ยวกับเรา" className="hover:text-yellow-500 text-lg font-medium transition duration-300 w-full text-center py-3">
                เกี่ยวกับเรา
              </a>
              <a href="#ระบบของเรา" className="hover:text-yellow-500 text-lg font-medium transition duration-300 w-full text-center py-3">
                ระบบของเรา
              </a>
              <a href="#ข่าวสาร" className="hover:text-yellow-500 text-lg font-medium transition duration-300 w-full text-center py-3">
                ข่าวสาร
              </a>
              <a href="#ติดต่อเรา" className="hover:text-yellow-500 text-lg font-medium transition duration-300 w-full text-center py-3">
                ติดต่อเรา
              </a>
            </nav>
            <Button
              className="w-full px-6 py-3 rounded-lg font-medium tracking-tight mt-4"
              variant="outlined"
              sx={{
                color: '#996600',
                borderColor: '#996600',
                '&:hover': {
                  backgroundColor: '#996600',
                  color: '#fff',
                },
              }}>
              ล็อคอิน
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
 