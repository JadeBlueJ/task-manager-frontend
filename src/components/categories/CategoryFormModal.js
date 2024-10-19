import React, { useState } from 'react';
import {
    Modal,
    Box,
    Button,
    TextField,
    Typography,
} from '@mui/material';

import { axiosClient } from '../../utils/api.utils';
import { toast } from 'react-toastify';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function CategoryFormModal({ open, handleClose, addCategory }) {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoryData = {
            categoryName: description,
        };
        try {
            setLoading(true);
            await axiosClient.post('/categories', categoryData);
            toast('Added successfully');
        } catch (error) {
            console.log(error);
            toast('Something went wrong');
        } finally {
            setLoading(false);
        }

        clearFields();
        addCategory(categoryData); // After successful API call, add the task to the list
        handleClose(); // Close the modal
    };

    const clearFields = () => {
        setDescription('');
    };


    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2">
                    Add Category
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
                        Add Category
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}
