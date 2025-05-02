import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Badge, Tooltip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpIcon from '@mui/icons-material/Help';

const Header = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const buttonStyle = (path) => ({
        color: 'inherit',
        borderBottom: isActive(path) ? '2px solid white' : 'none',
        borderRadius: 0,
        '&:hover': {
            borderBottom: '2px solid white',
        }
    });

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography 
                    variant="h6" 
                    component={Link} 
                    to="/" 
                    sx={{ 
                        flexGrow: 1, 
                        textDecoration: 'none', 
                        color: 'inherit',
                        fontWeight: 'bold'
                    }}
                >
                    Animal Tracker & Hospital
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mr: 2 }}>
                    <Button 
                        sx={buttonStyle('/animals')}
                        component={Link} 
                        to="/animals"
                    >
                        Animals
                    </Button>
                    <Button 
                        sx={buttonStyle('/staff')}
                        component={Link} 
                        to="/staff"
                    >
                        Staff
                    </Button>
                    <Button 
                        sx={buttonStyle('/appointments')}
                        component={Link} 
                        to="/appointments"
                    >
                        Appointments
                    </Button>
                    <Button 
                        sx={buttonStyle('/medical-records')}
                        component={Link} 
                        to="/medical-records"
                    >
                        Medical Records
                    </Button>
                    <Button 
                        sx={buttonStyle('/reports')}
                        component={Link} 
                        to="/reports"
                    >
                        Reports
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Notifications">
                        <IconButton color="inherit">
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Help">
                        <IconButton color="inherit">
                            <HelpIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Profile">
                        <IconButton 
                            color="inherit" 
                            component={Link} 
                            to="/profile"
                            sx={buttonStyle('/profile')}
                        >
                            <AccountCircleIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header; 