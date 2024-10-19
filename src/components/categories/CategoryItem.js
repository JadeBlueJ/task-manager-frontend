import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function CategoryItem({ category, remove, edit }) {
    const labelId = `checkbox-list-label-${category.categoryId}`;

    const removeTask = () => {
        remove(category.categoryId);
    };

    return (
        <ListItem
            key={category.categoryId}
            secondaryAction={
                <>
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
                <ListItemText
                    id={labelId}
                    primary={category.categoryName}
                />
            </ListItemButton>
        </ListItem>
    );
}
