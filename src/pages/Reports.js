import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportType, setReportType] = useState('ANIMAL');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = sessionStorage.getItem('accessToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                await api.get('/api/auth/me');
                await fetchStats();
            } catch (err) {
                console.error('Auth check failed:', err);
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/api/statistics/dashboard');
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching statistics:', err);
            if (err.response?.status === 401) {
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                navigate('/login');
            } else {
                setError('Failed to fetch statistics. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/statistics/export', {
                params: { reportType },
                responseType: 'blob'
            });

            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${reportType.toLowerCase()}_report.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error exporting report:', err);
            let errorMessage = 'Failed to export report. Please try again later.';
            if (err.response?.status === 401) {
                errorMessage = 'Your session has expired. Please log in again.';
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                navigate('/login');
            } else if (err.response?.status === 400) {
                errorMessage = 'Invalid report type selected.';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                    <Typography color="error" gutterBottom>
                        {error}
                    </Typography>
                    <Button variant="contained" onClick={fetchStats}>
                        Retry
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" component="h1">
                        Reports
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Report Type</InputLabel>
                            <Select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                label="Report Type"
                            >
                                <MenuItem value="ANIMAL">Animal Report</MenuItem>
                                <MenuItem value="ENCLOSURE">Enclosure Report</MenuItem>
                                <MenuItem value="STAFF">Staff Report</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            startIcon={<FileDownloadIcon />}
                            onClick={handleExport}
                        >
                            Export Report
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Animals
                            </Typography>
                            <Typography variant="h4">
                                {stats?.totalAnimals ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Appointments
                            </Typography>
                            <Typography variant="h4">
                                {stats?.totalAppointments ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Medical Records
                            </Typography>
                            <Typography variant="h4">
                                {stats?.totalMedicalRecords ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Staff
                            </Typography>
                            <Typography variant="h4">
                                {stats?.totalStaff ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Emergency Cases
                            </Typography>
                            <Typography variant="h4">
                                {stats?.emergencyCases ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Healthy Animals
                            </Typography>
                            <Typography variant="h4">
                                {stats?.healthyAnimals ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Under Observation
                            </Typography>
                            <Typography variant="h4">
                                {stats?.underObservation ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Critical Cases
                            </Typography>
                            <Typography variant="h4">
                                {stats?.criticalCases ?? 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Reports; 