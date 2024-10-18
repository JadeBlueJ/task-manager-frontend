import React, { useState } from 'react';
import {
    Modal,
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
} from '@mui/material';

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

export default function TodoFormModal({ open, handleClose, addTodo }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Pending');
    const [category, setCategory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Example API call
        const todoData = {
            title,
            description,
            status,
            category,
        };

        // Call your API here (replace the following with your actual API call)
        // await axios.post('/api/todos', todoData);

        // After successful API call, add the todo to the list
        addTodo(todoData);
        handleClose(); // Close the modal
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2">
                    Add Todo
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        required
                        label="Title"
                        fullWidth
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Category (optional)"
                        fullWidth
                        margin="normal"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Add Todo
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}
