import React, { useState, useEffect } from 'react';
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

export default function EditTaskModal({ open, handleClose, task, editTask, categoryOptions = [] }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [category, setCategory] = useState('');
    const [dueBy, setDueBy] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
            if (task.category?._id) setCategory(task.category?._id); // Handle optional category
            else setCategory('')
            if (task.dueDate) setDueBy(dayjs(task.dueDate)); // Initialize with task due date
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatePayload = {
            title,
            description,
            status,
            // dueDate: dueBy.format('YYYY-MM-DD'), // Format the date for the API
        };
        if (category) updatePayload.category = category
        if (dueBy) updatePayload.dueDate = dueBy.format('YYYY-MM-DD')

        try {
            setLoading(true);
            // Call your API here (replace the following with your actual API call)
            await axiosClient.put(`/tasks/${task.taskId}`, { updatePayload: updatePayload });
            editTask(updatePayload); // Update the task in the parent component
            toast('Updated successfully')

            handleClose(); // Close the modal
        } catch (error) {
            console.error(error);
            toast('Something went wrong')
        } finally {
            setLoading(false);
        }
    };

    // Get today's date as a Day.js object for comparison
    const today = dayjs();

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2">
                    Edit Task
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
                            label="Status"
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="in-progress">In Progress</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Due By"
                            value={dueBy}
                            onChange={(newValue) => {
                                setDueBy(newValue);
                            }}
                            minDate={today} // Restrict to today and future dates
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
                        />
                    </LocalizationProvider>
                    <FormControl fullWidth margin="normal" disabled={categoryOptions.length === 0}>
                        <InputLabel>Category (optional)</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            label="Category (optional)"
                        >
                            {categoryOptions.map((option) => (
                                <MenuItem key={option.categoryId} value={option._id}>
                                    {option.categoryName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
                        Save Changes
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}
