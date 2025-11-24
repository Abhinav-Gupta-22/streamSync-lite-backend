# Free Tier Database Setup Guide

This guide shows you how to use **free PostgreSQL alternatives** to AWS RDS that save data on the server. Perfect for production deployments without AWS costs!

## 🎯 Recommended Options

### 1. **Supabase** (⭐ Most Recommended)
- **Free Tier**: 500MB database, unlimited projects
- **Why Choose**: Easiest setup, great documentation, generous free tier
- **Best For**: Production apps, real-time features

### 2. **Neon** (⭐ Great for Serverless)
- **Free Tier**: 0.5GB storage, auto-scaling
- **Why Choose**: Serverless PostgreSQL, instant scaling, branch databases
- **Best For**: Serverless architectures, development workflows

### 3. **Railway**
- **Free Tier**: $5 credit monthly (usually enough for small projects)
- **Why Choose**: Simple setup, good performance
- **Best For**: Quick deployments, small to medium projects

### 4. **Render**
- **Free Tier**: 90 days free, then $7/month
- **Why Choose**: Reliable, good for testing
- **Best For**: Temporary projects, testing environments

### 5. **ElephantSQL**
- **Free Tier**: 20MB free forever
- **Why Choose**: Truly free forever, simple
- **Best For**: Very small projects, learning

---

## 📋 Quick Setup Guide

### Option 1: Supabase (Recommended)

1. **Sign up at [supabase.com](https://supabase.com)**

2. **Create a new project:**
   - Click "New Project"
   - Choose a name and database password
   - Select a region close to you
   - Wait for project to be created (~2 minutes)

3. **Get your connection details:**
   - Go to Project Settings → Database
   - Copy the connection string or individual values:
     - Host: `db.xxxxx.supabase.co`
     - Port: `5432`
     - Database: `postgres`
     - User: `postgres`
     - Password: (the one you set during project creation)

4. **Update your `.env` file:**
   ```env
   DB_TYPE=postgres
   DB_HOST=db.xxxxx.supabase.co
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_supabase_password
   DB_DATABASE=postgres
   DB_SSL=true
   ```

5. **Test the connection:**
   ```bash
   cd backend
   yarn start:dev
   ```

---

### Option 2: Neon (Serverless PostgreSQL)

1. **Sign up at [neon.tech](https://neon.tech)**

2. **Create a new project:**
   - Click "Create Project"
   - Choose a name and region
   - Wait for project creation (~30 seconds)

3. **Get your connection details:**
   - Go to Dashboard → Connection Details
   - Copy the connection string or use:
     - Host: `ep-xxxxx.us-east-2.aws.neon.tech`
     - Port: `5432`
     - Database: `neondb`
     - User: `neondb_owner`
     - Password: (shown in connection details)

4. **Update your `.env` file:**
   ```env
   DB_TYPE=postgres
   DB_HOST=ep-xxxxx.us-east-2.aws.neon.tech
   DB_PORT=5432
   DB_USERNAME=neondb_owner
   DB_PASSWORD=your_neon_password
   DB_DATABASE=neondb
   DB_SSL=true
   ```

5. **Test the connection:**
   ```bash
   cd backend
   yarn start:dev
   ```

---

### Option 3: Railway

1. **Sign up at [railway.app](https://railway.app)**

2. **Create a new project:**
   - Click "New Project" → "Provision PostgreSQL"
   - Wait for database to be created

3. **Get your connection details:**
   - Click on the PostgreSQL service
   - Go to "Variables" tab
   - Copy the connection details:
     - Host: `containers-us-west-xxx.railway.app`
     - Port: `5432`
     - Database: `railway`
     - User: `postgres`
     - Password: (shown in variables)

4. **Update your `.env` file:**
   ```env
   DB_TYPE=postgres
   DB_HOST=containers-us-west-xxx.railway.app
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_railway_password
   DB_DATABASE=railway
   DB_SSL=true
   ```

5. **Test the connection:**
   ```bash
   cd backend
   yarn start:dev
   ```

---

### Option 4: Render

1. **Sign up at [render.com](https://render.com)**

2. **Create a new PostgreSQL database:**
   - Click "New" → "PostgreSQL"
   - Choose a name and region
   - Select "Free" plan (90 days free)
   - Wait for database creation

3. **Get your connection details:**
   - Go to your database dashboard
   - Copy the "Internal Database URL" or individual values:
     - Host: `dpg-xxxxx-a.oregon-postgres.render.com`
     - Port: `5432`
     - Database: `streamsync_db`
     - User: `streamsync_user`
     - Password: (shown in connection string)

4. **Update your `.env` file:**
   ```env
   DB_TYPE=postgres
   DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
   DB_PORT=5432
   DB_USERNAME=streamsync_user
   DB_PASSWORD=your_render_password
   DB_DATABASE=streamsync_db
   DB_SSL=true
   ```

5. **Test the connection:**
   ```bash
   cd backend
   yarn start:dev
   ```

---

### Option 5: ElephantSQL

1. **Sign up at [elephantsql.com](https://www.elephantsql.com)**

2. **Create a new instance:**
   - Click "Create New Instance"
   - Choose "Tiny Turtle" (free plan - 20MB)
   - Select a region and name
   - Wait for instance creation

3. **Get your connection details:**
   - Click on your instance
   - Go to "Details" tab
   - Copy the connection details:
     - Host: `xxxxx.elephantsql.com`
     - Port: `5432`
     - Database: `xxxxx`
     - User: `xxxxx`
     - Password: (shown in details)

4. **Update your `.env` file:**
   ```env
   DB_TYPE=postgres
   DB_HOST=xxxxx.elephantsql.com
   DB_PORT=5432
   DB_USERNAME=xxxxx
   DB_PASSWORD=your_elephantsql_password
   DB_DATABASE=xxxxx
   DB_SSL=true
   ```

5. **Test the connection:**
   ```bash
   cd backend
   yarn start:dev
   ```

---

## 🔧 Configuration Details

### Important Notes:

1. **SSL Connection**: All cloud databases require SSL. Make sure `DB_SSL=true` in your `.env` file.

2. **Connection String Format**: Some services provide a connection string like:
   ```
   postgresql://user:password@host:port/database
   ```
   You can extract individual values from this string.

3. **Password Security**: Never commit your `.env` file to Git. It should be in `.gitignore`.

4. **Database Migrations**: After connecting, run migrations if needed:
   ```bash
   cd backend
   yarn migration:run
   ```

---

## 🆚 Comparison Table

| Service | Free Tier | Storage | Best For | Setup Time |
|---------|-----------|---------|----------|------------|
| **Supabase** | 500MB | Unlimited projects | Production apps | ⭐⭐⭐⭐⭐ |
| **Neon** | 0.5GB | Auto-scaling | Serverless apps | ⭐⭐⭐⭐⭐ |
| **Railway** | $5/month credit | Varies | Quick deployments | ⭐⭐⭐⭐ |
| **Render** | 90 days free | Varies | Testing | ⭐⭐⭐ |
| **ElephantSQL** | 20MB forever | Limited | Learning | ⭐⭐⭐ |

---

## 🐛 Troubleshooting

### Connection Issues:

1. **"Connection refused" or "Timeout":**
   - Check if `DB_SSL=true` is set
   - Verify host, port, username, and password
   - Check if your IP is whitelisted (some services require this)

2. **"SSL required":**
   - Make sure `DB_SSL=true` in your `.env` file
   - Restart your backend server

3. **"Authentication failed":**
   - Double-check username and password
   - Some services use different usernames (e.g., Supabase uses `postgres`)

4. **"Database does not exist":**
   - Verify the database name in your `.env`
   - Some services use default names like `postgres` or `railway`

### Testing Connection:

You can test your database connection using a PostgreSQL client:
- **pgAdmin** (GUI)
- **DBeaver** (GUI)
- **psql** (CLI): `psql -h host -U username -d database`

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [ElephantSQL Documentation](https://www.elephantsql.com/docs)

---

## ✅ Next Steps

1. Choose a service from the options above
2. Sign up and create a database
3. Update your `.env` file with connection details
4. Set `DB_SSL=true` for cloud databases
5. Start your backend: `yarn start:dev`
6. Verify tables are created automatically (if `synchronize: true`)

Your database is now ready to use! 🎉

