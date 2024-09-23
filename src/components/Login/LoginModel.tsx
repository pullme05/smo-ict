import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from "@mui/material";
import { AccountCircle, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (isAdmin: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onLogin }) => {
  const [username, setUsername] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const adminCredentials = {
    username: "admin", 
    password: "123",
  };

  const handleLogin = () => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      onLogin(true);
    } else {
      onLogin(false);
    }
    onClose();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        {/* ด้านบน */}
        <div className="flex flex-col items-center">
          <img src="/smoictmain.png" alt="Logo" className="mb-4 w-24 h-24" />
          <h2 id="login-modal-title" style={{ color: '#996600' }} className="text-xl font-bold mb-4">
            LOGIN
          </h2>
        </div>

        {/* ฟอร์ม */}
        <div className="flex flex-col gap-4">
          {/* ฟิลด์ Username */}
          <div className="flex items-center">
            <AccountCircle sx={{ color: "#996600", marginRight: "8px" }} />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              helperText="ชื่อผู้ใช้งาน"
              autoComplete="off" // ปิดการจดจำ username
            />
          </div>

          {/* ฟิลด์ Password */}
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
                    {/* ไอคอนเริ่มต้นเป็นลูกตาปิด */}
                    {showPassword ? (
                      <Visibility sx={{ color: "#996600" }} /> // ลูกตาเปิด
                    ) : (
                      <VisibilityOff sx={{ color: "#996600" }} /> // ลูกตาปิด
                    )}
                  </div>
                ),
              }}
              helperText="รหัสผ่าน"
              autoComplete="off" // ปิดการจดจำรหัสผ่าน
            />
          </div>

          {/* ลิงก์ Forgot Password */}
          <div className="flex justify-start">
            <Link to="https://intra.up.ac.th/account/wfrmForgetPassword.aspx" className="text-red-500">
              Forgot Password
            </Link>
          </div>

          {/* ปุ่ม Login */}
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
