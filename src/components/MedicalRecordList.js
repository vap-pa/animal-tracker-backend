import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../utils/axios';

const MedicalRecordList = ({ animalId }) => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        procedureType: '',
        diagnosis: '',
        treatment: '',
        notes: '',
        veterinarianId: ''
    });
    const [veterinarians, setVeterinarians] = useState([]);

    useEffect(() => {
        fetchRecords();
        fetchVeterinarians();
    }, [animalId]);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/api/medical-records/animal/${animalId}`);
            setRecords(response.data);
        } catch (err) {
            console.error('Error fetching medical records:', err);
            setError('Failed to fetch medical records. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchVeterinarians = async () => {
        try {
            const response = await api.get('/api/staff', { params: { role: 'VETERINARIAN' } });
            setVeterinarians(response.data);
        } catch (err) {
            console.error('Error fetching veterinarians:', err);
        }
    };

    const handleAddRecord = () => {
        setSelectedRecord(null);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            procedureType: '',
            diagnosis: '',
            treatment: '',
            notes: '',
            veterinarianId: ''
        });
        setOpenDialog(true);
    };

    const handleEditRecord = (record) => {
        setSelectedRecord(record);
        setFormData({
            date: record.date.split('T')[0],
            procedureType: record.procedureType,
            diagnosis: record.diagnosis,
            treatment: record.treatment,
            notes: record.notes || '',
            veterinarianId: record.veterinarianId
        });
        setOpenDialog(true);
    };

    const handleDeleteRecord = async (recordId) => {
        if (window.confirm('Are you sure you want to delete this medical record?')) {
            try {
                await api.delete(`/api/medical-records/${recordId}`);
                fetchRecords();
            } catch (err) {
                console.error('Error deleting medical record:', err);
                setError('Failed to delete medical record. Please try again later.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                animalId
            };

            if (selectedRecord) {
                await api.put(`/api/medical-records/${selectedRecord.id}`, data);
            } else {
                await api.post('/api/medical-records', data);
            }
            setOpenDialog(false);
            fetchRecords();
        } catch (err) {
            console.error('Error saving medical record:', err);
            setError('Failed to save medical record. Please try again later.');
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
        fetchRecords();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={handleRetry}>
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Medical Records</Typography>
                <Button variant="contained" onClick={handleAddRecord}>
                    Add Record
                </Button>
            </Box>

            {records.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No medical records found for this animal.
                </Typography>
            ) : (
                <Box>
                    {records.map((record) => (
                        <Card key={record.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6">
                                        {new Date(record.date).toLocaleDateString()}
                                    </Typography>
                                    <Box>
                                        <IconButton onClick={() => handleEditRecord(record)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteRecord(record.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Procedure: {record.procedureType}
                                </Typography>
                                <Typography variant="body1">
                                    Diagnosis: {record.diagnosis}
                                </Typography>
                                <Typography variant="body1">
                                    Treatment: {record.treatment}
                                </Typography>
                                {record.notes && (
                                    <Typography variant="body2" color="text.secondary">
                                        Notes: {record.notes}
                                    </Typography>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                    Veterinarian: {record.veterinarianName}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedRecord ? 'Edit Medical Record' : 'Add New Medical Record'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                fullWidth
                                label="Date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth
                                select
                                label="Procedure Type"
                                name="procedureType"
                                value={formData.procedureType}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="Check-up">Check-up</MenuItem>
                                <MenuItem value="Vaccination">Vaccination</MenuItem>
                                <MenuItem value="Surgery">Surgery</MenuItem>
                                <MenuItem value="Treatment">Treatment</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                label="Diagnosis"
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleInputChange}
                                required
                                multiline
                                rows={2}
                            />
                            <TextField
                                fullWidth
                                label="Treatment"
                                name="treatment"
                                value={formData.treatment}
                                onChange={handleInputChange}
                                required
                                multiline
                                rows={2}
                            />
                            <TextField
                                fullWidth
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                multiline
                                rows={2}
                            />
                            <TextField
                                fullWidth
                                select
                                label="Veterinarian"
                                name="veterinarianId"
                                value={formData.veterinarianId}
                                onChange={handleInputChange}
                                required
                            >
                                {veterinarians.map((vet) => (
                                    <MenuItem key={vet.id} value={vet.id}>
                                        {vet.fullName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {selectedRecord ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default MedicalRecordList; 