# Metropolitan City Public Transport Database
**DBMS Mini Project - Team 26**

A full-stack web application for managing metropolitan city public transport systems including buses, metro, routes, users, passes, and maintenance.

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

## 📊 Database Schema

### Tables Created
1. **User** - Passenger information
2. **Route** - Bus route details
3. **Bus** - Fleet information
4. **BusPass** - Pass records
5. **BusStop** - Stop locations
6. **RouteBusStop** - Route-Stop relationships
7. **Contractor** - Service providers
8. **Maintenance** - Maintenance records
9. **MetroStop** - Metro stations
10. **MetroConnection** - Metro connections

All tables have proper foreign keys, indexes, and constraints.

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
