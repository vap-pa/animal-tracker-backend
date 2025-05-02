import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Paper
} from '@mui/material';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            try {
                const token = sessionStorage.getItem('accessToken');
                if (token) {
                    // Verify token by making a request to a protected endpoint
                    await api.get('/api/auth/me');
                    console.log('User already logged in, redirecting to animals');
                    navigate('/animals');
                }
            } catch (err) {
                console.log('No valid session found, clearing tokens');
                sessionStorage.removeItem('accessToken');
            }
        };

        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Attempting login...');
            const response = await api.post('/api/auth/login', {
                email,
                password
            });

            console.log('Login response:', response.data);
            const { accessToken } = response.data;
            
            if (accessToken) {
                console.log('Login successful, storing token');
                sessionStorage.setItem('accessToken', accessToken);
                navigate('/animals');
            } else {
                throw new Error('No access token received');
            }
        } catch (err) {
            console.error('Login error:', err);
            console.error('Error details:', err.response?.data);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Login
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 