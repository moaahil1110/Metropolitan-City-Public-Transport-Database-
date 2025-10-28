# Metropolitan City Public Transport Database
**DBMS Mini Project - Team 26**

A comprehensive database management system for metropolitan city public transport operations. Implements a normalized relational database (3NF) with 10 interconnected tables, demonstrating complex SQL queries, foreign key relationships, and transaction management. Includes a web-based interface for database interaction and visualization.

---

## 🚀 Quick Start Guide

### Prerequisites
- MySQL Server running
- Node.js installed
- Database already created (run SQL files first)

### Step 1: Start Backend Server

Open **Terminal 1**:
```bash
cd backend
npm start
```

You should see:
```
🚀 Server running on http://localhost:5001
✅ Connected to MySQL database
```

### Step 2: Start Frontend Server

Open **Terminal 2**:
```bash
cd frontend
npm start
```

Browser will automatically open at `http://localhost:3000`

**That's it! Your application is running!** 🎉

---

## 📁 Project Structure

```
Metropolitan-City-Public-Transport-Database-/
├── SQL-files/                    # Database scripts
│   ├── create_database.sql       # Creates database & tables
│   ├── insert_sample_data.sql    # Adds sample data
│   ├── demo_queries.sql          # Demo queries
│   └── verify_database.sql       # Verification
│
├── backend/                      # Node.js + Express API
│   ├── server.js                 # API server (40+ endpoints)
│   ├── package.json              # Dependencies
│   └── .env                      # Database config
│
├── frontend/                     # React + TailwindCSS UI
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── pages/                # 9 page components
│   │   ├── services/             # API integration
│   │   └── App.js                # Main app
│   └── package.json              # Dependencies
│
└── README.md                     # This file
```

---

## 🎨 Features

### 9 Complete Pages
1. **Dashboard** - Statistics overview with cards
2. **Users** - Add/view/delete users with search
3. **Routes** - Manage bus routes
4. **Buses** - Fleet management
5. **Bus Passes** - Issue passes with beautiful cards
6. **Bus Stops** - Manage stop locations
7. **Maintenance** - Track maintenance records
8. **Metro** - View metro network
9. **Contractors** - Manage service providers

### Key Features
- ✅ Full CRUD operations
- ✅ Real-time data from MySQL
- ✅ Modern, responsive UI
- ✅ Search & filter functionality
- ✅ Modal forms for data entry
- ✅ Status indicators
- ✅ Professional design

---

## 💾 Database Setup

### First Time Setup

1. **Access MySQL:**
```bash
mysqlroot
# Password: A@hilM.1110
```

2. **Create Database:**
```bash
source SQL-files/create_database.sql
```

3. **Add Sample Data:**
```bash
source SQL-files/insert_sample_data.sql
```

### Database Info
- **Name:** `metropolitan_transport`
- **Tables:** 10 tables with relationships
- **Sample Data:** Pre-populated with realistic data

---

## 🔧 Installation (First Time Only)

### Backend Dependencies
```bash
cd backend
npm install
```

### Frontend Dependencies
```bash
cd frontend
npm install
```

**Note:** You only need to run `npm install` once. After that, just use `npm start`.

---

## 🌐 Application URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001

---

## 📊 Database Design & Implementation

### Database Overview
- **Database Name:** `metropolitan_transport`
- **DBMS:** MySQL
- **Total Tables:** 10 (normalized to 3NF)
- **Relationships:** 8 foreign key constraints
- **Indexes:** 8 performance indexes
- **Sample Data:** Pre-populated with realistic records

### Entity-Relationship Model

#### Core Entities

**1. User (Passengers)**
```sql
- user_id (PK, AUTO_INCREMENT)
- name VARCHAR(100)
- contact_info VARCHAR(100)
- address VARCHAR(255)
```
Stores passenger information for the transport system.

**2. Route (Bus Routes)**
```sql
- route_id (PK, AUTO_INCREMENT)
- route_name VARCHAR(100)
- start_stop VARCHAR(100)
- end_stop VARCHAR(100)
- total_distance DECIMAL(10,2)
- status VARCHAR(50) DEFAULT 'Active'
```
Defines bus routes with start/end points and distance.

**3. Bus (Fleet Management)**
```sql
- bus_id (PK, AUTO_INCREMENT)
- route_id (FK → Route)
- registration_no VARCHAR(50) UNIQUE
- type VARCHAR(50)
- capacity INT
- status VARCHAR(50) DEFAULT 'Active'
```
Manages bus fleet with route assignments.

**4. BusPass (Ticketing)**
```sql
- pass_id (PK, AUTO_INCREMENT)
- user_id (FK → User, CASCADE)
- pass_type VARCHAR(50)
- issue_date DATE
- expiry_date DATE
- status VARCHAR(50) DEFAULT 'Active'
```
Tracks user passes with validity periods.

**5. BusStop (Stop Locations)**
```sql
- stop_id (PK, AUTO_INCREMENT)
- name VARCHAR(100)
- location VARCHAR(255)
- facilities VARCHAR(255)
```
Stores bus stop information and amenities.

**6. RouteBusStop (Many-to-Many Junction)**
```sql
- id (PK, AUTO_INCREMENT)
- route_id (FK → Route, CASCADE)
- stop_id (FK → BusStop, CASCADE)
- UNIQUE(route_id, stop_id)
```
Links routes with their stops (M:N relationship).

**7. Contractor (Service Providers)**
```sql
- contractor_id (PK, AUTO_INCREMENT)
- name VARCHAR(100)
- contact_details VARCHAR(100)
- service_type VARCHAR(100)
```
Manages external service contractors.

**8. Maintenance (Service Records)**
```sql
- maintenance_id (PK, AUTO_INCREMENT)
- contractor_id (FK → Contractor, SET NULL)
- bus_id (FK → Bus, CASCADE)
- details VARCHAR(500)
- maintenance_date DATE
- cost DECIMAL(10,2)
- entity_type VARCHAR(50)
- entity_id INT
```
Tracks maintenance activities and costs.

**9. MetroStop (Metro Stations)**
```sql
- metro_stop_id (PK, AUTO_INCREMENT)
- name VARCHAR(100)
- line VARCHAR(50)
- location VARCHAR(255)
- status VARCHAR(50) DEFAULT 'Active'
```
Stores metro station information by line.

**10. MetroConnection (Metro Network)**
```sql
- connection_id (PK, AUTO_INCREMENT)
- start_metro_stop_id (FK → MetroStop, CASCADE)
- end_metro_stop_id (FK → MetroStop, CASCADE)
- distance DECIMAL(10,2)
- travel_time INT
```
Defines connections between metro stations.

---

### Relationships & Constraints

#### Foreign Key Relationships
1. **Bus → Route** (Many-to-One)
   - ON DELETE SET NULL (bus can exist without route)

2. **BusPass → User** (Many-to-One)
   - ON DELETE CASCADE (pass deleted when user deleted)

3. **RouteBusStop → Route** (Many-to-One)
   - ON DELETE CASCADE (junction deleted when route deleted)

4. **RouteBusStop → BusStop** (Many-to-One)
   - ON DELETE CASCADE (junction deleted when stop deleted)

5. **Maintenance → Contractor** (Many-to-One)
   - ON DELETE SET NULL (maintenance record kept even if contractor removed)

6. **Maintenance → Bus** (Many-to-One)
   - ON DELETE CASCADE (maintenance deleted when bus deleted)

7. **MetroConnection → MetroStop (start)** (Many-to-One)
   - ON DELETE CASCADE

8. **MetroConnection → MetroStop (end)** (Many-to-One)
   - ON DELETE CASCADE

#### Unique Constraints
- `Bus.registration_no` - Ensures no duplicate bus registrations
- `RouteBusStop(route_id, stop_id)` - Prevents duplicate route-stop pairs

#### Default Values
- `status` fields default to 'Active' for operational entities

---

### Database Normalization

**First Normal Form (1NF):** ✅
- All attributes contain atomic values
- No repeating groups

**Second Normal Form (2NF):** ✅
- All non-key attributes fully dependent on primary key
- No partial dependencies

**Third Normal Form (3NF):** ✅
- No transitive dependencies
- Junction table (RouteBusStop) resolves M:N relationship

---

### Indexes for Performance

```sql
CREATE INDEX idx_bus_route ON Bus(route_id);
CREATE INDEX idx_buspass_user ON BusPass(user_id);
CREATE INDEX idx_maintenance_bus ON Maintenance(bus_id);
CREATE INDEX idx_maintenance_contractor ON Maintenance(contractor_id);
CREATE INDEX idx_routebusstop_route ON RouteBusStop(route_id);
CREATE INDEX idx_routebusstop_stop ON RouteBusStop(stop_id);
CREATE INDEX idx_metroconnection_start ON MetroConnection(start_metro_stop_id);
CREATE INDEX idx_metroconnection_end ON MetroConnection(end_metro_stop_id);
```

These indexes optimize JOIN operations and foreign key lookups.

---

### Sample Data Statistics

- **Users:** 5 passengers
- **Routes:** 5 bus routes
- **Buses:** 6 vehicles (5 active, 1 in maintenance)
- **Bus Passes:** 5 passes (Weekly, Monthly, Quarterly, Annual)
- **Bus Stops:** 10 locations
- **Route-Stop Mappings:** 10 relationships
- **Contractors:** 5 service providers
- **Maintenance Records:** 5 service entries
- **Metro Stops:** 8 stations across 4 lines
- **Metro Connections:** 6 inter-station links

---

### Database Operations Demonstrated

#### CRUD Operations
- **CREATE:** Insert new users, routes, buses, passes
- **READ:** Query with JOINs, aggregations, filtering
- **UPDATE:** Modify bus status, pass validity, route details
- **DELETE:** Remove records with CASCADE effects

#### Complex Queries
- **Aggregation:** COUNT buses per route, SUM maintenance costs
- **JOIN:** Multi-table queries (3-4 table joins)
- **GROUP BY:** Statistics by route, contractor, date
- **Subqueries:** Nested SELECT for dashboard stats
- **LEFT JOIN:** Include routes without buses

#### Transaction Support
- Referential integrity maintained
- Cascading deletes handled properly
- NULL handling for optional relationships

---

## 🎯 For Presentation

1. **Start both servers** (backend first, then frontend)
2. **Open** http://localhost:3000
3. **Navigate through pages:**
   - Dashboard for overview
   - Users to show CRUD operations
   - Routes and Buses to show relationships
   - Bus Passes to show the pass system
   - Maintenance to show tracking

---

## 🐛 Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify password in `backend/.env`
- Make sure port 5001 is free

### Frontend won't start
- Wait for compilation (30-60 seconds first time)
- Check if backend is running first
- Make sure port 3000 is free

### "Cannot connect to server"
- Ensure backend shows "Connected to MySQL database"
- Check that database exists
- Verify sample data is loaded

---

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TailwindCSS
- React Router
- Axios
- Lucide React (icons)

**Backend:**
- Node.js
- Express
- MySQL2
- CORS

**Database:**
- MySQL

---

## 📝 API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - System statistics

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes` - Create route
- `PUT /api/routes/:id` - Update route
- `DELETE /api/routes/:id` - Delete route

### Buses
- `GET /api/buses` - Get all buses
- `POST /api/buses` - Create bus
- `PUT /api/buses/:id` - Update bus
- `DELETE /api/buses/:id` - Delete bus

### Bus Passes
- `GET /api/bus-passes` - Get all passes
- `POST /api/bus-passes` - Issue pass

### Bus Stops
- `GET /api/bus-stops` - Get all stops
- `POST /api/bus-stops` - Create stop

### Maintenance
- `GET /api/maintenance` - Get records
- `POST /api/maintenance` - Create record

### Metro
- `GET /api/metro-stops` - Get stations
- `GET /api/metro-connections` - Get connections

### Contractors
- `GET /api/contractors` - Get all contractors
- `POST /api/contractors` - Create contractor

---

## 👨‍💻 Development

### Backend (with auto-reload)
```bash
cd backend
npm run dev  # If nodemon is installed
```

### Frontend (already has hot reload)
```bash
cd frontend
npm start
```

---

## 📄 Project Files

### SQL Files
- `create_database.sql` - Database schema
- `insert_sample_data.sql` - Sample data
- `demo_queries.sql` - Example queries
- `verify_database.sql` - Verification queries

### Configuration
- `backend/.env` - Database credentials
- `frontend/tailwind.config.js` - Styling config
- `frontend/package.json` - Frontend dependencies
- `backend/package.json` - Backend dependencies

---

## ✅ Project Status

**COMPLETE & READY FOR PRESENTATION**

- ✅ Database created with 10 tables
- ✅ Backend API with 40+ endpoints
- ✅ Frontend UI with 9 pages
- ✅ Full CRUD operations working
- ✅ Sample data loaded
- ✅ Professional design
- ✅ All components integrated

---

## 🎓 Academic Info

**Course:** Database Management System  
**Semester:** 5  
**Team:** Team 26  
**Project Type:** Mini Project

---

## 📞 Support

If something doesn't work:
1. Check MySQL is running
2. Verify both servers are started
3. Check browser console for errors
4. Ensure database is created and populated

---

**Made with ❤️ for DBMS Mini Project**
