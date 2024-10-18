import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import { yellow, green, pink, blue } from '@mui/material/colors';

// Styled component for the Avatar
const StyledAvatar = styled(Avatar)(({ theme, note }) => ({
  backgroundColor: (() => {
    switch (note.category) {
      case 'work':
        return yellow[700];
      case 'money':
        return green[500];
      case 'todos':
        return pink[500];
      default:
        return blue[500];
    }
  })(),
}));

export default function NoteCard({ note, handleDelete }) {
  return (
    <div>
      <Card elevation={1}>
        <CardHeader
          avatar={
            <StyledAvatar note={note}>
              {note.category[0].toUpperCase()}
            </StyledAvatar>
          }
          action={
            <IconButton onClick={() => handleDelete(note.id)}>
              <DeleteOutlined />
            </IconButton>
          }
          title={note.title}
          subheader={note.category}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {note.details}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
