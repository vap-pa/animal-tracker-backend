import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Toolbar,
    ListItemButton,
    Collapse,
    Tooltip
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import api from '../utils/axios';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openMedical, setOpenMedical] = useState(false);
    const [openReports, setOpenReports] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = sessionStorage.getItem('accessToken');
                if (!token) {
                    console.log('No token found, redirecting to login');
                    navigate('/login');
                    return;
                }

                console.log('Fetching user data...');
                const response = await api.get('/api/auth/me');
                console.log('User data response:', response.data);
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching user data:', err);
                if (err.response?.status === 401) {
                    console.log('Unauthorized, redirecting to login');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await api.post('/api/auth/logout');
            sessionStorage.removeItem('accessToken');
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
            sessionStorage.removeItem('accessToken');
            navigate('/login');
        }
    };

    const isActive = (path) => location.pathname === path;

    const listItemStyle = (path) => ({
        backgroundColor: isActive(path) ? 'action.selected' : 'transparent',
        '&:hover': {
            backgroundColor: 'action.hover',
        }
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 250,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 250,
                    boxSizing: 'border-box',
                }
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Tooltip title="View Profile">
                        <IconButton component={Link} to="/profile">
                            <Avatar
                                src={user?.profilePicture}
                                sx={{ width: 56, height: 56 }}
                            />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        {user?.fullName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {user?.role}
                    </Typography>
                </Box>
                <Divider />
                <List>
                    <ListItemButton 
                        component={Link} 
                        to="/dashboard"
                        sx={listItemStyle('/dashboard')}
                    >
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>

                    <ListItemButton 
                        component={Link} 
                        to="/animals"
                        sx={listItemStyle('/animals')}
                    >
                        <ListItemIcon>
                            <PetsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Animals" />
                    </ListItemButton>

                    <ListItemButton onClick={() => setOpenMedical(!openMedical)}>
                        <ListItemIcon>
                            <MedicalServicesIcon />
                        </ListItemIcon>
                        <ListItemText primary="Medical" />
                        {openMedical ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openMedical} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton 
                                sx={{ pl: 4, ...listItemStyle('/appointments') }}
                                component={Link}
                                to="/appointments"
                            >
                                <ListItemIcon>
                                    <CalendarMonthIcon />
                                </ListItemIcon>
                                <ListItemText primary="Appointments" />
                            </ListItemButton>
                            <ListItemButton 
                                sx={{ pl: 4, ...listItemStyle('/medical-records') }}
                                component={Link}
                                to="/medical-records"
                            >
                                <ListItemIcon>
                                    <MedicalServicesIcon />
                                </ListItemIcon>
                                <ListItemText primary="Medical Records" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    <ListItemButton 
                        component={Link} 
                        to="/staff"
                        sx={listItemStyle('/staff')}
                    >
                        <ListItemIcon>
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText primary="Staff" />
                    </ListItemButton>

                    <ListItemButton onClick={() => setOpenReports(!openReports)}>
                        <ListItemIcon>
                            <AssessmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Reports" />
                        {openReports ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openReports} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton 
                                sx={{ pl: 4, ...listItemStyle('/reports/animals') }}
                                component={Link}
                                to="/reports/animals"
                            >
                                <ListItemText primary="Animal Reports" />
                            </ListItemButton>
                            <ListItemButton 
                                sx={{ pl: 4, ...listItemStyle('/reports/medical') }}
                                component={Link}
                                to="/reports/medical"
                            >
                                <ListItemText primary="Medical Reports" />
                            </ListItemButton>
                            <ListItemButton 
                                sx={{ pl: 4, ...listItemStyle('/reports/staff') }}
                                component={Link}
                                to="/reports/staff"
                            >
                                <ListItemText primary="Staff Reports" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
                <Divider />
                <List>
                    <ListItemButton 
                        component={Link} 
                        to="/settings"
                        sx={listItemStyle('/settings')}
                    >
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </List>
            </Box>
        </Drawer>
    );
};

export default Navigation; 