const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

// Helper function for queries
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// ============================================
// DASHBOARD & STATISTICS
// ============================================

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM User) AS total_users,
        (SELECT COUNT(*) FROM Route) AS total_routes,
        (SELECT COUNT(*) FROM Bus) AS total_buses,
        (SELECT COUNT(*) FROM Bus WHERE status = 'Active') AS active_buses,
        (SELECT COUNT(*) FROM BusStop) AS total_bus_stops,
        (SELECT COUNT(*) FROM MetroStop) AS total_metro_stops,
        (SELECT COUNT(*) FROM BusPass WHERE status = 'Active') AS active_passes,
        (SELECT SUM(cost) FROM Maintenance) AS total_maintenance_cost
    `);
    res.json(stats[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// USER ROUTES
// ============================================

app.get('/api/users', async (req, res) => {
  try {
    const users = await query('SELECT * FROM User ORDER BY user_id DESC');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await query('SELECT * FROM User WHERE user_id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, contact_info, address } = req.body;
    const result = await query(
      'INSERT INTO User (name, contact_info, address) VALUES (?, ?, ?)',
      [name, contact_info, address]
    );
    res.status(201).json({ id: result.insertId, message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, contact_info, address } = req.body;
    await query(
      'UPDATE User SET name = ?, contact_info = ?, address = ? WHERE user_id = ?',
      [name, contact_info, address, req.params.id]
    );
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await query('DELETE FROM User WHERE user_id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// ROUTE ROUTES
// ============================================

app.get('/api/routes', async (req, res) => {
  try {
    const routes = await query(`
      SELECT 
        r.*,
        COUNT(DISTINCT b.bus_id) AS bus_count,
        COUNT(DISTINCT rbs.stop_id) AS stop_count
      FROM Route r
      LEFT JOIN Bus b ON r.route_id = b.route_id
      LEFT JOIN RouteBusStop rbs ON r.route_id = rbs.route_id
      GROUP BY r.route_id
      ORDER BY r.route_id DESC
    `);
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/routes/:id', async (req, res) => {
  try {
    const routes = await query('SELECT * FROM Route WHERE route_id = ?', [req.params.id]);
    if (routes.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(routes[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/routes', async (req, res) => {
  try {
    const { route_name, start_stop, end_stop, total_distance, status } = req.body;
    const result = await query(
      'INSERT INTO Route (route_name, start_stop, end_stop, total_distance, status) VALUES (?, ?, ?, ?, ?)',
      [route_name, start_stop, end_stop, total_distance, status || 'Active']
    );
    res.status(201).json({ id: result.insertId, message: 'Route created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/routes/:id', async (req, res) => {
  try {
    const { route_name, start_stop, end_stop, total_distance, status } = req.body;
    await query(
      'UPDATE Route SET route_name = ?, start_stop = ?, end_stop = ?, total_distance = ?, status = ? WHERE route_id = ?',
      [route_name, start_stop, end_stop, total_distance, status, req.params.id]
    );
    res.json({ message: 'Route updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/routes/:id', async (req, res) => {
  try {
    await query('DELETE FROM Route WHERE route_id = ?', [req.params.id]);
    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// BUS ROUTES
// ============================================

app.get('/api/buses', async (req, res) => {
  try {
    const buses = await query(`
      SELECT 
        b.*,
        r.route_name,
        r.start_stop,
        r.end_stop
      FROM Bus b
      LEFT JOIN Route r ON b.route_id = r.route_id
      ORDER BY b.bus_id DESC
    `);
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/buses', async (req, res) => {
  try {
    const { route_id, registration_no, type, capacity, status } = req.body;
    const result = await query(
      'INSERT INTO Bus (route_id, registration_no, type, capacity, status) VALUES (?, ?, ?, ?, ?)',
      [route_id, registration_no, type, capacity, status || 'Active']
    );
    res.status(201).json({ id: result.insertId, message: 'Bus created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/buses/:id', async (req, res) => {
  try {
    const { route_id, registration_no, type, capacity, status } = req.body;
    await query(
      'UPDATE Bus SET route_id = ?, registration_no = ?, type = ?, capacity = ?, status = ? WHERE bus_id = ?',
      [route_id, registration_no, type, capacity, status, req.params.id]
    );
    res.json({ message: 'Bus updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/buses/:id', async (req, res) => {
  try {
    await query('DELETE FROM Bus WHERE bus_id = ?', [req.params.id]);
    res.json({ message: 'Bus deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// BUS PASS ROUTES
// ============================================

app.get('/api/bus-passes', async (req, res) => {
  try {
    const passes = await query(`
      SELECT 
        bp.*,
        u.name AS user_name,
        u.contact_info
      FROM BusPass bp
      JOIN User u ON bp.user_id = u.user_id
      ORDER BY bp.pass_id DESC
    `);
    res.json(passes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bus-passes', async (req, res) => {
  try {
    const { user_id, pass_type, issue_date } = req.body;
    console.log('Creating bus pass:', { user_id, pass_type, issue_date });
    
    // Use stored procedure to auto-calculate expiry date
    const result = await query(
      'CALL issue_bus_pass(?, ?, ?)',
      [user_id, pass_type, issue_date]
    );
    
    console.log('Stored procedure result:', JSON.stringify(result, null, 2));
    
    // MySQL stored procedure returns array of result sets
    // First element [0] is the result set, second [1] is metadata
    const passInfo = result[0][0];
    
    res.status(201).json({ 
      id: passInfo.pass_id, 
      message: passInfo.message 
    });
  } catch (err) {
    console.error('Error creating bus pass:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/bus-passes/:id', async (req, res) => {
  try {
    await query('DELETE FROM BusPass WHERE pass_id = ?', [req.params.id]);
    res.json({ message: 'Bus pass deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// BUS STOP ROUTES
// ============================================

app.get('/api/bus-stops', async (req, res) => {
  try {
    const stops = await query(`
      SELECT 
        bs.*,
        COUNT(DISTINCT rbs.route_id) AS route_count
      FROM BusStop bs
      LEFT JOIN RouteBusStop rbs ON bs.stop_id = rbs.stop_id
      GROUP BY bs.stop_id
      ORDER BY bs.stop_id DESC
    `);
    res.json(stops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bus-stops', async (req, res) => {
  try {
    const { name, location, facilities } = req.body;
    const result = await query(
      'INSERT INTO BusStop (name, location, facilities) VALUES (?, ?, ?)',
      [name, location, facilities]
    );
    res.status(201).json({ id: result.insertId, message: 'Bus stop created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// MAINTENANCE ROUTES
// ============================================

app.get('/api/maintenance', async (req, res) => {
  try {
    const maintenance = await query(`
      SELECT 
        m.*,
        b.registration_no,
        b.type AS bus_type,
        c.name AS contractor_name
      FROM Maintenance m
      JOIN Bus b ON m.bus_id = b.bus_id
      LEFT JOIN Contractor c ON m.contractor_id = c.contractor_id
      ORDER BY m.maintenance_date DESC
    `);
    res.json(maintenance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/maintenance', async (req, res) => {
  try {
    const { contractor_id, bus_id, details, maintenance_date, cost, entity_type, entity_id } = req.body;
    const result = await query(
      'INSERT INTO Maintenance (contractor_id, bus_id, details, maintenance_date, cost, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [contractor_id, bus_id, details, maintenance_date, cost, entity_type, entity_id]
    );
    res.status(201).json({ id: result.insertId, message: 'Maintenance record created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// METRO ROUTES
// ============================================

app.get('/api/metro-stops', async (req, res) => {
  try {
    const stops = await query('SELECT * FROM MetroStop ORDER BY metro_stop_id DESC');
    res.json(stops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/metro-connections', async (req, res) => {
  try {
    const connections = await query(`
      SELECT 
        mc.*,
        ms1.name AS start_station,
        ms1.line AS start_line,
        ms2.name AS end_station,
        ms2.line AS end_line
      FROM MetroConnection mc
      JOIN MetroStop ms1 ON mc.start_metro_stop_id = ms1.metro_stop_id
      JOIN MetroStop ms2 ON mc.end_metro_stop_id = ms2.metro_stop_id
      ORDER BY mc.connection_id DESC
    `);
    res.json(connections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// CONTRACTOR ROUTES
// ============================================

app.get('/api/contractors', async (req, res) => {
  try {
    const contractors = await query(`
      SELECT 
        c.*,
        COUNT(m.maintenance_id) AS total_jobs,
        COALESCE(SUM(m.cost), 0) AS total_revenue
      FROM Contractor c
      LEFT JOIN Maintenance m ON c.contractor_id = m.contractor_id
      GROUP BY c.contractor_id
      ORDER BY c.contractor_id DESC
    `);
    res.json(contractors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contractors', async (req, res) => {
  try {
    const { name, contact_details, service_type } = req.body;
    const result = await query(
      'INSERT INTO Contractor (name, contact_details, service_type) VALUES (?, ?, ?)',
      [name, contact_details, service_type]
    );
    res.status(201).json({ id: result.insertId, message: 'Contractor created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
