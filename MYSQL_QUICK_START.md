# MySQL Quick Start - Step by Step

Follow these steps to switch from SQLite to MySQL on your production server.

## Step 1: Install MySQL on Server

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation
```

**Windows Server:**
- Download from https://dev.mysql.com/downloads/installer/
- Run installer and follow wizard

## Step 2: Create Database and User

```bash
# Login to MySQL
sudo mysql -u root -p
```

Then run these SQL commands:
```sql
CREATE DATABASE internship_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'internship_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON internship_db.* TO 'internship_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 3: Update Your Project

### 3.1 Update Prisma Schema

Edit `prisma/schema.prisma` - Change line 10:

**FROM:**
```prisma
datasource db {
  provider = "sqlite"
}
```

**TO:**
```prisma
datasource db {
  provider = "mysql"
}
```

### 3.2 Install MySQL Driver

```bash
cd internship-form
npm install mysql2
```

### 3.3 Update Environment Variables

Create/update `.env` file:

**Remove or comment out SQLite:**
```env
# DATABASE_URL="file:./dev.db"
```

**Add MySQL connection:**
```env
DATABASE_URL="mysql://internship_user:your_secure_password_here@localhost:3306/internship_db"
```

**For remote server:**
```env
DATABASE_URL="mysql://internship_user:your_secure_password_here@your-server-ip:3306/internship_db"
```

### 3.4 Generate Prisma Client

```bash
npx prisma generate
```

### 3.5 Run Migration

```bash
npx prisma migrate dev --name init_mysql
```

Or push schema directly:
```bash
npx prisma db push
```

## Step 4: Test Connection

```bash
# Test with Prisma Studio
npx prisma studio
```

Visit http://localhost:5555 to see your database.

## Step 5: Start Your Application

```bash
npm run dev
```

Your application should now connect to MySQL!

---

## Connection String Format

```
mysql://[username]:[password]@[host]:[port]/[database]
```

**Examples:**
- Local: `mysql://internship_user:password@localhost:3306/internship_db`
- Remote: `mysql://internship_user:password@192.168.1.100:3306/internship_db`
- With SSL: `mysql://internship_user:password@host:3306/internship_db?sslmode=REQUIRED`

---

## Troubleshooting

**Can't connect?**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test MySQL connection
mysql -u internship_user -p internship_db
```

**Prisma errors?**
```bash
# Regenerate client
npx prisma generate

# Reset and push schema
npx prisma db push --force-reset
```

---

## That's It! 🎉

Your application is now using MySQL. For detailed information, see `MYSQL_SETUP_GUIDE.md`.

