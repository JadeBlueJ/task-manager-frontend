import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { InputAdornment } from '@mui/material';
import { IconButton } from "@mui/material";
import { useState } from "react";
import { Box } from '@mui/material'; // Import Box for layout

export default function TodoForm({ addTodo }) {
    const [text, setText] = useState('');

    const handleChange = (evt) => {
        setText(evt.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) { // Check if text is not empty
            addTodo(text);
            setText('');
        }
    };

    return (
        <ListItem>
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%', // Full width
                        maxWidth: '600px', // Max width for larger screens
                        margin: '0 auto', // Center the form on larger screens
                    }}
                >
                    <TextField 
                        sx={{
                            flexGrow: 1, // Allow the TextField to grow
                            marginRight: 1, // Add space between TextField and button
                        }}
                        color='warning'
                        id='outlined-basic' 
                        label='Add task' 
                        variant='outlined' 
                        onChange={handleChange}  
                        value={text}
                        InputProps={{
                            endAdornment: 
                                <InputAdornment position="end">
                                    <IconButton 
                                        aria-label="create todo" 
                                        edge="end" 
                                        type="submit"
                                    >
                                        <CreateOutlinedIcon sx={{ color: '#eb5e28' }} />
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                </Box>
            </form>
        </ListItem>
    );
}
