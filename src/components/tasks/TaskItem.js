import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit'; // Import Edit icon
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import dayjs from 'dayjs'; // Import dayjs for date formatting

export default function TaskItem({ task, remove, edit }) {
    const labelId = `checkbox-list-label-${task.taskId}`;

    const removeTask = () => {
        remove(task.taskId);
    };

    const handleEdit = () => {
        edit(task); // Call the edit function with the task
    };

    // Format the due date if it exists
    const formattedDueDate = task.dueDate ? dayjs(task.dueDate).format('MMM D, YYYY') : '';

    return (
        <ListItem
            key={task.taskId}
            secondaryAction={
                <>
                    <IconButton edge="end" aria-label="edit" onClick={handleEdit}>
                        <EditIcon sx={{ color: '#eb5e28', margin: '10px' }} /> {/* Edit icon */}
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={removeTask}>
                        <DeleteOutlineIcon sx={{ color: '#eb5e28' }} />
                    </IconButton>
                </>
            }
            disablePadding
        >
            <ListItemButton
                role={undefined}
                dense
            >
                {/* <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={task.status === 'completed'}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                        onChange={toggle}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleOutlineIcon />}
                        color='warning'
                        key={task.taskId}
                    />
                </ListItemIcon> */}
                <ListItemText
                    id={labelId}
                    primary={task.title}
                    secondary={
                        <>
                            <div>{task.description}</div>
                            {task.dueDate && <div>Due: {formattedDueDate}</div>}
                            <div>Status: {task.status}</div>
                            {task.category && task.category?.categoryId && <div>Category: {task.category?.categoryName}</div>}
                        </>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
}
