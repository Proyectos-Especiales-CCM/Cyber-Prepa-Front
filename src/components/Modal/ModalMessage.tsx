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

interface ModalMessageProps {
  openModal: boolean;
  handleCloseModal: () => void;
  severity: string;
  message: string;
}

/**
 * ModalMessage component for displaying a small modal with an alert message.
 * 
 * @component
 * @param {boolean} openModal - State to control the modal open/close.
 * @param {Function} handleCloseModal - Set the openModal state to false to close the modal.
 * @param {string} severity - Changes color based on the severity of the alert (e.g., "success", "error", "warning", "info").
 * @param {string} message - The message to be displayed in the alert.
 * 
 * @example
 * const [openModal, setOpenModal] = useState(false);
 * const [severity, setSeverity] = useState("info");
 * const [message, setMessage] = useState("This is an example message.");
 * 
 * const handleOpenModal = () => {
 *   setOpenModal(true);
 * };
 * 
 * const handleCloseModal = () => {
 *   setOpenModal(false);
 * };
 * 
 * return (
 *   <div>
 *     <button onClick={handleOpenModal}>Show Modal Message</button>
 *     <ModalMessage
 *       openModal={openModal}
 *       handleCloseModal={handleCloseModal}
 *       severity={severity}
 *       message={message}
 *     />
 *   </div>
 * );
 * 
 * @returns {React.JSX.Element} The rendered ModalMessage component.
 * 
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
 */
export default function ModalMessage({ openModal, handleCloseModal, severity, message }: ModalMessageProps): React.JSX.Element {
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
