# 🚗 Lebanon Traffic Dashboard

Full-stack traffic monitoring dashboard with authentication, CSV ingestion, and map visualization.
Developed for **CSC443 – Web Programming** at the **Lebanese American University (LAU)**.

---

# Team Members

   * Mohammad El Dayeh
   * Tarek Al Saleh
   * Ayman Kacan
   * Hasan Sayour

---

## 📘 Project Description

The **Lebanon Traffic Dashboard** is a full-stack web application developed as part of the **CSC443 – Web Programming** course at the Lebanese American University (LAU). The project focuses on applying modern web development concepts to build a complete, data-driven system that visualizes real GPS traffic data from Lebanon.

The platform includes:

* A secure **Node.js + Express** backend with JWT-based authentication
* A **React + Vite** frontend that displays interactive maps, charts, and traffic statistics
* A **MySQL** database structured for large-scale geospatial datasets
* Scripts for importing CSV traffic data and generating sample users
* An activity logging system for tracking user actions

This project demonstrates practical skills in **REST API design**, **frontend development**, **database management**, and **full-stack integration**, reflecting the main learning outcomes of CSC443. It serves both as a functional traffic analysis tool and a comprehensive example of modern web programming practices.

---

# ⚙️ Setup Guide

## 🛑 Requirements

Make sure you have installed:

* **Node.js** (v18+)
* **MySQL Server**
* **Git**
* **PowerShell / Terminal**

---

# 🏗️ Backend Setup

## **Step 0 — Initialize the Database**

```powershell
Get-Content "server/sql/init.sql" | mysql -u root -p
```

## **Step 1 — Create the `.env` File**

```powershell
cd server
copy .env.example .env
```

## **Step 2 — Edit `.env`**

Open `server/.env` and fill in your MySQL settings:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=lebanon_traffic

JWT_SECRET=any_random_secret_string_here
```

## **Step 3 — Install Server Dependencies**

```powershell
npm install
```

## **Step 4 — Create Sample Users**

```powershell
npm run create-users
```

## **Step 5 — Import CSV Data**

```powershell
npm run load-data
```

## **Step 6 — Start the Backend Server**

```powershell
npm start
```

You should now see:

```
Server listening on http://localhost:4000
```

Keep this terminal open.

---

# 🎨 Frontend Setup

Open a **new** PowerShell/Terminal window.

## **Step 7 — Install Frontend Dependencies**

```powershell
cd ..
npm install
```

## **Step 8 — Start the Frontend**

```powershell
npm run dev
```

---

# 🌐 Access the Dashboard

Open your browser and go to:

```
http://localhost:5173/
```

### Test Login (sample user)

| Username | Password     |
| -------- | ------------ |
| admin    | AdminPass123 |

---

# 📁 Project Structure

```
root/
├── public/
│   └── data/
├── server/
│   ├── logs/
│   ├── sql/
│   ├── create_users.js
│   ├── db.js
│   ├── index.js
│   ├── loadData.js
│   ├── logger.js
│   ├── package-lock.json
│   └── package.json
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── DataTable.jsx
│   │   ├── DataVisualization.jsx
│   │   ├── Filters.jsx
│   │   ├── GovernorateStatistics.jsx
│   │   ├── Histogram.jsx
│   │   ├── Login.jsx
│   │   └── Statistics.jsx
│   ├── utils/
│   │   └── dataUtils.js
│   ├── App.jsx
│   └── Main.jsx
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

---

# 🔐 Authentication Flow

1. User logs in via `/api/auth/login`.
2. Server checks password using **bcrypt**.
3. A **JWT** is issued (`expiresIn: 2h`).
4. Frontend stores token in localStorage.
5. All protected routes include:

   ```
   Authorization: Bearer <token>
   ```

---

# 📝 Activity Logging

The backend logs actions such as:

* Login attempts (success/failure)
* Data fetching
* CSV imports
* User actions

Stored in `logs/activity.log`.

---

# 🛠️ Tech Stack

| Layer    | Technology           |
| -------- | -------------------- |
| Frontend | React + Vite         |
| Backend  | Node.js + Express    |
| Database | MySQL                |
| Auth     | JWT + bcrypt         |
| Styling  | CSS / MUI            |

---



