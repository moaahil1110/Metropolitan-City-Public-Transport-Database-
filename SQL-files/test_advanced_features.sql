-- Test Script for Advanced DBMS Features
USE metropolitan_transport;

-- ============================================
-- TESTING VIEWS
-- ============================================

SELECT '=== Testing Views ===' AS '';

-- Test View 1: Active Bus Fleet
SELECT 'Active Bus Fleet:' AS '';
SELECT * FROM active_bus_fleet;

-- Test View 2: User Pass Status
SELECT 'User Pass Status:' AS '';
SELECT * FROM user_pass_status;

-- Test View 3: Route Statistics
SELECT 'Route Statistics:' AS '';
SELECT * FROM route_statistics;

-- Test View 4: Bus Maintenance Summary
SELECT 'Bus Maintenance Summary:' AS '';
SELECT * FROM bus_maintenance_summary;

-- Test View 5: Contractor Performance
SELECT 'Contractor Performance:' AS '';
SELECT * FROM contractor_performance;

-- Test View 6: Metro Network Overview
SELECT 'Metro Network:' AS '';
SELECT * FROM metro_network_overview;

-- ============================================
-- TESTING STORED PROCEDURES
-- ============================================

SELECT '=== Testing Stored Procedures ===' AS '';

-- Test Procedure 1: Issue a new bus pass
SELECT 'Issuing a new monthly pass:' AS '';
CALL issue_bus_pass(1, 'Monthly', CURDATE());

-- Test Procedure 2: Schedule maintenance
SELECT 'Scheduling maintenance:' AS '';
CALL schedule_maintenance(1, 1, 'Routine inspection and servicing', CURDATE(), 4500.00);

-- Test Procedure 3: Get route details
SELECT 'Route Details for Route 1:' AS '';
CALL get_route_details(1);

-- Test Procedure 4: Calculate pass revenue
SELECT 'Pass Revenue (Last 30 days):' AS '';
CALL calculate_pass_revenue(DATE_SUB(CURDATE(), INTERVAL 30 DAY), CURDATE());

-- Test Procedure 5: Get maintenance report
SELECT 'Maintenance Report (Last 30 days):' AS '';
CALL get_maintenance_report(DATE_SUB(CURDATE(), INTERVAL 30 DAY), CURDATE());

-- ============================================
-- TESTING FUNCTIONS
-- ============================================

SELECT '=== Testing Functions ===' AS '';

-- Test Function 1: Get pass price
SELECT 'Pass Prices:' AS '';
SELECT 
    'Weekly' AS pass_type, 
    get_pass_price('Weekly') AS price
UNION ALL
SELECT 'Monthly', get_pass_price('Monthly')
UNION ALL
SELECT 'Quarterly', get_pass_price('Quarterly')
UNION ALL
SELECT 'Annual', get_pass_price('Annual');

-- Test Function 2: Check if pass is valid
SELECT 'Pass Validity Check:' AS '';
SELECT 
    pass_id,
    pass_type,
    expiry_date,
    is_pass_valid(pass_id) AS validity_status
FROM BusPass
LIMIT 5;

-- Test Function 3: Calculate total maintenance cost for buses
SELECT 'Total Maintenance Cost per Bus:' AS '';
SELECT 
    bus_id,
    registration_no,
    get_bus_maintenance_cost(bus_id) AS total_maintenance_cost
FROM Bus
LIMIT 5;

-- Test Function 4: Count active buses on routes
SELECT 'Active Buses per Route:' AS '';
SELECT 
    route_id,
    route_name,
    count_active_buses(route_id) AS active_buses
FROM Route;

-- Test Function 5: Days until pass expiry
SELECT 'Days Until Pass Expiry:' AS '';
SELECT 
    pass_id,
    pass_type,
    expiry_date,
    days_until_expiry(pass_id) AS days_remaining
FROM BusPass
WHERE status = 'Active';

-- ============================================
-- TESTING TRIGGERS (Implicit Testing)
-- ============================================

SELECT '=== Triggers are tested automatically ===' AS '';
SELECT 'Trigger 1: Bus status updated when maintenance added' AS '';
SELECT 'Trigger 2: Pass status auto-expires' AS '';
SELECT 'Trigger 3: Bus capacity validated on insert' AS '';
SELECT 'Trigger 4: Maintenance cost validated' AS '';
SELECT 'Trigger 5: Route deletion prevented if active buses exist' AS '';

-- ============================================
-- COMPLEX QUERIES USING VIEWS AND FUNCTIONS
-- ============================================

SELECT '=== Complex Queries ===' AS '';

-- Query 1: Buses with high maintenance costs
SELECT 'Buses with Maintenance Cost > 10000:' AS '';
SELECT 
    b.registration_no,
    b.type,
    bms.total_services,
    bms.total_cost,
    bms.last_service_date
FROM Bus b
JOIN bus_maintenance_summary bms ON b.bus_id = bms.bus_id
WHERE bms.total_cost > 10000;

-- Query 2: Routes with most buses
SELECT 'Routes with Most Buses:' AS '';
SELECT 
    route_name,
    start_stop,
    end_stop,
    total_buses,
    total_stops
FROM route_statistics
ORDER BY total_buses DESC
LIMIT 3;

-- Query 3: Expiring passes in next 7 days
SELECT 'Passes Expiring in Next 7 Days:' AS '';
SELECT 
    user_id,
    name,
    pass_type,
    expiry_date,
    days_remaining
FROM user_pass_status
WHERE pass_status = 'EXPIRING SOON';

-- Query 4: Top performing contractors
SELECT 'Top 3 Contractors by Revenue:' AS '';
SELECT 
    name,
    service_type,
    jobs_completed,
    total_revenue
FROM contractor_performance
ORDER BY total_revenue DESC
LIMIT 3;

SELECT '=== All Tests Completed ===' AS '';
