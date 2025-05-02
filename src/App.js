import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import Navigation from './components/Navigation';
import Header from './components/Header';
import Login from './pages/Login';
import Animals from './pages/Animals';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import AdminProfile from './pages/AdminProfile';
import AnimalEdit from './pages/AnimalEdit';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/animals" replace />} />
          
          <Route element={<Layout />}>
            <Route path="/animals" element={<Animals />} />
            <Route path="/animals/:id/edit" element={<AnimalEdit />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 