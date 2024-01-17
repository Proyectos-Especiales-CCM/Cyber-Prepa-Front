import { Box, Modal, IconButton, Alert, AlertColor } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const styleModal = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  borderRadius: '1rem',
};

export default function ModalMessage({ openModal, handleCloseModal, severity, message }: { openModal: boolean, handleCloseModal: () => void, severity:string, message: string }) {
  return (
    <Modal
      open={openModal || false}
      onClose={handleCloseModal}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...styleModal }}>
        <Alert
          severity={severity as AlertColor | "info"}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                handleCloseModal();
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          autoFocus={false}
        >
          {message}
        </Alert>
      </Box>
    </Modal>
  );
}