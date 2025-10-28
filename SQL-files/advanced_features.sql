-- Advanced DBMS Features for Metropolitan City Public Transport Database
-- Includes: Views, Triggers, Stored Procedures, and Functions

USE metropolitan_transport;

-- ============================================
-- VIEWS
-- ============================================

-- View 1: Active Bus Fleet with Route Information
CREATE OR REPLACE VIEW active_bus_fleet AS
SELECT 
    b.bus_id,
    b.registration_no,
    b.type,
    b.capacity,
    b.status,
    r.route_name,
    r.start_stop,
    r.end_stop,
    r.total_distance
FROM Bus b
LEFT JOIN Route r ON b.route_id = r.route_id
WHERE b.status = 'Active';

-- View 2: User Pass Details with Expiry Status
CREATE OR REPLACE VIEW user_pass_status AS
SELECT 
    u.user_id,
    u.name,
    u.contact_info,
    bp.pass_id,
    bp.pass_type,
    bp.issue_date,
    bp.expiry_date,
    bp.status,
    DATEDIFF(bp.expiry_date, CURDATE()) AS days_remaining,
    CASE 
        WHEN bp.expiry_date < CURDATE() THEN 'EXPIRED'
        WHEN DATEDIFF(bp.expiry_date, CURDATE()) <= 7 THEN 'EXPIRING SOON'
        ELSE 'VALID'
    END AS pass_status
FROM User u
JOIN BusPass bp ON u.user_id = bp.user_id;

-- View 3: Route Statistics
CREATE OR REPLACE VIEW route_statistics AS
SELECT 
    r.route_id,
    r.route_name,
    r.start_stop,
    r.end_stop,
    r.total_distance,
    COUNT(DISTINCT b.bus_id) AS total_buses,
    COUNT(DISTINCT rbs.stop_id) AS total_stops,
    r.status
FROM Route r
LEFT JOIN Bus b ON r.route_id = b.route_id
LEFT JOIN RouteBusStop rbs ON r.route_id = rbs.route_id
GROUP BY r.route_id;

-- View 4: Maintenance Cost Summary by Bus
CREATE OR REPLACE VIEW bus_maintenance_summary AS
SELECT 
    b.bus_id,
    b.registration_no,
    b.type,
    COUNT(m.maintenance_id) AS total_services,
    COALESCE(SUM(m.cost), 0) AS total_cost,
    COALESCE(AVG(m.cost), 0) AS average_cost,
    MAX(m.maintenance_date) AS last_service_date
FROM Bus b
LEFT JOIN Maintenance m ON b.bus_id = m.bus_id
GROUP BY b.bus_id;

-- View 5: Contractor Performance
CREATE OR REPLACE VIEW contractor_performance AS
SELECT 
    c.contractor_id,
    c.name,
    c.service_type,
    COUNT(m.maintenance_id) AS jobs_completed,
    COALESCE(SUM(m.cost), 0) AS total_revenue,
    COALESCE(AVG(m.cost), 0) AS average_job_cost
FROM Contractor c
LEFT JOIN Maintenance m ON c.contractor_id = m.contractor_id
GROUP BY c.contractor_id;

-- View 6: Metro Network Overview
CREATE OR REPLACE VIEW metro_network_overview AS
SELECT 
    ms1.name AS start_station,
    ms1.line AS start_line,
    ms2.name AS end_station,
    ms2.line AS end_line,
    mc.distance,
    mc.travel_time,
    ROUND(mc.distance / (mc.travel_time / 60), 2) AS avg_speed_kmph
FROM MetroConnection mc
JOIN MetroStop ms1 ON mc.start_metro_stop_id = ms1.metro_stop_id
JOIN MetroStop ms2 ON mc.end_metro_stop_id = ms2.metro_stop_id;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger 1: Auto-update bus status when maintenance is added
DELIMITER //
CREATE TRIGGER update_bus_status_on_maintenance
AFTER INSERT ON Maintenance
FOR EACH ROW
BEGIN
    UPDATE Bus 
    SET status = 'Maintenance'
    WHERE bus_id = NEW.bus_id;
END//
DELIMITER ;

-- Trigger 2: Auto-expire bus passes
DELIMITER //
CREATE TRIGGER check_pass_expiry
BEFORE UPDATE ON BusPass
FOR EACH ROW
BEGIN
    IF NEW.expiry_date < CURDATE() THEN
        SET NEW.status = 'Expired';
    END IF;
END//
DELIMITER ;

-- Trigger 3: Validate bus capacity
DELIMITER //
CREATE TRIGGER validate_bus_capacity
BEFORE INSERT ON Bus
FOR EACH ROW
BEGIN
    IF NEW.capacity < 10 OR NEW.capacity > 100 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Bus capacity must be between 10 and 100';
    END IF;
END//
DELIMITER ;

-- Trigger 4: Log maintenance costs
DELIMITER //
CREATE TRIGGER validate_maintenance_cost
BEFORE INSERT ON Maintenance
FOR EACH ROW
BEGIN
    IF NEW.cost < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Maintenance cost cannot be negative';
    END IF;
END//
DELIMITER ;

-- Trigger 5: Prevent deletion of routes with active buses
DELIMITER //
CREATE TRIGGER prevent_route_deletion
BEFORE DELETE ON Route
FOR EACH ROW
BEGIN
    DECLARE bus_count INT;
    SELECT COUNT(*) INTO bus_count
    FROM Bus
    WHERE route_id = OLD.route_id AND status = 'Active';
    
    IF bus_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete route with active buses';
    END IF;
END//
DELIMITER ;

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Procedure 1: Issue a new bus pass
DELIMITER //
CREATE PROCEDURE issue_bus_pass(
    IN p_user_id INT,
    IN p_pass_type VARCHAR(50),
    IN p_issue_date DATE
)
BEGIN
    DECLARE v_expiry_date DATE;
    
    -- Calculate expiry date based on pass type
    CASE p_pass_type
        WHEN 'Weekly' THEN SET v_expiry_date = DATE_ADD(p_issue_date, INTERVAL 7 DAY);
        WHEN 'Monthly' THEN SET v_expiry_date = DATE_ADD(p_issue_date, INTERVAL 1 MONTH);
        WHEN 'Quarterly' THEN SET v_expiry_date = DATE_ADD(p_issue_date, INTERVAL 3 MONTH);
        WHEN 'Annual' THEN SET v_expiry_date = DATE_ADD(p_issue_date, INTERVAL 1 YEAR);
        ELSE SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid pass type';
    END CASE;
    
    -- Insert the pass
    INSERT INTO BusPass (user_id, pass_type, issue_date, expiry_date, status)
    VALUES (p_user_id, p_pass_type, p_issue_date, v_expiry_date, 'Active');
    
    SELECT 'Bus pass issued successfully' AS message, LAST_INSERT_ID() AS pass_id;
END//
DELIMITER ;

-- Procedure 2: Schedule bus maintenance
DELIMITER //
CREATE PROCEDURE schedule_maintenance(
    IN p_bus_id INT,
    IN p_contractor_id INT,
    IN p_details VARCHAR(500),
    IN p_maintenance_date DATE,
    IN p_cost DECIMAL(10,2)
)
BEGIN
    -- Insert maintenance record
    INSERT INTO Maintenance (bus_id, contractor_id, details, maintenance_date, cost, entity_type, entity_id)
    VALUES (p_bus_id, p_contractor_id, p_details, p_maintenance_date, p_cost, 'Bus', p_bus_id);
    
    SELECT 'Maintenance scheduled successfully' AS message, LAST_INSERT_ID() AS maintenance_id;
END//
DELIMITER ;

-- Procedure 3: Get route details with all information
DELIMITER //
CREATE PROCEDURE get_route_details(IN p_route_id INT)
BEGIN
    -- Route basic info
    SELECT * FROM Route WHERE route_id = p_route_id;
    
    -- Buses on this route
    SELECT * FROM Bus WHERE route_id = p_route_id;
    
    -- Stops on this route
    SELECT bs.* 
    FROM BusStop bs
    JOIN RouteBusStop rbs ON bs.stop_id = rbs.stop_id
    WHERE rbs.route_id = p_route_id;
END//
DELIMITER ;

-- Procedure 4: Calculate total revenue from passes
DELIMITER //
CREATE PROCEDURE calculate_pass_revenue(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        pass_type,
        COUNT(*) AS passes_sold,
        CASE pass_type
            WHEN 'Weekly' THEN COUNT(*) * 100
            WHEN 'Monthly' THEN COUNT(*) * 350
            WHEN 'Quarterly' THEN COUNT(*) * 900
            WHEN 'Annual' THEN COUNT(*) * 3000
        END AS estimated_revenue
    FROM BusPass
    WHERE issue_date BETWEEN p_start_date AND p_end_date
    GROUP BY pass_type
    WITH ROLLUP;
END//
DELIMITER ;

-- Procedure 5: Get maintenance report for a date range
DELIMITER //
CREATE PROCEDURE get_maintenance_report(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        m.maintenance_date,
        b.registration_no,
        b.type AS bus_type,
        c.name AS contractor_name,
        m.details,
        m.cost
    FROM Maintenance m
    JOIN Bus b ON m.bus_id = b.bus_id
    LEFT JOIN Contractor c ON m.contractor_id = c.contractor_id
    WHERE m.maintenance_date BETWEEN p_start_date AND p_end_date
    ORDER BY m.maintenance_date DESC;
    
    -- Summary
    SELECT 
        COUNT(*) AS total_services,
        SUM(cost) AS total_cost,
        AVG(cost) AS average_cost
    FROM Maintenance
    WHERE maintenance_date BETWEEN p_start_date AND p_end_date;
END//
DELIMITER ;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function 1: Calculate pass price
DELIMITER //
CREATE FUNCTION get_pass_price(p_pass_type VARCHAR(50))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_price DECIMAL(10,2);
    
    CASE p_pass_type
        WHEN 'Weekly' THEN SET v_price = 100.00;
        WHEN 'Monthly' THEN SET v_price = 350.00;
        WHEN 'Quarterly' THEN SET v_price = 900.00;
        WHEN 'Annual' THEN SET v_price = 3000.00;
        ELSE SET v_price = 0.00;
    END CASE;
    
    RETURN v_price;
END//
DELIMITER ;

-- Function 2: Check if pass is valid
DELIMITER //
CREATE FUNCTION is_pass_valid(p_pass_id INT)
RETURNS VARCHAR(10)
DETERMINISTIC
BEGIN
    DECLARE v_expiry DATE;
    DECLARE v_status VARCHAR(50);
    
    SELECT expiry_date, status INTO v_expiry, v_status
    FROM BusPass
    WHERE pass_id = p_pass_id;
    
    IF v_status = 'Active' AND v_expiry >= CURDATE() THEN
        RETURN 'VALID';
    ELSE
        RETURN 'INVALID';
    END IF;
END//
DELIMITER ;

-- Function 3: Calculate total maintenance cost for a bus
DELIMITER //
CREATE FUNCTION get_bus_maintenance_cost(p_bus_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_total_cost DECIMAL(10,2);
    
    SELECT COALESCE(SUM(cost), 0) INTO v_total_cost
    FROM Maintenance
    WHERE bus_id = p_bus_id;
    
    RETURN v_total_cost;
END//
DELIMITER ;

-- Function 4: Count active buses on a route
DELIMITER //
CREATE FUNCTION count_active_buses(p_route_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_count INT;
    
    SELECT COUNT(*) INTO v_count
    FROM Bus
    WHERE route_id = p_route_id AND status = 'Active';
    
    RETURN v_count;
END//
DELIMITER ;

-- Function 5: Get days until pass expiry
DELIMITER //
CREATE FUNCTION days_until_expiry(p_pass_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_days INT;
    DECLARE v_expiry DATE;
    
    SELECT expiry_date INTO v_expiry
    FROM BusPass
    WHERE pass_id = p_pass_id;
    
    SET v_days = DATEDIFF(v_expiry, CURDATE());
    
    RETURN v_days;
END//
DELIMITER ;

-- ============================================
-- DISPLAY SUCCESS MESSAGE
-- ============================================

SELECT 'Advanced DBMS features created successfully!' AS Status;
SELECT 'Created: 6 Views, 5 Triggers, 5 Stored Procedures, 5 Functions' AS Summary;
