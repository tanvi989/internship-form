# Production Database Setup Guide

This guide will help you migrate from SQLite (development) to a production-ready database for your internship form application.

## Table of Contents
1. [Recommended Production Databases](#recommended-production-databases)
2. [PostgreSQL Setup (Recommended)](#postgresql-setup-recommended)
3. [MySQL Setup](#mysql-setup)
4. [Cloud Database Options](#cloud-database-options)
5. [Migration Steps](#migration-steps)
6. [Environment Variables](#environment-variables)
7. [Deployment Considerations](#deployment-considerations)

---

## Recommended Production Databases

For production, we recommend one of these databases:

1. **PostgreSQL** (Best for most use cases)
   - Free, open-source
   - Excellent performance and reliability
   - Great for production applications

2. **MySQL** (Alternative)
   - Widely used
   - Good performance
   - Easy to set up

3. **Cloud Databases** (Easiest for deployment)
   - **Vercel Postgres** (if deploying on Vercel)
   - **Supabase** (Free tier available)
   - **PlanetScale** (MySQL-compatible)
   - **Railway** (PostgreSQL)
   - **Neon** (Serverless PostgreSQL)

---

## PostgreSQL Setup (Recommended)

### Option 1: Local PostgreSQL Installation

1. **Install PostgreSQL**
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Or use: `choco install postgresql` (if you have Chocolatey)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE internship_db;

   # Create user (optional)
   CREATE USER internship_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE internship_db TO internship_user;

   # Exit
   \q
   ```

3. **Update Prisma Schema**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Update .env file**
   ```
   DATABASE_URL="postgresql://internship_user:your_secure_password@localhost:5432/internship_db?schema=public"
   ```

### Option 2: Docker PostgreSQL (Easiest)

1. **Create docker-compose.yml** in your project root:
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15
       container_name: internship_postgres
       environment:
         POSTGRES_USER: internship_user
         POSTGRES_PASSWORD: your_secure_password
         POSTGRES_DB: internship_db
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

2. **Start PostgreSQL**
   ```bash
   docker-compose up -d
   ```

3. **Update .env file**
   ```
   DATABASE_URL="postgresql://internship_user:your_secure_password@localhost:5432/internship_db?schema=public"
   ```

---

## MySQL Setup

1. **Install MySQL**
   - Windows: Download from [mysql.com](https://dev.mysql.com/downloads/installer/)
   - Mac: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

2. **Create Database**
   ```bash
   mysql -u root -p

   CREATE DATABASE internship_db;
   CREATE USER 'internship_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON internship_db.* TO 'internship_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Update Prisma Schema**
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Update .env file**
   ```
   DATABASE_URL="mysql://internship_user:your_secure_password@localhost:3306/internship_db"
   ```

---

## Cloud Database Options

### Option 1: Vercel Postgres (If deploying on Vercel)

1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection string
4. Add to your `.env` file

### Option 2: Supabase (Free tier available)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (use the "Connection pooling" one for serverless)
5. Format: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

### Option 3: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy the connection string from the Variables tab

### Option 4: Neon (Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard

---

## Migration Steps

### Step 1: Update Prisma Schema

Change the datasource provider in `prisma/schema.prisma`:

**For PostgreSQL:**
```prisma
datasource db {
  provider = "postgresql"
}
```

**For MySQL:**
```prisma
datasource db {
  provider = "mysql"
}
```

### Step 2: Update Environment Variables

Create or update your `.env` file with the production database URL:

```
DATABASE_URL="your_production_database_url_here"
```

### Step 3: Install Database Driver

**For PostgreSQL:**
```bash
npm install pg
npm install --save-dev @types/pg
```

**For MySQL:**
```bash
npm install mysql2
```

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

### Step 5: Run Migrations

```bash
# Create a new migration for production database
npx prisma migrate dev --name production_init

# Or if you want to push schema directly (for initial setup)
npx prisma db push
```

### Step 6: Verify Connection

Create a test script `test-db.js`:

```javascript
const { PrismaClient } = require('./node_modules/.prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    const count = await prisma.internshipApplication.count()
    console.log(`📊 Total applications: ${count}`)
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
```

Run it:
```bash
node test-db.js
```

---

## Environment Variables

### Development (.env.local)
```
DATABASE_URL="file:./dev.db"
```

### Production (.env.production)
```
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

### Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use environment variables** in your hosting platform
3. **Use connection pooling** for serverless deployments
4. **Enable SSL** for production databases:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"
   ```

---

## Deployment Considerations

### Vercel Deployment

1. Add environment variable in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `DATABASE_URL` with your production database URL

2. Update `next.config.ts` if needed:
   ```typescript
   export default {
     // Your config
   }
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

### Other Platforms (Netlify, Railway, etc.)

1. Add `DATABASE_URL` to your platform's environment variables
2. Ensure your database allows connections from your hosting platform's IP
3. For serverless, use connection pooling URLs

### Database Connection Pooling

For serverless environments, use connection pooling:

**Supabase:**
```
postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
```

**Neon:**
```
postgresql://user:password@ep-xxx.region.neon.tech/dbname?sslmode=require
```

---

## Backup and Maintenance

### Regular Backups

**PostgreSQL:**
```bash
pg_dump -U username -d database_name > backup.sql
```

**MySQL:**
```bash
mysqldump -u username -p database_name > backup.sql
```

### Prisma Studio (Database GUI)

View and manage your data:
```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555`

---

## Troubleshooting

### Connection Issues

1. **Check firewall settings** - Ensure port 5432 (PostgreSQL) or 3306 (MySQL) is open
2. **Verify credentials** - Double-check username, password, and database name
3. **Check host/port** - Ensure the database host and port are correct
4. **SSL requirements** - Some cloud databases require SSL connections

### Migration Issues

If you encounter migration errors:
```bash
# Reset database (⚠️ WARNING: Deletes all data)
npx prisma migrate reset

# Or push schema without migrations
npx prisma db push
```

---

## Quick Start: PostgreSQL with Docker

The fastest way to get started with production database:

1. **Create `docker-compose.yml`:**
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15
       container_name: internship_postgres
       environment:
         POSTGRES_USER: admin
         POSTGRES_PASSWORD: secure_password_123
         POSTGRES_DB: internship_db
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

2. **Start database:**
   ```bash
   docker-compose up -d
   ```

3. **Update `.env`:**
   ```
   DATABASE_URL="postgresql://admin:secure_password_123@localhost:5432/internship_db?schema=public"
   ```

4. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```

5. **Run migrations:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init_postgres
   ```

6. **Test:**
   ```bash
   npm run dev
   ```

---

## Support

For issues or questions:
- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- MySQL Docs: https://dev.mysql.com/doc/

---

**Note:** Always test your database connection in a staging environment before deploying to production!

