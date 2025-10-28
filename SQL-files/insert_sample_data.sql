-- Sample Data for Metropolitan City Public Transport Database
USE metropolitan_transport;

-- Insert Users
INSERT INTO User (name, contact_info, address) VALUES
('Rahul Sharma', '9876543210', '123 MG Road, Mumbai'),
('Priya Patel', '9876543211', '456 Park Street, Kolkata'),
('Amit Kumar', '9876543212', '789 Brigade Road, Bangalore'),
('Sneha Reddy', '9876543213', '321 Anna Salai, Chennai'),
('Vikram Singh', '9876543214', '654 Connaught Place, Delhi');

-- Insert Routes
INSERT INTO Route (route_name, start_stop, end_stop, total_distance, status) VALUES
('Route 101', 'Central Station', 'Airport', 25.5, 'Active'),
('Route 202', 'City Center', 'Tech Park', 18.3, 'Active'),
('Route 303', 'Railway Station', 'Beach Road', 12.7, 'Active'),
('Route 404', 'Bus Terminal', 'University', 15.2, 'Active'),
('Route 505', 'Market Square', 'Hospital', 8.9, 'Active');

-- Insert Buses
INSERT INTO Bus (route_id, registration_no, type, capacity, status) VALUES
(1, 'MH-01-AB-1234', 'AC Deluxe', 45, 'Active'),
(1, 'MH-01-AB-1235', 'Non-AC', 50, 'Active'),
(2, 'KA-02-BC-2345', 'AC Deluxe', 45, 'Active'),
(3, 'TN-03-CD-3456', 'Non-AC', 50, 'Active'),
(4, 'DL-04-DE-4567', 'AC Deluxe', 40, 'Active'),
(5, 'MH-05-EF-5678', 'Non-AC', 50, 'Maintenance');

-- Insert Bus Passes
INSERT INTO BusPass (user_id, pass_type, expiry_date, issue_date, status) VALUES
(1, 'Monthly', '2024-11-30', '2024-10-01', 'Active'),
(2, 'Quarterly', '2024-12-31', '2024-10-01', 'Active'),
(3, 'Annual', '2025-09-30', '2024-10-01', 'Active'),
(4, 'Monthly', '2024-11-30', '2024-10-01', 'Active'),
(5, 'Weekly', '2024-11-04', '2024-10-28', 'Active');

-- Insert Bus Stops
INSERT INTO BusStop (name, location, facilities) VALUES
('Central Station', 'Downtown Area', 'Shelter, Seating, Digital Display'),
('Airport', 'Airport Road', 'Shelter, Seating, Restrooms'),
('City Center', 'Main Street', 'Shelter, Seating'),
('Tech Park', 'IT Corridor', 'Shelter, Digital Display'),
('Railway Station', 'Station Road', 'Shelter, Seating, Ticket Counter'),
('Beach Road', 'Coastal Area', 'Shelter, Seating'),
('Bus Terminal', 'Terminal Complex', 'Shelter, Seating, Restrooms, Food Court'),
('University', 'Education District', 'Shelter, Seating, Digital Display'),
('Market Square', 'Commercial Area', 'Shelter, Seating'),
('Hospital', 'Medical District', 'Shelter, Seating, Wheelchair Access');

-- Insert Route-BusStop Relationships
INSERT INTO RouteBusStop (route_id, stop_id) VALUES
(1, 1), (1, 2),  -- Route 101: Central Station to Airport
(2, 3), (2, 4),  -- Route 202: City Center to Tech Park
(3, 5), (3, 6),  -- Route 303: Railway Station to Beach Road
(4, 7), (4, 8),  -- Route 404: Bus Terminal to University
(5, 9), (5, 10); -- Route 505: Market Square to Hospital

-- Insert Contractors
INSERT INTO Contractor (name, contact_details, service_type) VALUES
('ABC Motors Pvt Ltd', '022-12345678', 'Bus Maintenance'),
('XYZ Engineering', '080-23456789', 'Infrastructure Maintenance'),
('Quick Fix Services', '044-34567890', 'Emergency Repairs'),
('Metro Care Solutions', '011-45678901', 'Metro Maintenance'),
('City Transport Services', '022-56789012', 'General Maintenance');

-- Insert Maintenance Records
INSERT INTO Maintenance (contractor_id, bus_id, details, maintenance_date, cost, entity_type, entity_id) VALUES
(1, 1, 'Regular servicing and oil change', '2024-10-15', 5000.00, 'Bus', 1),
(1, 2, 'Brake pad replacement', '2024-10-20', 3500.00, 'Bus', 2),
(3, 6, 'Engine overhaul', '2024-10-25', 25000.00, 'Bus', 6),
(1, 3, 'AC system repair', '2024-10-18', 8000.00, 'Bus', 3),
(5, 4, 'Tire replacement', '2024-10-22', 12000.00, 'Bus', 4);

-- Insert Metro Stops
INSERT INTO MetroStop (name, line, location, status) VALUES
('Central Metro Station', 'Blue Line', 'Downtown', 'Active'),
('Airport Metro', 'Blue Line', 'Airport Complex', 'Active'),
('Tech Park Metro', 'Green Line', 'IT Corridor', 'Active'),
('University Metro', 'Green Line', 'Education District', 'Active'),
('Hospital Metro', 'Red Line', 'Medical District', 'Active'),
('Beach Metro', 'Red Line', 'Coastal Area', 'Active'),
('Market Metro', 'Yellow Line', 'Commercial Area', 'Active'),
('Stadium Metro', 'Yellow Line', 'Sports Complex', 'Active');

-- Insert Metro Connections
INSERT INTO MetroConnection (start_metro_stop_id, end_metro_stop_id, distance, travel_time) VALUES
(1, 2, 24.5, 35),  -- Central to Airport
(3, 4, 8.2, 12),   -- Tech Park to University
(5, 6, 15.3, 22),  -- Hospital to Beach
(7, 8, 6.7, 10),   -- Market to Stadium
(1, 3, 12.5, 18),  -- Central to Tech Park (interchange)
(2, 5, 18.9, 27);  -- Airport to Hospital (interchange)

-- Display summary
SELECT 'Sample data inserted successfully!' AS Status;
SELECT 'Users:', COUNT(*) FROM User;
SELECT 'Routes:', COUNT(*) FROM Route;
SELECT 'Buses:', COUNT(*) FROM Bus;
SELECT 'Bus Passes:', COUNT(*) FROM BusPass;
SELECT 'Bus Stops:', COUNT(*) FROM BusStop;
SELECT 'Contractors:', COUNT(*) FROM Contractor;
SELECT 'Maintenance Records:', COUNT(*) FROM Maintenance;
SELECT 'Metro Stops:', COUNT(*) FROM MetroStop;
SELECT 'Metro Connections:', COUNT(*) FROM MetroConnection;
