# Quick Start - Local Database Setup

## 🚀 Fastest Setup (SQLite - 2 minutes)

1. **Install SQLite driver:**
   ```bash
   npm install better-sqlite3
   # or
   yarn add better-sqlite3
   ```

2. **Create `.env` file:**
   ```bash
   cp env.example .env
   ```

3. **Edit `.env` - Set these values:**
   ```env
   DB_TYPE=sqlite
   DB_DATABASE=database.sqlite
   ```

4. **Start the backend:**
   ```bash
   npm run start:dev
   ```

✅ **Done!** The database will be created automatically at `backend/database.sqlite`

---

## 🐳 Alternative: PostgreSQL via Docker

If you prefer PostgreSQL (more production-like):

1. **Start PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

2. **Edit `.env`:**
   ```env
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=streamsync
   DB_PASSWORD=streamsync123
   DB_DATABASE=streamsync_db
   ```

3. **Start the backend:**
   ```bash
   npm run start:dev
   ```

---

## 📝 Notes

- **SQLite** is recommended for local development (zero setup)
- **PostgreSQL** via Docker is better if you want to test production-like scenarios
- The database schema will be created automatically when you start the app (in development mode)
- See `LOCAL_DATABASE_SETUP.md` for detailed information

