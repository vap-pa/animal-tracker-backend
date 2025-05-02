-- Sample Users
INSERT INTO users (username, email, password, full_name, role, enabled, last_login) VALUES
('admin', 'admin@animalhospital.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'Admin User', 'ROLE_ADMIN', true, NOW()),
('john.doe', 'john.doe@animalhospital.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'John Doe', 'ROLE_USER', true, NOW()),
('jane.smith', 'jane.smith@animalhospital.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'Jane Smith', 'ROLE_USER', true, NOW()),
('sarah.wilson', 'sarah.wilson@animalhospital.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'Sarah Wilson', 'ROLE_USER', true, NOW()),
('mike.brown', 'mike.brown@animalhospital.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'Mike Brown', 'ROLE_USER', true, NOW());

-- Sample Staff (Veterinarians and other staff)
INSERT INTO staff (first_name, last_name, role, email, phone, specialization, hire_date, active) VALUES
('Dr. James', 'Wilson', 'Veterinarian', 'james.wilson@animalhospital.com', '555-0101', 'Surgery', '2022-01-15', true),
('Dr. Emily', 'Davis', 'Veterinarian', 'emily.davis@animalhospital.com', '555-0102', 'Internal Medicine', '2022-02-20', true),
('Dr. Michael', 'Brown', 'Veterinarian', 'michael.brown@animalhospital.com', '555-0103', 'Dermatology', '2022-03-10', true),
('Lisa', 'Anderson', 'Technician', 'lisa.anderson@animalhospital.com', '555-0104', 'General Care', '2022-04-05', true),
('Robert', 'Taylor', 'Technician', 'robert.taylor@animalhospital.com', '555-0105', 'Emergency Care', '2022-05-15', true),
('Sarah', 'Martinez', 'Receptionist', 'sarah.martinez@animalhospital.com', '555-0106', NULL, '2022-06-01', true),
('David', 'Clark', 'Technician', 'david.clark@animalhospital.com', '555-0107', 'Radiology', '2022-07-10', true),
('Jennifer', 'White', 'Veterinarian', 'jennifer.white@animalhospital.com', '555-0108', 'Cardiology', '2022-08-20', true); 