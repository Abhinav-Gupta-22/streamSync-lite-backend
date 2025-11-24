# Local Database Setup Guide

Since AWS RDS is not available, here are two easy alternatives for local development:

## Option 1: SQLite (Recommended - Easiest)

SQLite is a file-based database that requires **zero setup**. Perfect for local development.

### Setup Steps:

1. **Update your `.env` file:**
   ```env
   DB_TYPE=sqlite
   DB_DATABASE=database.sqlite
   ```

2. **Install the SQLite driver:**
   ```bash
   npm install better-sqlite3
   # or
   yarn add better-sqlite3
   ```

3. **That's it!** The database file will be created automatically when you start the app.

### Advantages:
- ✅ No installation required
- ✅ No server to run
- ✅ Database stored in a single file (`database.sqlite`)
- ✅ Perfect for development and testing
- ✅ Works offline

### Disadvantages:
- ❌ Not suitable for production (use PostgreSQL instead)
- ❌ Limited concurrent writes

---

## Option 2: PostgreSQL via Docker (More Production-like)

If you want to use PostgreSQL locally (similar to production), use Docker.

### Prerequisites:
- [Docker](https://www.docker.com/get-started) installed on your machine

### Setup Steps:

1. **Start PostgreSQL container:**
   ```bash
   docker-compose up -d
   ```

2. **Update your `.env` file:**
   ```env
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=streamsync
   DB_PASSWORD=streamsync123
   DB_DATABASE=streamsync_db
   ```

3. **Start your backend:**
   ```bash
   npm run start:dev
   ```

### Docker Commands:

- **Start database:** `docker-compose up -d`
- **Stop database:** `docker-compose down`
- **View logs:** `docker-compose logs -f postgres`
- **Reset database:** `docker-compose down -v` (removes all data)

### Advantages:
- ✅ More similar to production environment
- ✅ Better for testing PostgreSQL-specific features
- ✅ Supports concurrent connections
- ✅ Easy to reset (just restart container)

---

## Quick Start (SQLite - Recommended)

1. Copy the example env file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and set:
   ```env
   DB_TYPE=sqlite
   DB_DATABASE=database.sqlite
   ```

3. Install SQLite driver:
   ```bash
   npm install better-sqlite3
   ```

4. Start the backend:
   ```bash
   npm run start:dev
   ```

The database will be automatically created at `backend/database.sqlite`.

---

## Switching Between Databases

You can easily switch between SQLite and PostgreSQL by changing the `DB_TYPE` in your `.env` file:

- `DB_TYPE=sqlite` → Uses SQLite (file-based)
- `DB_TYPE=postgres` → Uses PostgreSQL (requires Docker or local installation)

---

## Troubleshooting

### SQLite Issues:
- **"better-sqlite3 not found"**: Run `npm install better-sqlite3`
- **Permission errors**: Make sure the backend directory is writable

### PostgreSQL Issues:
- **Connection refused**: Make sure Docker container is running (`docker-compose ps`)
- **Port already in use**: Change `DB_PORT` in `.env` or stop other PostgreSQL instances
- **Authentication failed**: Check username/password in `.env` matches `docker-compose.yml`

---

## Production

For production, use AWS RDS or another managed PostgreSQL service. Update your production `.env` with:
```env
DB_TYPE=postgres
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=your_production_username
DB_PASSWORD=your_secure_production_password
DB_DATABASE=streamsync_db
```

