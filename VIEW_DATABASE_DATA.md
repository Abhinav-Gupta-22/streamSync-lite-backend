# 📊 Where is Data Stored & How to View It

## 🗄️ Backend Database (SQLite)

### Location
**File:** `backend/database.sqlite`

This is where all your backend data is stored:
- Users (accounts, passwords, profiles)
- Videos (metadata from YouTube)
- FCM Tokens (push notification tokens)
- Notifications
- User Progress (video watch progress)
- Favorites

### How to View Backend Data

#### Option 1: DB Browser for SQLite (Recommended - GUI Tool)

1. **Download DB Browser for SQLite:**
   - https://sqlitebrowser.org/
   - Free and easy to use

2. **Open the database:**
   - Open DB Browser
   - Click "Open Database"
   - Navigate to: `backend/database.sqlite`
   - Click "Open"

3. **Browse data:**
   - Click "Browse Data" tab
   - Select a table from the dropdown (users, videos, notifications, etc.)
   - View all records in a nice table format

4. **Run SQL queries:**
   - Click "Execute SQL" tab
   - Write queries like:
     ```sql
     SELECT * FROM users;
     SELECT * FROM videos LIMIT 10;
     SELECT * FROM notifications ORDER BY created_at DESC;
     ```

#### Option 2: Command Line (SQLite CLI)

If you have SQLite installed:

```powershell
cd backend
sqlite3 database.sqlite

# Then run SQL commands:
.tables                    # List all tables
.schema users              # Show table structure
SELECT * FROM users;       # View all users
SELECT * FROM videos LIMIT 10;
.exit                      # Exit
```

#### Option 3: VS Code Extension

1. Install "SQLite Viewer" extension in VS Code
2. Right-click `database.sqlite` file
3. Select "Open Database"
4. Browse tables and run queries

#### Option 4: Online SQLite Viewer

1. Go to https://sqliteviewer.app/
2. Upload your `database.sqlite` file
3. Browse and query data

### Quick SQL Queries to Check Data

```sql
-- View all users
SELECT id, email, name, created_at FROM users;

-- View all videos
SELECT video_id, title, channel_id, published_at FROM videos LIMIT 10;

-- View FCM tokens
SELECT * FROM fcm_tokens;

-- View notifications
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;

-- View user progress
SELECT * FROM progress;

-- View favorites
SELECT * FROM favorites;
```

---

## 📱 Flutter App Database (Local Cache)

### Location
**File:** `streamsync.db` (on the device/emulator)

This is stored in the app's documents directory:
- **Android Emulator:** `/data/data/com.yourapp.streamsync_lite/databases/streamsync.db`
- **iOS Simulator:** `~/Library/Developer/CoreSimulator/Devices/[DEVICE_ID]/data/Containers/Data/Application/[APP_ID]/Documents/streamsync.db`

### What's Stored Here
- Cached video metadata (for offline viewing)
- User progress (local cache)
- Favorites (local cache)
- Notifications (local cache)
- Sync queue (pending operations)

### How to View Flutter Database

#### Option 1: Android Studio Device File Explorer

1. Open Android Studio
2. Go to **View > Tool Windows > Device File Explorer**
3. Navigate to: `/data/data/com.yourapp.streamsync_lite/databases/`
4. Download `streamsync.db`
5. Open with DB Browser for SQLite

#### Option 2: ADB Command

```powershell
# Pull database from emulator
adb pull /data/data/com.yourapp.streamsync_lite/databases/streamsync.db ./flutter_db.db

# Then open with DB Browser
```

#### Option 3: Flutter DevTools

1. Run your Flutter app
2. Open DevTools
3. Go to Database Inspector (if available)

---

## 🔍 Quick Data Check Commands

### Check Backend Database Size
```powershell
cd backend
dir database.sqlite
```

### Check if Database Exists
```powershell
cd backend
Test-Path database.sqlite
```

### View Database Info (if SQLite CLI installed)
```powershell
cd backend
sqlite3 database.sqlite ".tables"
sqlite3 database.sqlite "SELECT COUNT(*) FROM users;"
sqlite3 database.sqlite "SELECT COUNT(*) FROM videos;"
```

---

## 📋 Database Tables

### Backend Database (`database.sqlite`)

1. **users** - User accounts
   - id, email, name, password_hash, created_at, updated_at

2. **videos** - Video metadata
   - video_id, title, description, thumbnail_url, channel_id, published_at, duration_seconds

3. **fcm_tokens** - Push notification tokens
   - id, user_id, token, platform, created_at

4. **notifications** - User notifications
   - id, user_id, title, body, is_read, is_deleted, sent, created_at

5. **notification_jobs** - Push notification queue
   - id, notification_id, status, retries, last_error, created_at

6. **progress** - Video watch progress
   - id, user_id, video_id, position_seconds, completed_percent, synced

7. **favorites** - User favorite videos
   - id, user_id, video_id, created_at

### Flutter Database (`streamsync.db`)

1. **videos_table** - Cached video metadata
2. **progress_table** - Local progress cache
3. **favorites_table** - Local favorites cache
4. **notifications_table** - Cached notifications
5. **sync_queue_table** - Pending sync operations

---

## 🛠️ Useful Tools

### Recommended: DB Browser for SQLite
- **Download:** https://sqlitebrowser.org/
- **Features:** GUI, SQL editor, data export, easy to use
- **Free:** Yes

### Alternative: DBeaver
- **Download:** https://dbeaver.io/
- **Features:** Supports multiple databases, advanced SQL editor
- **Free:** Community edition available

---

## 💡 Tips

1. **Backup your database:**
   ```powershell
   cd backend
   Copy-Item database.sqlite database.sqlite.backup
   ```

2. **Reset database (delete and recreate):**
   ```powershell
   cd backend
   Remove-Item database.sqlite
   # Restart backend - it will create a new empty database
   ```

3. **Export data to CSV:**
   - Use DB Browser for SQLite
   - Right-click table > Export > CSV

4. **Check database integrity:**
   ```sql
   PRAGMA integrity_check;
   ```

---

## 🚨 Important Notes

- **Backend database** (`database.sqlite`) contains all server-side data
- **Flutter database** (`streamsync.db`) is just a local cache
- Always backup before making changes!
- The database file is created automatically when you first start the backend
- In development mode, tables are created automatically (synchronize: true)

