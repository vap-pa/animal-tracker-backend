import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    CircularProgress,
    Alert,
    Grid,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const AdminProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        phoneNumber: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = sessionStorage.getItem('accessToken');
                if (!token) {
                    console.log('No token found, redirecting to login');
                    navigate('/login');
                    return;
                }

                console.log('Fetching user data...');
                const response = await api.get('/api/auth/me');
                console.log('User data response:', response.data);
                
                if (response.data) {
                    const userData = response.data;
                    setUser(userData);
                    setFormData({
                        username: userData.username || '',
                        email: userData.email || '',
                        fullName: userData.fullName || '',
                        phoneNumber: userData.phoneNumber || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                console.error('Error details:', err.response?.data);
                if (err.response?.status === 401) {
                    console.log('Unauthorized, redirecting to login');
                    sessionStorage.removeItem('accessToken');
                    navigate('/login');
                } else {
                    setError('Failed to load profile. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

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
            console.log('Updating profile with data:', formData);
            const response = await api.put('/api/auth/me', formData);
            console.log('Profile update response:', response.data);
            setUser(response.data);
            setEditMode(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            console.error('Error details:', err.response?.data);
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error && !user) {
        return (
            <Container>
                <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Button variant="contained" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                    <Avatar
                        sx={{ width: 100, height: 100, mb: 2 }}
                        alt={user?.fullName}
                        src={user?.profilePicture}
                    />
                    <Typography variant="h4" gutterBottom>
                        {user?.fullName || 'Admin Profile'}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {user?.role}
                    </Typography>
                </Box>

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
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                disabled={!editMode}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                {editMode ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setEditMode(false);
                                                setFormData({
                                                    username: user.username || '',
                                                    email: user.email || '',
                                                    fullName: user.fullName || '',
                                                    phoneNumber: user.phoneNumber || ''
                                                });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={loading}
                                        >
                                            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={() => setEditMode(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default AdminProfile; 