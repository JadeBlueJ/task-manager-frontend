import List from '@mui/material/List';
import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { Box, Typography, createTheme, ThemeProvider, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, ListItem, IconButton } from '@mui/material';
import TaskFormModal from './TaskFormModal';
import { axiosClient } from '../../utils/api.utils';
import EditTaskModal from './EditTaskModal';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TaskCalendar from '../calendar/TaskCalendarModal';
import TaskCalendarModal from '../calendar/TaskCalendarModal';

const theme = createTheme({
    typography: {
        fontFamily: ['Montserrat', 'sans-serif'].join(','),
    },
});

const styles = {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    m: 3,
    backgroundColor: 'white',
    paddingBottom: '40px',
    margin: '3rem 0 3rem 0',
    padding: '1rem',
    position: 'relative',
    boxShadow: '0px 14px 0px -5px #ef8257, 0px 28px 0px -10px #f39e7c, 5px 5px 15px 5px rgba(0,0,0,0)',
    border: '2px solid #252422',
    maxWidth: '38rem',
    marginLeft: 'auto',
    marginRight: 'auto',
};

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);

    const [filterStatus, setFilterStatus] = useState('All');  // Status filter state
    const [filterCategory, setFilterCategory] = useState('All');  // Category filter state
    const [categories, setCategories] = useState([]);  // List of categories
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(5); // Number of tasks to display per page
    const [totalTasks, setTotalTasks] = useState(0); // Total number of tasks
    const [showCalendar, setShowCalendar] = useState(false); // Total number of tasks

    const navigate = useNavigate()
    const handleEditOpen = (task) => {
        setCurrentTask(task);
        setEditModalOpen(true);
    };

    const handleEditClose = () => {
        setEditModalOpen(false);
        setCurrentTask(null);
    };

    const handleOpenModal = (id) => {
        setTaskToDelete(id);
        setOpenConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        if (taskToDelete) {
            try {
                await axiosClient.delete(`/tasks/${taskToDelete}`);
                toast('Deleted successfully');
                getTasks(); // Refresh the task list
            } catch (error) {
                console.log(error);
                toast(error);
            }
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        setOpenConfirmModal(false);
        setTaskToDelete(null);
    };
    const handleOpenCalendar = () => {
        setShowCalendar(true);
    };

    const handleCloseCalendar = () => {
        setShowCalendar(false);
    };
    const getTasks = React.useCallback(async () => {
        setLoading(true); // Start loading when fetching categories
        try {
            const response = await axiosClient.get('/tasks', {
                params: {
                    skip: (currentPage - 1) * tasksPerPage,
                    limit: tasksPerPage,
                    status: filterStatus,
                    category: filterCategory,
                },
            });
            if (response.data.success) {
                setTasks(response.data.tasks);
                setCategories(response.data.categories || []);
                setTotalTasks(response.data.totalTasks)
            }
        } catch (error) {
            console.error(error);
            toast('Error fetching tasks');
        } finally {
            setLoading(false); // End loading when fetching is complete
        }
    }, [currentPage, filterCategory, filterStatus, tasksPerPage]);

    const getAllTasks = React.useCallback(async () => {
        // setLoading(true); // Start loading when fetching categories
        try {
            const response = await axiosClient.get('/tasks/all');
            if (response.data.success) {
                setAllTasks(response.data.tasks)
            }
        } catch (error) {
            console.error(error);
            toast('Error fetching all tasks');
        } finally {
            // setLoading(false); // End loading when fetching is complete
        }
    }, []);

    useEffect(() => {
        getTasks();
    }, [currentPage, getTasks]);

    useEffect(() => {
        getAllTasks();
    },[getAllTasks, tasks])
    // Filter tasks based on status and category
    const filteredTasks = tasks.filter((task) => {
        let statusMatch = true;
        let categoryMatch = true;

        // Filter based on status (pending, in-progress, completed)
        if (filterStatus !== 'All') {
            switch (filterStatus) {
                case 'pending':
                    statusMatch = task.status === 'pending';
                    break;
                case 'in-progress':
                    statusMatch = task.status === 'in-progress';
                    break;
                case 'completed':
                    statusMatch = task.status === 'completed';
                    break;
                default:
                    statusMatch = true;
            }
        }

        // Filter based on category
        if (filterCategory !== 'All') {
            categoryMatch = task.category?._id === filterCategory;
        }

        return statusMatch && categoryMatch;
    });


    const taskList = filteredTasks.map((task) => (
        <TaskItem
            task={task}
            key={task.taskId}
            remove={handleOpenModal}
            edit={handleEditOpen}
        />
    ));
    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalTasks / tasksPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    // Dropdown for filtering by status
    const statusDropdown = (
        <FormControl sx={{ minWidth: 250, marginRight: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
            >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In-Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
            </Select>
        </FormControl>
    );

    // Dropdown for filtering by category (if any categories exist)
    const categoryDropdown = categories.length > 0 && (
        <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Category</InputLabel>
            <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
            >
                <MenuItem value="All">All</MenuItem>
                {categories.map((category) => (
                    <MenuItem key={category.categoryId} value={category._id}>
                        {category.categoryName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box
                className='TaskList'
                sx={{
                    ...styles,
                    width: '100%',
                    padding: { xs: 2, sm: 3 },
                }}
            >
                <Typography
                    variant='h5'
                    component='h4'
                    sx={{
                        color: '#eb5e28',
                        paddingBottom: '10px',
                        fontWeight: '500',
                        textAlign: 'center'
                    }}
                >
                    Task Manager X
                </Typography>

                {/* Filter dropdowns */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 2,
                        mb: 2,
                        width: '100%',
                    }}
                >
                    {statusDropdown}
                    {categoryDropdown}

                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    mt: 2,
                    mb: 2,
                    width: '100%',
                }}>
                    <Button
                        variant="contained"
                        onClick={handleOpenCalendar}
                        sx={{
                            marginRight: '10px',
                            backgroundColor: 'orange',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#d54c19',
                            },
                        }}
                        startIcon={<CalendarTodayIcon sx={{ color: 'white' }} />}  // Add icon here
                    >
                        Calendar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => { navigate('/categories') }}
                        sx={{
                            marginRight: '10px',
                            backgroundColor: '#eb5e28',
                            '&:hover': {
                                backgroundColor: '#d54c19',
                            },
                        }}
                    >
                        Categories
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setOpenModal(true)}
                        sx={{
                            backgroundColor: '#eb5e28',
                            '&:hover': {
                                backgroundColor: '#d54c19',
                            },
                        }}
                    >
                        Add Task
                    </Button>

                </Box>
                <List
                    sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        fontFamily: 'inherit',
                        padding: 0,
                        margin: 0,
                    }}
                >
                    {loading ? (
                        // Show the loader while categories are being fetched
                        <ListItem>
                            <CircularProgress size={24} sx={{ marginRight: '16px' }} />
                            <Typography>Loading categories...</Typography>
                        </ListItem>
                    ) : (
                        taskList.length > 0 ? (
                            taskList
                        ) : (
                            <Typography>No categories found</Typography>
                        )
                    )}
                </List>

                {!loading &&
                    <Typography variant='h5' component='h5' sx={{ display: 'flex', marginTop: '10px', justifyContent: 'space-between' }}>
                        {totalTasks} task{totalTasks !== 1 && 's'}
                    </Typography>}

                {/* Pagination Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
                    <Button onClick={handleNextPage} disabled={currentPage >= Math.ceil(totalTasks / tasksPerPage)}>Next</Button>
                </Box>

            </Box>

            {/* Modal for adding Task */}
            <TaskFormModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                addTask={getTasks}
                categoryOptions={categories}
            />
            <EditTaskModal
                open={isEditModalOpen}
                handleClose={handleEditClose}
                task={currentTask}
                editTask={getTasks}
                categoryOptions={categories}
            />
            <ConfirmationModal
                open={openConfirmModal}
                handleClose={handleCloseModal}
                handleConfirm={handleConfirmDelete}
            />
            <TaskCalendarModal tasks={allTasks} open={showCalendar} onClose={handleCloseCalendar} />
        </ThemeProvider>
    );
}
