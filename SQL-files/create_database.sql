-- Metropolitan City Public Transport Database
-- Database Creation Script

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS metropolitan_transport;
CREATE DATABASE metropolitan_transport;
USE metropolitan_transport;

-- User Table
CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(100),
    address VARCHAR(255)
);

-- Route Table
CREATE TABLE Route (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    route_name VARCHAR(100) NOT NULL,
    start_stop VARCHAR(100) NOT NULL,
    end_stop VARCHAR(100) NOT NULL,
    total_distance DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'Active'
);

-- Bus Table
CREATE TABLE Bus (
    bus_id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT,
    registration_no VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50),
    capacity INT,
    status VARCHAR(50) DEFAULT 'Active',
    FOREIGN KEY (route_id) REFERENCES Route(route_id) ON DELETE SET NULL
);

-- BusPass Table
CREATE TABLE BusPass (
    pass_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    pass_type VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    issue_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- BusStop Table
CREATE TABLE BusStop (
    stop_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    facilities VARCHAR(255)
);

-- RouteBusStop Junction Table
CREATE TABLE RouteBusStop (
    id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT NOT NULL,
    stop_id INT NOT NULL,
    FOREIGN KEY (route_id) REFERENCES Route(route_id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES BusStop(stop_id) ON DELETE CASCADE,
    UNIQUE KEY unique_route_stop (route_id, stop_id)
);

-- Contractor Table
CREATE TABLE Contractor (
    contractor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact_details VARCHAR(100),
    service_type VARCHAR(100)
);

-- Maintenance Table
CREATE TABLE Maintenance (
    maintenance_id INT PRIMARY KEY AUTO_INCREMENT,
    contractor_id INT,
    bus_id INT NOT NULL,
    details VARCHAR(500),
    maintenance_date DATE NOT NULL,
    cost DECIMAL(10, 2),
    entity_type VARCHAR(50),
    entity_id INT,
    FOREIGN KEY (contractor_id) REFERENCES Contractor(contractor_id) ON DELETE SET NULL,
    FOREIGN KEY (bus_id) REFERENCES Bus(bus_id) ON DELETE CASCADE
);

-- MetroStop Table
CREATE TABLE MetroStop (
    metro_stop_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    line VARCHAR(50),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active'
);

-- MetroConnection Table
CREATE TABLE MetroConnection (
    connection_id INT PRIMARY KEY AUTO_INCREMENT,
    start_metro_stop_id INT NOT NULL,
    end_metro_stop_id INT NOT NULL,
    distance DECIMAL(10, 2),
    travel_time INT,
    FOREIGN KEY (start_metro_stop_id) REFERENCES MetroStop(metro_stop_id) ON DELETE CASCADE,
    FOREIGN KEY (end_metro_stop_id) REFERENCES MetroStop(metro_stop_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_bus_route ON Bus(route_id);
CREATE INDEX idx_buspass_user ON BusPass(user_id);
CREATE INDEX idx_maintenance_bus ON Maintenance(bus_id);
CREATE INDEX idx_maintenance_contractor ON Maintenance(contractor_id);
CREATE INDEX idx_routebusstop_route ON RouteBusStop(route_id);
CREATE INDEX idx_routebusstop_stop ON RouteBusStop(stop_id);
CREATE INDEX idx_metroconnection_start ON MetroConnection(start_metro_stop_id);
CREATE INDEX idx_metroconnection_end ON MetroConnection(end_metro_stop_id);

-- Display success message
SELECT 'Database created successfully!' AS Status;
