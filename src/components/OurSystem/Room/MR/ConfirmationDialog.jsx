import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import "./ConfirmationDialog.css";

function ConfirmationDialog({ open, onClose, confirmationMessage, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>ยืนยันการจอง</DialogTitle>
      <DialogContent>
        <Typography>{confirmationMessage}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          ยกเลิก
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          color="primary"
          variant="contained"
        >
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
