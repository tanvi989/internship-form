# MySQL Setup Guide for Production Server

This guide will help you set up MySQL database for your Ba Labah Services internship form application on your production server.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MySQL Installation](#mysql-installation)
3. [Database Setup](#database-setup)
4. [Prisma Configuration](#prisma-configuration)
5. [Migration Steps](#migration-steps)
6. [Connection String Format](#connection-string-format)
7. [Security Best Practices](#security-best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Backup and Maintenance](#backup-and-maintenance)

---

## Prerequisites

- Server with root/administrator access
- Node.js and npm installed
- Your Next.js application code

---

## MySQL Installation

### Option 1: Install MySQL on Linux Server (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install MySQL server
sudo apt install mysql-server -y

# Start MySQL service
sudo systemctl start mysql

# Enable MySQL to start on boot
sudo systemctl enable mysql

# Secure MySQL installation (set root password and remove test databases)
sudo mysql_secure_installation
```

### Option 2: Install MySQL on Windows Server

1. Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Run the installer and select "Server only" or "Full" installation
3. Follow the setup wizard
4. Set root password during installation
5. MySQL service will start automatically

### Option 3: Install MySQL on CentOS/RHEL

```bash
# Install MySQL repository
sudo yum install mysql-server -y

# Start MySQL service
sudo systemctl start mysqld

# Enable on boot
sudo systemctl enable mysqld

# Get temporary root password
sudo grep 'temporary password' /var/log/mysqld.log

# Secure installation
sudo mysql_secure_installation
```

### Verify Installation

```bash
# Check MySQL version
mysql --version

# Check MySQL service status
sudo systemctl status mysql  # Linux
# or
net start MySQL80  # Windows (service name may vary)
```

---

## Database Setup

### Step 1: Login to MySQL

```bash
# Login as root
sudo mysql -u root -p
# Enter your root password when prompted
```

### Step 2: Create Database and User

```sql
-- Create database
CREATE DATABASE internship_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (replace 'your_secure_password' with a strong password)
CREATE USER 'internship_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON internship_db.* TO 'internship_user'@'localhost';

-- If you need remote access (for cloud servers)
CREATE USER 'internship_user'@'%' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON internship_db.* TO 'internship_user'@'%';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Verify user creation
SELECT user, host FROM mysql.user WHERE user = 'internship_user';

-- Exit MySQL
EXIT;
```

### Step 3: Test Connection

```bash
# Test connection with new user
mysql -u internship_user -p internship_db
# Enter password when prompted
# If successful, you'll see MySQL prompt
# Type EXIT to leave
```

---

## Prisma Configuration

### Step 1: Update Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model InternshipApplication {
  id                    String   @id @default(cuid())
  name                  String
  email                 String
  phoneNumber           String
  educationYear         String
  collegeName           String
  courseDegreeName      String
  gender                String
  skills                String   // JSON array stored as string
  startAt7AM            Boolean
  punctuality           Boolean
  workMondayToSaturday  Boolean
  complete90Days        Boolean
  breakNotExceed1Hour    Boolean
  endOnMisbehavior       Boolean
  endOnNoOutput         Boolean
  officeCommuteTime      String
  strength              String
  weakness              String
  hobbies               String
  englishFluencyRating  Int
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

### Step 2: Install MySQL Driver

```bash
cd internship-form
npm install mysql2
```

### Step 3: Update Environment Variables

Create or update your `.env` file:

```env
# Development (SQLite - keep for local development)
# DATABASE_URL="file:./dev.db"

# Production (MySQL)
DATABASE_URL="mysql://internship_user:your_secure_password@localhost:3306/internship_db"
```

**For remote database connection:**
```env
DATABASE_URL="mysql://internship_user:your_secure_password@your-server-ip:3306/internship_db"
```

**Connection String Format:**
```
mysql://[username]:[password]@[host]:[port]/[database_name]
```

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

### Step 5: Run Migrations

```bash
# Create and apply migration
npx prisma migrate dev --name init_mysql

# Or push schema directly (for initial setup)
npx prisma db push
```

### Step 6: Verify Database Tables

```bash
# Login to MySQL
mysql -u internship_user -p internship_db

# Check tables
SHOW TABLES;

# Check table structure
DESCRIBE InternshipApplication;

# Exit
EXIT;
```

---

## Connection String Format

### Local Connection
```
mysql://username:password@localhost:3306/database_name
```

### Remote Connection
```
mysql://username:password@server-ip-or-domain:3306/database_name
```

### With SSL (Recommended for Production)
```
mysql://username:password@host:3306/database_name?sslmode=REQUIRED
```

### Connection Pooling (For Serverless/Next.js)
```
mysql://username:password@host:3306/database_name?connection_limit=10
```

---

## Security Best Practices

### 1. Use Strong Passwords

```sql
-- Change user password
ALTER USER 'internship_user'@'localhost' IDENTIFIED BY 'new_strong_password';
FLUSH PRIVILEGES;
```

### 2. Restrict Remote Access (If Not Needed)

```sql
-- Remove remote access user if not needed
DROP USER 'internship_user'@'%';

-- Keep only localhost access
-- (Already created above)
```

### 3. Enable SSL (For Remote Connections)

Edit MySQL configuration file:

**Linux:** `/etc/mysql/mysql.conf.d/mysqld.cnf`
**Windows:** `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`

```ini
[mysqld]
ssl-ca=/path/to/ca.pem
ssl-cert=/path/to/server-cert.pem
ssl-key=/path/to/server-key.pem
```

### 4. Firewall Configuration

```bash
# Allow MySQL port (3306) only from specific IPs
sudo ufw allow from your-app-server-ip to any port 3306

# Or block MySQL port from public (if using localhost only)
sudo ufw deny 3306
```

### 5. Environment Variables Security

- **Never commit `.env` files** to version control
- Use environment variables in your hosting platform
- Rotate passwords regularly
- Use different credentials for development and production

---

## Migration Steps (From SQLite to MySQL)

### Step 1: Backup SQLite Data (If You Have Existing Data)

```bash
# Export data from SQLite
sqlite3 dev.db .dump > backup.sql
```

### Step 2: Update Prisma Schema

Change datasource provider from `sqlite` to `mysql` as shown above.

### Step 3: Update Environment Variables

Update `.env` with MySQL connection string.

### Step 4: Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migrate_to_mysql

# Or push schema
npx prisma db push
```

### Step 5: Import Data (If You Have Existing Data)

If you have existing SQLite data, you'll need to convert and import it manually or use a migration script.

---

## Server Configuration

### MySQL Configuration File Location

**Linux:**
- `/etc/mysql/mysql.conf.d/mysqld.cnf`
- `/etc/my.cnf`

**Windows:**
- `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`

### Recommended Settings for Production

```ini
[mysqld]
# Basic Settings
port = 3306
bind-address = 127.0.0.1  # Only localhost, change to 0.0.0.0 for remote

# Character Set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Connection Settings
max_connections = 200
max_allowed_packet = 256M

# Performance
innodb_buffer_pool_size = 1G  # Adjust based on your server RAM
innodb_log_file_size = 256M

# Security
skip-name-resolve  # Faster connections, but requires IP addresses
```

After changing configuration:
```bash
# Restart MySQL
sudo systemctl restart mysql  # Linux
# or restart MySQL service in Windows Services
```

---

## Troubleshooting

### Issue 1: Connection Refused

**Error:** `Error: connect ECONNREFUSED`

**Solutions:**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Check if MySQL is listening on port 3306
sudo netstat -tlnp | grep 3306

# Check MySQL error log
sudo tail -f /var/log/mysql/error.log
```

### Issue 2: Access Denied

**Error:** `Access denied for user 'internship_user'@'localhost'`

**Solutions:**
```sql
-- Reset password
ALTER USER 'internship_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;

-- Verify privileges
SHOW GRANTS FOR 'internship_user'@'localhost';
```

### Issue 3: Can't Connect to Remote MySQL

**Solutions:**
1. Check if MySQL allows remote connections:
   ```sql
   -- Check bind-address in my.cnf
   -- Should be 0.0.0.0 or your server IP, not 127.0.0.1
   ```

2. Check firewall:
   ```bash
   sudo ufw status
   sudo ufw allow 3306/tcp
   ```

3. Verify user has remote access:
   ```sql
   SELECT user, host FROM mysql.user WHERE user = 'internship_user';
   -- Should have '%' or specific IP in host column
   ```

### Issue 4: Character Encoding Issues

**Solution:**
```sql
-- Set database character set
ALTER DATABASE internship_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Set table character set
ALTER TABLE InternshipApplication CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Issue 5: Prisma Migration Errors

**Solutions:**
```bash
# Reset database (⚠️ WARNING: Deletes all data)
npx prisma migrate reset

# Or push schema without migrations
npx prisma db push --force-reset

# Check migration status
npx prisma migrate status
```

---

## Backup and Maintenance

### Create Backup

```bash
# Full database backup
mysqldump -u internship_user -p internship_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with compression
mysqldump -u internship_user -p internship_db | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restore Backup

```bash
# Restore from backup
mysql -u internship_user -p internship_db < backup_20250105_120000.sql

# Restore from compressed backup
gunzip < backup_20250105_120000.sql.gz | mysql -u internship_user -p internship_db
```

### Automated Backups (Cron Job)

Create backup script `backup-mysql.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DB_NAME="internship_db"
DB_USER="internship_user"
DB_PASS="your_password"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

Make it executable:
```bash
chmod +x backup-mysql.sh
```

Add to crontab (daily backup at 2 AM):
```bash
crontab -e
# Add this line:
0 2 * * * /path/to/backup-mysql.sh
```

### Database Maintenance

```sql
-- Optimize tables
OPTIMIZE TABLE InternshipApplication;

-- Check table status
SHOW TABLE STATUS LIKE 'InternshipApplication';

-- Analyze table
ANALYZE TABLE InternshipApplication;
```

---

## Quick Setup Checklist

- [ ] Install MySQL server
- [ ] Start MySQL service
- [ ] Create database `internship_db`
- [ ] Create user `internship_user` with password
- [ ] Grant privileges to user
- [ ] Update `prisma/schema.prisma` (change to `mysql`)
- [ ] Install `mysql2` package: `npm install mysql2`
- [ ] Update `.env` with MySQL connection string
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate dev --name init_mysql`
- [ ] Test connection with `npx prisma studio`
- [ ] Configure firewall (if remote access needed)
- [ ] Set up automated backups
- [ ] Test application

---

## Testing the Connection

### Test with Prisma Studio

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can view and manage your data.

### Test with Node.js Script

Create `test-connection.js`:

```javascript
const { PrismaClient } = require('./node_modules/.prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ MySQL connection successful!')
    
    const count = await prisma.internshipApplication.count()
    console.log(`📊 Total applications: ${count}`)
  } catch (error) {
    console.error('❌ MySQL connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
```

Run it:
```bash
node test-connection.js
```

---

## Production Deployment

### Environment Variables on Server

Set environment variables in your hosting platform:

**Vercel:**
- Go to Project Settings → Environment Variables
- Add `DATABASE_URL` with your MySQL connection string

**Other Platforms:**
- Add `DATABASE_URL` to your platform's environment variables
- Ensure your MySQL server allows connections from your hosting platform's IP

### Connection Pooling for Serverless

For serverless deployments (Vercel, Netlify), use connection pooling:

```env
DATABASE_URL="mysql://user:password@host:3306/db?connection_limit=10&pool_timeout=20"
```

Or use a connection pooler like **PlanetScale** or **Railway** which provide MySQL-compatible databases with built-in connection pooling.

---

## Support and Resources

- **MySQL Documentation:** https://dev.mysql.com/doc/
- **Prisma MySQL Guide:** https://www.prisma.io/docs/concepts/database-connectors/mysql
- **MySQL Error Codes:** https://dev.mysql.com/doc/mysql-errors/8.0/en/

---

## Next Steps

1. ✅ Complete MySQL installation
2. ✅ Set up database and user
3. ✅ Update Prisma configuration
4. ✅ Run migrations
5. ✅ Test connection
6. ✅ Deploy application
7. ✅ Set up monitoring and backups

**Your internship form is now ready to use MySQL in production!** 🎉

