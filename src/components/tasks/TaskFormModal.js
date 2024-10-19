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
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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

export default function TaskFormModal({ open, handleClose, addTask, categoryOptions = [] }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [category, setCategory] = useState(''); // Initialize with empty string
    const [dueBy, setDueBy] = useState(null); // Initialize with null
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Example API call
        const taskData = {
            title,
            description,
            status,
            category,
            // dueDate: dueBy ? dueBy.format('YYYY-MM-DD') : null, // Only format if dueBy is not null
        };
        if (dueBy) taskData.dueDate = dueBy.format('YYYY-MM-DD')
        try {
            setLoading(true);
            await axiosClient.post('/tasks', taskData);
            toast('Added successfully');
        } catch (error) {
            console.log(error);
            toast('Something went wrong');
        } finally {
            setLoading(false);
        }

        clearFields();
        addTask(taskData); // After successful API call, add the task to the list
        handleClose(); // Close the modal
    };

    const clearFields = () => {
        setTitle('');
        setDescription('');
        setStatus('pending');
        setCategory('');
        setDueBy(null); // Reset to null
    };

    // Get today's date as a Day.js object for comparison
    const today = dayjs();

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2">
                    Add Task
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
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            label="Status" // Ensure the label is associated correctly
                            sx={{ marginBottom: '10px' }}
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="in-progress">In Progress</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Due By (optional)"
                            value={dueBy}
                            onChange={(newValue) => {
                                setDueBy(newValue); // Set due date or null
                            }}
                            minDate={today} // Restrict to today and future dates
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        />
                    </LocalizationProvider>
                    <FormControl fullWidth margin="normal" disabled={categoryOptions.length === 0}>
                        <InputLabel>Category (optional)</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            label="Category (optional)" // Ensure the label is associated correctly
                        >
                            {categoryOptions.map((option) => (
                                <MenuItem key={option.categoryId} value={option._id}>
                                    {option.categoryName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
                        Add Task
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}
