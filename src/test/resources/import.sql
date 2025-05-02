-- This file is intentionally left empty
-- All test data has been removed 

-- Drop all tables
DROP TABLE IF EXISTS medical_records;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS animals;
DROP TABLE IF EXISTS enclosures;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS users;

-- Recreate tables
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    hire_date DATE,
    active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE enclosures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    description VARCHAR(1000)
);

CREATE TABLE animals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    breed VARCHAR(255),
    age INT,
    status VARCHAR(255),
    weight DOUBLE,
    microchip_number VARCHAR(255),
    birth_date DATE,
    admission_date DATE,
    owner_name VARCHAR(255),
    owner_contact VARCHAR(255)
);

CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    animal_id BIGINT,
    date_time DATETIME NOT NULL,
    type VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    status VARCHAR(255) NOT NULL,
    veterinarian_id BIGINT,
    FOREIGN KEY (animal_id) REFERENCES animals(id),
    FOREIGN KEY (veterinarian_id) REFERENCES staff(id)
);

CREATE TABLE medical_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    animal_id BIGINT NOT NULL,
    date DATE NOT NULL,
    procedure_type VARCHAR(255) NOT NULL,
    diagnosis VARCHAR(1000),
    treatment VARCHAR(1000),
    notes VARCHAR(1000),
    status VARCHAR(255),
    veterinarian_id BIGINT,
    FOREIGN KEY (animal_id) REFERENCES animals(id),
    FOREIGN KEY (veterinarian_id) REFERENCES staff(id)
); 