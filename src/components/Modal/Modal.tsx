import { Box, Typography, Modal, Grid, IconButton } from '@mui/material';
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

export default function CustomModal({ openModal, handleCloseModal, title, children }: { openModal: boolean, handleCloseModal: () => void, title: string, children: ReactNode }) {
    return (
        <Modal
            open={openModal || false}
            onClose={handleCloseModal}
        >
            <Box sx={{ ...styleModal }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item xs={10}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
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
                    </Grid>
                </Grid>
                {children}
            </Box>
        </Modal>
    );
}