-- Demo Queries for Metropolitan City Public Transport Database
-- Useful queries to demonstrate database functionality

USE metropolitan_transport;

-- ============================================
-- 1. USER MANAGEMENT QUERIES
-- ============================================

-- View all users with their active bus passes
SELECT 
    u.user_id,
    u.name,
    u.contact_info,
    bp.pass_type,
    bp.issue_date,
    bp.expiry_date,
    bp.status
FROM User u
LEFT JOIN BusPass bp ON u.user_id = bp.user_id
WHERE bp.status = 'Active' OR bp.status IS NULL;

-- Find users with expiring passes (within 7 days)
SELECT 
    u.name,
    u.contact_info,
    bp.pass_type,
    bp.expiry_date,
    DATEDIFF(bp.expiry_date, CURDATE()) AS days_remaining
FROM User u
JOIN BusPass bp ON u.user_id = bp.user_id
WHERE bp.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
AND bp.status = 'Active';

-- ============================================
-- 2. ROUTE AND BUS QUERIES
-- ============================================

-- View all routes with bus count
SELECT 
    r.route_id,
    r.route_name,
    r.start_stop,
    r.end_stop,
    r.total_distance,
    COUNT(b.bus_id) AS number_of_buses
FROM Route r
LEFT JOIN Bus b ON r.route_id = b.route_id
GROUP BY r.route_id;

-- View buses with their route information
SELECT 
    b.bus_id,
    b.registration_no,
    b.type,
    b.capacity,
    b.status AS bus_status,
    r.route_name,
    r.start_stop,
    r.end_stop
FROM Bus b
LEFT JOIN Route r ON b.route_id = r.route_id
ORDER BY r.route_name;

-- Find buses that need maintenance (status = 'Maintenance')
SELECT 
    b.bus_id,
    b.registration_no,
    b.type,
    r.route_name,
    b.status
FROM Bus b
LEFT JOIN Route r ON b.route_id = r.route_id
WHERE b.status = 'Maintenance';

-- ============================================
-- 3. BUS STOP QUERIES
-- ============================================

-- View all bus stops with their routes
SELECT 
    bs.stop_id,
    bs.name,
    bs.location,
    bs.facilities,
    GROUP_CONCAT(r.route_name SEPARATOR ', ') AS routes
FROM BusStop bs
LEFT JOIN RouteBusStop rbs ON bs.stop_id = rbs.stop_id
LEFT JOIN Route r ON rbs.route_id = r.route_id
GROUP BY bs.stop_id;

-- Find stops with specific facilities (e.g., Digital Display)
SELECT 
    name,
    location,
    facilities
FROM BusStop
WHERE facilities LIKE '%Digital Display%';

-- ============================================
-- 4. MAINTENANCE QUERIES
-- ============================================

-- View all maintenance records with details
SELECT 
    m.maintenance_id,
    m.maintenance_date,
    b.registration_no,
    b.type AS bus_type,
    c.name AS contractor_name,
    m.details,
    m.cost
FROM Maintenance m
JOIN Bus b ON m.bus_id = b.bus_id
LEFT JOIN Contractor c ON m.contractor_id = c.contractor_id
ORDER BY m.maintenance_date DESC;

-- Calculate total maintenance cost per bus
SELECT 
    b.bus_id,
    b.registration_no,
    COUNT(m.maintenance_id) AS maintenance_count,
    SUM(m.cost) AS total_cost,
    AVG(m.cost) AS average_cost
FROM Bus b
LEFT JOIN Maintenance m ON b.bus_id = m.bus_id
GROUP BY b.bus_id
ORDER BY total_cost DESC;

-- Find contractors and their total service value
SELECT 
    c.contractor_id,
    c.name,
    c.service_type,
    COUNT(m.maintenance_id) AS jobs_completed,
    SUM(m.cost) AS total_revenue
FROM Contractor c
LEFT JOIN Maintenance m ON c.contractor_id = m.contractor_id
GROUP BY c.contractor_id
ORDER BY total_revenue DESC;

-- ============================================
-- 5. METRO SYSTEM QUERIES
-- ============================================

-- View all metro lines with their stops
SELECT 
    line,
    COUNT(*) AS number_of_stops,
    GROUP_CONCAT(name SEPARATOR ', ') AS stops
FROM MetroStop
GROUP BY line;

-- View metro connections with travel details
SELECT 
    ms1.name AS start_station,
    ms1.line AS start_line,
    ms2.name AS end_station,
    ms2.line AS end_line,
    mc.distance,
    mc.travel_time,
    ROUND(mc.distance / mc.travel_time * 60, 2) AS avg_speed_kmph
FROM MetroConnection mc
JOIN MetroStop ms1 ON mc.start_metro_stop_id = ms1.metro_stop_id
JOIN MetroStop ms2 ON mc.end_metro_stop_id = ms2.metro_stop_id;

-- Find interchange stations (connected to multiple lines)
SELECT 
    ms.name,
    ms.location,
    COUNT(DISTINCT mc.connection_id) AS connections
FROM MetroStop ms
JOIN MetroConnection mc ON ms.metro_stop_id = mc.start_metro_stop_id 
    OR ms.metro_stop_id = mc.end_metro_stop_id
GROUP BY ms.metro_stop_id
HAVING connections > 1
ORDER BY connections DESC;

-- ============================================
-- 6. STATISTICAL QUERIES
-- ============================================

-- Overall system statistics
SELECT 
    (SELECT COUNT(*) FROM User) AS total_users,
    (SELECT COUNT(*) FROM Route) AS total_routes,
    (SELECT COUNT(*) FROM Bus) AS total_buses,
    (SELECT COUNT(*) FROM BusStop) AS total_bus_stops,
    (SELECT COUNT(*) FROM MetroStop) AS total_metro_stops,
    (SELECT COUNT(*) FROM BusPass WHERE status = 'Active') AS active_passes;

-- Revenue statistics from bus passes (assuming prices)
SELECT 
    pass_type,
    COUNT(*) AS number_of_passes,
    CASE pass_type
        WHEN 'Weekly' THEN COUNT(*) * 100
        WHEN 'Monthly' THEN COUNT(*) * 350
        WHEN 'Quarterly' THEN COUNT(*) * 900
        WHEN 'Annual' THEN COUNT(*) * 3000
    END AS estimated_revenue
FROM BusPass
WHERE status = 'Active'
GROUP BY pass_type;

-- Bus utilization by type
SELECT 
    type,
    COUNT(*) AS number_of_buses,
    AVG(capacity) AS average_capacity,
    SUM(capacity) AS total_capacity
FROM Bus
GROUP BY type;

-- ============================================
-- 7. COMPLEX QUERIES
-- ============================================

-- Find routes with the most stops
SELECT 
    r.route_name,
    r.start_stop,
    r.end_stop,
    COUNT(rbs.stop_id) AS number_of_stops
FROM Route r
LEFT JOIN RouteBusStop rbs ON r.route_id = rbs.route_id
GROUP BY r.route_id
ORDER BY number_of_stops DESC;

-- Find users who need to renew their passes soon
SELECT 
    u.name,
    u.contact_info,
    bp.pass_type,
    bp.expiry_date,
    CASE 
        WHEN DATEDIFF(bp.expiry_date, CURDATE()) < 0 THEN 'EXPIRED'
        WHEN DATEDIFF(bp.expiry_date, CURDATE()) <= 7 THEN 'EXPIRING SOON'
        ELSE 'ACTIVE'
    END AS pass_status
FROM User u
JOIN BusPass bp ON u.user_id = bp.user_id
WHERE bp.status = 'Active'
ORDER BY bp.expiry_date;

-- Maintenance cost analysis by month
SELECT 
    DATE_FORMAT(maintenance_date, '%Y-%m') AS month,
    COUNT(*) AS maintenance_count,
    SUM(cost) AS total_cost,
    AVG(cost) AS average_cost
FROM Maintenance
GROUP BY DATE_FORMAT(maintenance_date, '%Y-%m')
ORDER BY month DESC;
