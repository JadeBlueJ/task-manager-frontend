import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import TemplateFrame from '../theme/TemplateFrame';
import getTheme from '../theme/getTheme';
import { useNavigate } from 'react-router-dom';
import CategoryList from './CategoryList';


const SignUpContainer = styled(Stack)(({ theme }) => ({
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
        backgroundImage:
            'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
}));

export default function CategoryComponent() {
    const navigate = useNavigate();
    const [mode, setMode] = React.useState('light');
    const theme = createTheme(getTheme(mode));


    const toggleColorMode = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    return (
        <TemplateFrame mode={mode} toggleColorMode={toggleColorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <SignUpContainer direction="column" justifyContent="space-between">
                    <CategoryList />
                </SignUpContainer>
            </ThemeProvider>
        </TemplateFrame>
    );
}
