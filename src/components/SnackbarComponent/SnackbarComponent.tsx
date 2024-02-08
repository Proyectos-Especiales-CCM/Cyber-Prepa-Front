import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarComponentProps {
  open: boolean;
  onClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
  severity: "success" | "warning" | "error" | "info";
  message: string;
}

const SnackbarComponent: React.FC<SnackbarComponentProps> = ({ open, onClose, severity, message }) => {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
