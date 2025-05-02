import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AnimalSearchFilter from '../components/AnimalSearchFilter';
import api from '../utils/axios';
import MedicalRecordList from '../components/MedicalRecordList';

const Animals = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'details'
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        birthDate: '',
        gender: '',
        status: '',
        description: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = sessionStorage.getItem('accessToken');
                if (!token) {
                    console.log('No token found, redirecting to login');
                    navigate('/login');
                    return;
                }

                // Verify token by making a request to a protected endpoint
                await api.get('/api/auth/me');
                console.log('Token is valid, fetching animals');
                await fetchAnimals();
            } catch (err) {
                console.error('Auth check failed:', err);
                sessionStorage.removeItem('accessToken');
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);

    const fetchAnimals = async (searchParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.get('/api/animals', { 
                params: searchParams
            });
            
            setAnimals(response.data);
        } catch (err) {
            console.error('Error fetching animals:', err);
            if (err.response?.status === 401) {
                console.log('Token expired or invalid, redirecting to login');
                sessionStorage.removeItem('accessToken');
                navigate('/login');
            } else {
                setError('Failed to fetch animals. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchTerm) => {
        fetchAnimals({ name: searchTerm });
    };

    const handleFilter = (filters) => {
        fetchAnimals(filters);
    };

    const handleAddAnimal = () => {
        setSelectedAnimal(null);
        setFormData({
            name: '',
            species: '',
            breed: '',
            birthDate: '',
            gender: '',
            status: '',
            description: ''
        });
        setOpenDialog(true);
    };

    const handleEditAnimal = (e, animal) => {
        e.stopPropagation();
        setSelectedAnimal(animal);
        setFormData({
            name: animal.name,
            species: animal.species,
            breed: animal.breed,
            birthDate: animal.birthDate?.split('T')[0] || '',
            gender: animal.gender,
            status: animal.status,
            description: animal.description
        });
        setOpenDialog(true);
    };

    const handleViewAnimal = (e, animal) => {
        e.stopPropagation();
        setSelectedAnimal(animal);
        setViewMode('details');
    };

    const handleDeleteAnimal = async (e, animalId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this animal?')) {
            try {
                await api.delete(`/api/animals/${animalId}`);
                fetchAnimals();
            } catch (err) {
                console.error('Error deleting animal:', err);
                setError('Failed to delete animal. Please try again later.');
            }
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAnimal(null);
        setFormData({
            name: '',
            species: '',
            breed: '',
            birthDate: '',
            gender: '',
            status: '',
            description: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            if (selectedAnimal) {
                await api.put(`/api/animals/${selectedAnimal.id}`, formData);
            } else {
                await api.post('/api/animals', formData);
            }
            handleCloseDialog();
            fetchAnimals();
        } catch (err) {
            console.error('Error saving animal:', err);
            setError('Failed to save animal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRetry = () => {
        fetchAnimals();
    };

    if (loading && !animals.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error && !animals.length) {
        return (
            <Container>
                <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Button variant="contained" onClick={handleRetry}>
                        Retry
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4">Animals</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddAnimal}
                >
                    Add Animal
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <AnimalSearchFilter onSearch={handleSearch} onFilter={handleFilter} />

            {viewMode === 'details' && selectedAnimal ? (
                <Box>
                    <Button
                        variant="outlined"
                        onClick={() => setViewMode('list')}
                        sx={{ mb: 2 }}
                    >
                        Back to List
                    </Button>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                {selectedAnimal.name}
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <strong>Species:</strong> {selectedAnimal.species}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Breed:</strong> {selectedAnimal.breed}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Gender:</strong> {selectedAnimal.gender}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <strong>Birth Date:</strong> {selectedAnimal.birthDate?.split('T')[0]}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Status:</strong> {selectedAnimal.status}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Description:</strong> {selectedAnimal.description}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Box mt={4}>
                                <MedicalRecordList animalId={selectedAnimal.id} />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {animals.map((animal) => (
                        <Grid item xs={12} sm={6} md={4} key={animal.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h5" gutterBottom>
                                            {animal.name}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                onClick={(e) => handleViewAnimal(e, animal)}
                                                title="View Details"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => handleEditAnimal(e, animal)}
                                                title="Edit"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => handleDeleteAnimal(e, animal.id)}
                                                title="Delete"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Species:</strong> {animal.species}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Breed:</strong> {animal.breed}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Status:</strong> {animal.status}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedAnimal ? 'Edit Animal' : 'Add New Animal'}
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Species"
                                    name="species"
                                    value={formData.species}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Breed"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Birth Date"
                                    name="birthDate"
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                        </Grid>
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Save'}
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default Animals; 