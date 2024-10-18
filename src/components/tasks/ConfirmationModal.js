import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function ConfirmationModal({ open, handleClose, handleConfirm }) {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2">
                    Confirm Deletion
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Are you sure you want to delete this task?
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handleConfirm}>
                        Yes
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose}>
                        No
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
