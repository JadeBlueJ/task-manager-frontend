import List from '@mui/material/List';
import React, { useState, useEffect } from 'react';
import CategoryItem from './CategoryItem'; // Updated from TaskItem
import { Box, Typography, createTheme, ThemeProvider, Button, Select, MenuItem, FormControl, InputLabel, IconButton, ListItem, CircularProgress } from '@mui/material';
import CategoryFormModal from './CategoryFormModal'; // Updated from TaskFormModal
import { axiosClient } from '../../utils/api.utils';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importing the back icon

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

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const navigate = useNavigate();

    const handleOpenModal = (id) => {
        setCategoryToDelete(id);
        setOpenConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        if (categoryToDelete) {
            try {
                await axiosClient.delete(`/categories/${categoryToDelete}`);
                toast('Deleted successfully');
                getCategories(); // Refresh the category list
            } catch (error) {
                console.log(error);
                toast(error);
            }
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        setOpenConfirmModal(false);
        setCategoryToDelete(null);
    };

    // Fetch categories from API
    // Fetch categories from API
    const getCategories = React.useCallback(async () => {
        setLoading(true); // Start loading when fetching categories
        try {
            const response = await axiosClient.get('/categories');
            if (response.data.success) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error(error);
            toast('Error fetching categories');
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        getCategories();
    }, [getCategories]);

    const categoryList = categories.map((category) => (
        <CategoryItem
            category={category}
            key={category.categoryId}
            remove={handleOpenModal}
        />
    ));

    return (
        <ThemeProvider theme={theme}>
            <Box
                className='CategoryList'
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
                    Category Manager
                </Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                    mb: 2,
                    width: '100%',
                }}>
                    <IconButton edge="end" aria-label="back" onClick={() => { navigate('/tasks') }}>
                        <ArrowBackIcon sx={{ color: '#eb5e28' }} />
                    </IconButton>
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
                        Add Category
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
                        categoryList.length > 0 ? (
                            categoryList
                        ) : (
                            <Typography>No categories found</Typography>
                        )
                    )}
                </List>

                {!loading &&
                    <Typography
                        variant='h5'
                        component='h5'
                        sx={{
                            display: 'flex',
                            marginTop: '10px',
                            justifyContent: 'space-between'
                        }}
                    >
                        {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
                    </Typography>}
            </Box>

            {/* Modal for adding Category */}
            <CategoryFormModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                addCategory={getCategories}
            />

            <ConfirmationModal
                open={openConfirmModal}
                handleClose={handleCloseModal}
                handleConfirm={handleConfirmDelete}
            />
        </ThemeProvider>
    );
}
