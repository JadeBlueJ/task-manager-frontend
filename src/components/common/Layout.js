import React from 'react';
import { styled } from '@mui/material/styles'; // Updated import for styled
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { AddCircleOutlineOutlined, SubjectOutlined } from '@mui/icons-material';

const drawerWidth = 240;

const LayoutContainer = styled('div')(({ theme }) => ({
  display: 'flex',
}));

const Page = styled('div')(({ theme }) => ({
  background: '#f9f9f9',
  width: '100%',
  padding: theme.spacing(3),
  flexGrow: 1,
}));

const ActiveListItem = styled(ListItem)(({ theme }) => ({
  background: '#f4f4f4',
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: drawerWidth,
}));

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      text: 'My Notes', 
      icon: <SubjectOutlined color="secondary" />, 
      path: '/' 
    },
    { 
      text: 'Create Note', 
      icon: <AddCircleOutlineOutlined color="secondary" />, 
      path: '/create' 
    },
  ];

  return (
    <LayoutContainer>
      {/* App Bar */}
      <AppBarStyled position="fixed" elevation={0} color="primary">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>
            Today is the {format(new Date(), 'do MMMM Y')}
          </Typography>
          <Typography>Mario</Typography>
          <Avatar sx={{ marginLeft: 2 }} src="/mario-av.png" />
        </Toolbar>
      </AppBarStyled>

      {/* Side Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
      >
        <div>
          <Typography variant="h5" sx={{ padding: 2 }}>
            Ninja Notes
          </Typography>
        </div>

        {/* Links/List Section */}
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigate(item.path)}
              component={location.pathname === item.path ? ActiveListItem : ListItem}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        
      </Drawer>

      {/* Main Content */}
      <Page>
        <Toolbar /> {/* Empty toolbar for spacing */}
        {children}
      </Page>
    </LayoutContainer>
  );
}
