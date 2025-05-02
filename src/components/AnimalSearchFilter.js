import React, { useState } from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Paper,
    Grid,
    Typography,
    Chip,
    Stack,
    Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

const AnimalSearchFilter = ({ onSearch, onFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        ownerName: ''
    });

    const animalTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];
    const statusTypes = ['Healthy', 'Recovering', 'In Treatment', 'Critical'];

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleFilterChange = (field) => (event) => {
        const value = event.target.value;
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        onFilter({ ...filters, [field]: value });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            type: '',
            status: '',
            ownerName: ''
        });
        onSearch('');
        onFilter({});
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Search & Filter Animals
            </Typography>
            
            <Grid container spacing={3}>
                {/* Search Section */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by name or owner..."
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                            endAdornment: searchTerm && (
                                <IconButton size="small" onClick={() => setSearchTerm('')}>
                                    <ClearIcon />
                                </IconButton>
                            )
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Filters Section */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                        Filter Options
                    </Typography>
                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={2}
                        sx={{ mt: 1 }}
                    >
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={filters.type}
                                onChange={handleFilterChange('type')}
                                label="Type"
                                displayEmpty
                                renderValue={value => value || "Type"}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {animalTypes.map(type => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filters.status}
                                onChange={handleFilterChange('status')}
                                label="Status"
                                displayEmpty
                                renderValue={value => value || "Status"}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {statusTypes.map(status => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Owner</InputLabel>
                            <Select
                                value={filters.ownerName}
                                onChange={handleFilterChange('ownerName')}
                                label="Owner"
                                displayEmpty
                                renderValue={value => value || "Owner"}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {/* Add owner options here */}
                            </Select>
                        </FormControl>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton 
                                color="primary" 
                                onClick={clearFilters}
                                title="Clear all filters"
                                sx={{ 
                                    border: '1px solid',
                                    borderColor: 'primary.main',
                                    borderRadius: 1,
                                    p: 1
                                }}
                            >
                                <FilterListIcon />
                            </IconButton>
                        </Box>
                    </Stack>
                </Grid>

                {/* Active Filters */}
                {(filters.type || filters.status || filters.ownerName) && (
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Active Filters:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {filters.type && (
                                    <Chip
                                        label={`Type: ${filters.type}`}
                                        onDelete={() => handleFilterChange('type')({ target: { value: '' } })}
                                        sx={{ m: 0.5 }}
                                    />
                                )}
                                {filters.status && (
                                    <Chip
                                        label={`Status: ${filters.status}`}
                                        onDelete={() => handleFilterChange('status')({ target: { value: '' } })}
                                        sx={{ m: 0.5 }}
                                    />
                                )}
                                {filters.ownerName && (
                                    <Chip
                                        label={`Owner: ${filters.ownerName}`}
                                        onDelete={() => handleFilterChange('ownerName')({ target: { value: '' } })}
                                        sx={{ m: 0.5 }}
                                    />
                                )}
                            </Stack>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

export default AnimalSearchFilter; 