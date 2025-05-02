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
    Chip,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../utils/axios';

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        specialization: '',
        hireDate: ''
    });
    const navigate = useNavigate();

    const roles = [
        'VETERINARIAN',
        'TECHNICIAN',
        'RECEPTIONIST',
        'ADMINISTRATOR',
        'CARETAKER'
    ];

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
                console.log('Token is valid, fetching staff');
                await fetchStaff();
            } catch (err) {
                console.error('Auth check failed:', err);
                sessionStorage.removeItem('accessToken');
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/api/staff');
            console.log('Staff data:', response.data);
            setStaff(response.data);
        } catch (err) {
            console.error('Error fetching staff:', err);
            if (err.response?.status === 401) {
                sessionStorage.removeItem('accessToken');
                navigate('/login');
            } else {
                setError('Failed to fetch staff data. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddStaff = () => {
        setSelectedStaff(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: '',
            specialization: '',
            hireDate: new Date().toISOString().split('T')[0]
        });
        setOpenDialog(true);
    };

    const handleEditStaff = (e, member) => {
        e.stopPropagation();
        setSelectedStaff(member);
        setFormData({
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            phone: member.phone,
            role: member.role,
            specialization: member.specialization || '',
            hireDate: member.hireDate?.split('T')[0] || new Date().toISOString().split('T')[0]
        });
        setOpenDialog(true);
    };

    const handleDeleteStaff = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await api.delete(`/api/staff/${id}`);
                fetchStaff();
            } catch (err) {
                console.error('Error deleting staff:', err);
                setError('Failed to delete staff member. Please try again.');
            }
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStaff(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            if (selectedStaff) {
                await api.put(`/api/staff/${selectedStaff.id}`, formData);
            } else {
                await api.post('/api/staff', formData);
            }
            handleCloseDialog();
            fetchStaff();
        } catch (err) {
            console.error('Error saving staff:', err);
            setError('Failed to save staff member. Please try again.');
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

    if (loading && !staff.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" gutterBottom>
                        Staff Members
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddStaff}
                    >
                        Add Staff Member
                    </Button>
                </Box>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {staff.length === 0 ? (
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    No staff members found.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {staff.map((member) => (
                        <Grid item xs={12} sm={6} md={4} key={member.id}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h5" gutterBottom>
                                            {member.firstName} {member.lastName}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                onClick={(e) => handleEditStaff(e, member)}
                                                title="Edit"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => handleDeleteStaff(e, member.id)}
                                                title="Delete"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Chip
                                        label={member.role}
                                        color="primary"
                                        sx={{ mb: 2 }}
                                    />
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Email:</strong> {member.email}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Phone:</strong> {member.phone}
                                    </Typography>
                                    {member.specialization && (
                                        <Typography variant="body1" gutterBottom>
                                            <strong>Specialization:</strong> {member.specialization}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Hire Date:</strong> {new Date(member.hireDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Status:</strong> {member.active ? 'Active' : 'Inactive'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Specialization"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Hire Date"
                                    name="hireDate"
                                    type="date"
                                    value={formData.hireDate}
                                    onChange={handleInputChange}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Save'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
};

export default Staff; 