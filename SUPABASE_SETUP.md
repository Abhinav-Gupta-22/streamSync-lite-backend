# Supabase Database Setup Guide

This guide will help you set up Supabase as your free PostgreSQL database alternative to AWS RDS.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub, Google, or email

### Step 2: Create a New Project

1. Click **"New Project"** button
2. Fill in the details:
   - **Name**: Choose a project name (e.g., `streamsync-app`)
   - **Database Password**: Create a strong password (save this - you'll need it!)
   - **Region**: Choose the region closest to you
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

### Step 3: Get Your Connection Details

1. Once your project is ready, go to **Project Settings** (gear icon in left sidebar)
2. Click on **"Database"** in the settings menu
3. Scroll down to **"Connection string"** section
4. You'll see two connection strings - use the **"URI"** format or individual values:

**Connection Details:**
- **Host**: `db.xxxxx.supabase.co` (found in connection string)
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: The password you set when creating the project

### Step 4: Update Your .env File

1. **Copy the example file** (if you don't have a `.env` file):
   ```bash
   cd backend
   cp env.example .env
   ```

2. **Edit `.env` file** and update these lines (around lines 8-16):
   ```env
   DB_TYPE=postgres
   DB_HOST=db.xxxxx.supabase.co          # Replace with your Supabase host
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_supabase_password     # Replace with your Supabase password
   DB_DATABASE=postgres
   DB_SSL=true
   ```

3. **Save the file**

### Step 5: Test the Connection

1. **Start your backend:**
   ```bash
   cd backend
   yarn start:dev
   ```

2. **Look for these success messages:**
   ```
   ✅ Database connection established
   🚀 Application is running on: http://localhost:3000/api
   ```

3. **If you see connection errors**, check:
   - ✅ Host is correct (should start with `db.` and end with `.supabase.co`)
   - ✅ Password matches what you set during project creation
   - ✅ `DB_SSL=true` is set
   - ✅ No extra spaces in your `.env` file

## 📋 Example .env Configuration

Here's what your database section should look like in `.env`:

```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=db.abcdefghijklmnop.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=MySecurePassword123!
DB_DATABASE=postgres
DB_SSL=true
```

## 🔍 Finding Your Connection String

If you can't find the connection details:

1. Go to **Project Settings** → **Database**
2. Look for **"Connection string"** section
3. Click on **"URI"** tab
4. The format is: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
5. Extract the values:
   - **Host**: The part after `@` and before `:5432` (e.g., `db.xxxxx.supabase.co`)
   - **Port**: `5432`
   - **Username**: `postgres`
   - **Password**: The part between `postgres:` and `@`
   - **Database**: `postgres`

## ✅ Verification

After starting your backend, you should see:

1. **Database tables created automatically** (if `synchronize: true` in development)
2. **No connection errors** in the console
3. **API endpoints working** at `http://localhost:3000/api`

## 🐛 Troubleshooting

### Error: "Connection timeout"
- **Solution**: Check your internet connection and verify the host address

### Error: "SSL required"
- **Solution**: Make sure `DB_SSL=true` in your `.env` file

### Error: "Authentication failed"
- **Solution**: 
  - Double-check your password (copy-paste it to avoid typos)
  - Make sure you're using the password from project creation, not your Supabase account password
  - Try resetting the database password in Supabase dashboard

### Error: "Database does not exist"
- **Solution**: The database name should be `postgres` (default for Supabase)

### Can't find connection details
- **Solution**: 
  - Make sure your project is fully created (wait a few minutes)
  - Check Project Settings → Database → Connection string section
  - Try refreshing the page

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Dashboard](https://app.supabase.com)
- [PostgreSQL Connection Guide](https://supabase.com/docs/guides/database/connecting-to-postgres)

## 🎉 Next Steps

Once connected:
1. Your database schema will be created automatically
2. You can view your data in Supabase Dashboard → Table Editor
3. Your data is now saved on Supabase servers (not locally)
4. You can access it from anywhere!

---

**Need help?** Check the main `FREE_TIER_DATABASE_SETUP.md` guide for more details.

