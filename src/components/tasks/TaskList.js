import List from '@mui/material/List';
import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { Box, Typography, createTheme, ThemeProvider, Button } from '@mui/material';
import FilterBtn from './FilterBtn';
import TaskFormModal from './TaskFormModal';
import { axiosClient } from '../../utils/api.utils';
import EditTaskModal from './EditTaskModal';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';

const theme = createTheme({
    typography: {
        fontFamily: [
            'Montserrat',
            'sans-serif',
        ].join(','),
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
    marginRight: 'auto'
};

const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('All');
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);

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
    const getTasks = React.useCallback(async () => {
        const response = await axiosClient.get('/tasks')
        if (response.data.success) {
            setTasks(response.data.tasks)
        }
    }, [])

    React.useEffect(() => {
        getTasks()
    }, [getTasks]);

    const filterList = FILTER_NAMES.map((name) => (
        <FilterBtn
            key={name}
            name={name}
            isPressed={name === filter}
            setFilter={setFilter}
        />
    ));

    const removeTask = async (id) => {
        try {
            await axiosClient.delete(`/tasks/${id}`)
            toast('Deleted successfully')
            getTasks()
        } catch (error) {
            console.log(error)
            toast(error)

        }
    };

    const toggleTask = (id) => {
        setTasks((prevTasks) => prevTasks.map((task) => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        }));
    };


    const taskList = tasks
        .filter(FILTER_MAP[filter])
        .map((task) => (
            <TaskItem
                task={task}
                key={task.taskId}
                remove={handleOpenModal}
                toggle={() => toggleTask(task.id)}
                edit={handleEditOpen}
            />
        ));

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
                <List
                    sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        fontFamily: 'inherit',
                        padding: 0,
                        margin: 0,
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
                        Task Manager
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex', // Make this a flex container
                            flexDirection: 'row', // Column direction to stack elements
                            flex: '1', // Take up remaining space
                            justifyContent: 'flex-end', // Align items at the end
                            mt: 2, // Add some top margin for spacing
                            mb: 2
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={() => setOpenModal(true)}
                            sx={{
                                backgroundColor: '#eb5e28', // Set custom orange color
                                '&:hover': {
                                    backgroundColor: '#d54c19', // Darker shade on hover
                                },
                            }}
                        >
                            Add Task
                        </Button>
                    </Box>
                    {taskList}
                    <Typography
                        variant='h5'
                        component='h5'
                        sx={{
                            display: 'flex',
                            marginTop: '10px',
                            justifyContent: 'space-between'
                        }}
                    >
                        {taskList.length} task{taskList.length !== 1 && 's'} left
                        <span>
                            {filterList}
                        </span>
                    </Typography>
                </List>
            </Box>

            {/* Modal for adding Task */}
            <TaskFormModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                addTask={getTasks}
                categoryOptions={[]}
            />
            <EditTaskModal
                open={isEditModalOpen}
                handleClose={handleEditClose}
                task={currentTask}
                editTask={getTasks} // Pass the editTask function to the modal
                categoryOptions={[]}
            />
            <ConfirmationModal
                open={openConfirmModal}
                handleClose={handleCloseModal}
                handleConfirm={handleConfirmDelete}
            />
        </ThemeProvider>
    );
}
