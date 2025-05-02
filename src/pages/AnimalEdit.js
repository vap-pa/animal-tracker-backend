import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Grid,
    Paper,
    MenuItem
} from '@mui/material';
import api from '../utils/axios';

const AnimalEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        birthDate: '',
        gender: '',
        status: '',
        description: ''
    });

    const statusOptions = [
        'HEALTHY',
        'RECOVERING',
        'IN_TREATMENT',
        'CRITICAL'
    ];

    const genderOptions = [
        'MALE',
        'FEMALE'
    ];

    useEffect(() => {
        const fetchAnimalData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get(`/api/animals/${id}`);
                const animalData = response.data;
                setFormData({
                    name: animalData.name || '',
                    species: animalData.species || '',
                    breed: animalData.breed || '',
                    birthDate: animalData.birthDate || '',
                    gender: animalData.gender || '',
                    status: animalData.status || '',
                    description: animalData.description || ''
                });
            } catch (err) {
                console.error('Error fetching animal data:', err);
                setError('Failed to load animal data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnimalData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await api.put(`/api/animals/${id}`, formData);
            navigate('/animals');
        } catch (err) {
            console.error('Error updating animal:', err);
            setError('Failed to update animal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.name) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Edit Animal
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
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
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                required
                            >
                                {genderOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
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
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/animals')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default AnimalEdit; 