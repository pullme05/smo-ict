import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button } from "@mui/material";
import { AccountCircle, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from 'axios';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (isAdmin: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onLogin }) => {
  const [username, setUsername] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(''); // สำหรับแสดงข้อความผิดพลาด

  // ฟังก์ชันสำหรับจัดการการล็อคอิน
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username,
        password
      });
  
      const user = response.data.user;
  
      // หากล็อกอินสำเร็จ ให้ตรวจสอบว่าเป็น admin หรือไม่
      onLogin(user.role === 'admin'); // ส่งค่า true หาก role เป็น 'admin'
      onClose(); // ปิด modal
    } catch (error) {
      // จัดการกับข้อผิดพลาด
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || 'Login failed');
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ตรวจสอบการล็อคอินจาก localStorage เมื่อโหลดครั้งแรก
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      onLogin(true);
    }
  }, [onLogin]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: '10px',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <div className="flex flex-col items-center">
          <img src="/smoictmain.png" alt="Logo" className="mb-4 w-24 h-24" />
          <h2 id="login-modal-title" style={{ color: '#996600' }} className="text-xl font-bold mb-4">
            LOGIN
          </h2>
        </div>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* แสดงข้อความผิดพลาด */}

        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <AccountCircle sx={{ color: "#996600", marginRight: "8px" }} />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              helperText="ชื่อผู้ใช้งาน"
              autoComplete="off"
            />
          </div>

          <div className="flex items-center">
            <Lock sx={{ color: "#996600", marginRight: "8px" }} />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <div
                    onClick={togglePasswordVisibility}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? (
                      <Visibility sx={{ color: "#996600" }} />
                    ) : (
                      <VisibilityOff sx={{ color: "#996600" }} />
                    )}
                  </div>
                ),
              }}
              helperText="รหัสผ่าน"
              autoComplete="off"
            />
          </div>

          <div className="flex justify-start">
            <Link to="https://intra.up.ac.th/account/wfrmForgetPassword.aspx" className="text-red-500">
              Forgot Password
            </Link>
          </div>

          <Button
            variant="contained"
            sx={{ bgcolor: '#996600', '&:hover': { bgcolor: '#664400' } }}
            onClick={handleLogin}
          >
            ล็อคอิน
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default LoginModal;
