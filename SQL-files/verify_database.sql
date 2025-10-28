-- Verification Script for Metropolitan City Public Transport Database
USE metropolitan_transport;

-- Show all tables
SHOW TABLES;

-- Show table structures
DESCRIBE User;
DESCRIBE Route;
DESCRIBE Bus;
DESCRIBE BusPass;
DESCRIBE BusStop;
DESCRIBE RouteBusStop;
DESCRIBE Contractor;
DESCRIBE Maintenance;
DESCRIBE MetroStop;
DESCRIBE MetroConnection;

-- Show sample data from each table
SELECT '=== USERS ===' AS '';
SELECT * FROM User LIMIT 3;

SELECT '=== ROUTES ===' AS '';
SELECT * FROM Route LIMIT 3;

SELECT '=== BUSES ===' AS '';
SELECT * FROM Bus LIMIT 3;

SELECT '=== BUS PASSES ===' AS '';
SELECT * FROM BusPass LIMIT 3;

SELECT '=== BUS STOPS ===' AS '';
SELECT * FROM BusStop LIMIT 3;

SELECT '=== CONTRACTORS ===' AS '';
SELECT * FROM Contractor LIMIT 3;

SELECT '=== MAINTENANCE ===' AS '';
SELECT * FROM Maintenance LIMIT 3;

SELECT '=== METRO STOPS ===' AS '';
SELECT * FROM MetroStop LIMIT 3;

SELECT '=== METRO CONNECTIONS ===' AS '';
SELECT * FROM MetroConnection LIMIT 3;

-- Show foreign key relationships
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'metropolitan_transport'
AND REFERENCED_TABLE_NAME IS NOT NULL;
