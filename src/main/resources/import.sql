-- Staff members
INSERT INTO staff (first_name, last_name, role, email, phone, specialization, hire_date, active) 
VALUES 
('Sarah', 'Smith', 'Veterinarian', 'sarah.smith@animalhospital.com', '(555) 123-4567', 'Small Animals', '2018-05-15', true),
('Michael', 'Johnson', 'Veterinarian', 'michael.johnson@animalhospital.com', '(555) 234-5678', 'Surgery', '2019-02-10', true),
('Emily', 'Davis', 'Veterinary Technician', 'emily.davis@animalhospital.com', '(555) 345-6789', 'Anesthesia', '2020-07-22', true),
('Robert', 'Wilson', 'Receptionist', 'robert.wilson@animalhospital.com', '(555) 456-7890', 'Administration', '2021-01-05', true);

-- Animals
INSERT INTO animals (name, type, breed, age, status, weight, microchip_number, birth_date, admission_date, owner_name, owner_contact) 
VALUES 
('Max', 'Dog', 'Golden Retriever', 3, 'Healthy', 28.5, '123456789012345', '2020-01-15', '2021-03-10', 'John Doe', 'john.doe@example.com'),
('Whiskers', 'Cat', 'Siamese', 5, 'Recovering', 4.2, '234567890123456', '2018-05-20', '2019-01-15', 'Jane Smith', 'jane.smith@example.com'),
('Bella', 'Dog', 'Labrador', 2, 'In Treatment', 25.0, '345678901234567', '2021-02-28', '2021-06-10', 'Mike Johnson', 'mike.johnson@example.com'),
('Oliver', 'Cat', 'Persian', 1, 'Healthy', 3.8, '456789012345678', '2022-04-10', '2022-06-01', 'Sarah Williams', 'sarah.williams@example.com'),
('Charlie', 'Bird', 'Parrot', 10, 'Chronic Condition', 0.5, '567890123456789', '2013-08-15', '2020-11-20', 'David Brown', 'david.brown@example.com');

-- Appointments
INSERT INTO appointments (animal_id, date_time, type, description, status, veterinarian_id) 
VALUES 
(1, '2023-08-10 10:00:00', 'Annual Checkup', 'Routine annual checkup', 'Scheduled', 1),
(2, '2023-07-25 14:30:00', 'Vaccination', 'Rabies vaccine', 'Completed', 2),
(3, '2023-07-28 11:15:00', 'Follow-up', 'Skin condition follow-up', 'Cancelled', 1),
(1, '2023-09-15 09:30:00', 'Dental', 'Teeth cleaning', 'Scheduled', 2),
(4, '2023-08-05 13:00:00', 'Checkup', 'General health check', 'Scheduled', 1);

-- Medical Records
INSERT INTO medical_records (animal_id, date, procedure_type, diagnosis, treatment, notes, veterinarian_id) 
VALUES 
(1, '2023-05-15', 'Annual Checkup', 'Healthy', 'None required', 'All vitals normal', 1),
(2, '2023-04-10', 'Vaccination', 'Up-to-date on vaccines', 'Rabies vaccine administered', 'No adverse reactions', 2),
(3, '2023-03-22', 'Skin Condition', 'Allergic dermatitis', 'Prescribed antihistamines', 'Follow-up in 2 weeks', 1),
(1, '2022-11-20', 'Vaccination', 'Vaccines up to date', 'DHPP vaccine administered', 'Next due in 1 year', 2),
(5, '2023-01-10', 'Chronic Condition', 'Feather plucking', 'Behavioral therapy recommended', 'Environmental enrichment suggested', 1);