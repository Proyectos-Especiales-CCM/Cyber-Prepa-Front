import { Box, Typography, Modal, Grid2 as Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 0.5,
    bgcolor: 'black',
    border: '0.25rem solid #D9D9D9',
    boxShadow: 24,
    p: 4,
    borderRadius: '1rem',
};

import { ReactNode } from 'react';
import React from 'react';

/**
 * CustomModal component for displaying a modal in the center of the screen with a title and children components inside the modal.
 * 
 * @component
 * @param {boolean} openModal - State to control the modal open/close.
 * @param {Function} handleCloseModal - Function to close the modal.
 * @param {string} title - Title of the modal.
 * @param {ReactNode} children - Child components to render inside the modal.
 * 
 * @example
 * const [openModal, setOpenModal] = useState(false);
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
 *     <button onClick={handleOpenModal}>Open Modal</button>
 *     <CustomModal
 *       openModal={openModal}
 *       handleCloseModal={handleCloseModal}
 *       title="Sample Title"
 *     >
 *       <p>Sample Content</p>
 *     </CustomModal>
 *   </div>
 * );
 * 
 * @returns {React.JSX.Element} The rendered CustomModal component.
 * 
 * @author Diego Jacobo Mtz. [Github](https://github.com/Djmr5)
*/
export default function CustomModal({ openModal, handleCloseModal, title, children }: { openModal: boolean, handleCloseModal: () => void, title: string, children: ReactNode }): React.JSX.Element {
    return (
        <Modal
            open={openModal || false}
            onClose={handleCloseModal}
        >
            <Box sx={{ ...styleModal }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid size={10}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: '10px' }}>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid size={2} container justifyContent="flex-end">
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="medium"
                            onClick={() => {
                                handleCloseModal();
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    </Grid>
                </Grid>
                {children}
            </Box>
        </Modal>
    );
}
