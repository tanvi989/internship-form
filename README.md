# Ba Labah Services - Internship Application Form

Online internship application form for Ba Labah Services Pvt Ltd, Mira Road.

## Features

- ✅ Complete internship application form with all required fields
- ✅ Admin dashboard to view all applications
- ✅ Database integration with Prisma ORM
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Form validation and error handling

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** SQLite (Development) / MySQL (Production)
- **ORM:** Prisma
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or yarn

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd internship-form
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up database:**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Application: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin
   - Prisma Studio: `npx prisma studio` (http://localhost:5555)

## Project Structure

```
internship-form/
├── app/
│   ├── admin/          # Admin dashboard page
│   ├── api/            # API routes
│   │   ├── submit/     # Form submission endpoint
│   │   └── applications/ # Get all applications
│   ├── page.tsx        # Main form page
│   └── layout.tsx      # Root layout
├── lib/
│   └── prisma.ts       # Prisma client instance
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
└── public/             # Static assets
```

## Database Setup

### Development (SQLite)

The project uses SQLite by default for development. No additional setup needed.

### Production (MySQL)

For production server setup, see:
- **Quick Start:** [MYSQL_QUICK_START.md](./MYSQL_QUICK_START.md)
- **Detailed Guide:** [MYSQL_SETUP_GUIDE.md](./MYSQL_SETUP_GUIDE.md)

### Testing MySQL Connection

```bash
node test-mysql-connection.js
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Development (SQLite)
DATABASE_URL="file:./dev.db"

# Production (MySQL)
# DATABASE_URL="mysql://user:password@host:3306/database"
```

## Form Fields

The internship form includes:

- **Personal Information:** Name, Email, Phone, Gender
- **Education:** Year of Passout, College Name, Course/Degree
- **Skills:** Multiple skills (add/remove dynamically)
- **Terms & Conditions:** 7 AM start, Punctuality, Work days, etc.
- **Additional Info:** Commute time, Strength, Weakness, Hobbies, English fluency rating

## Admin Dashboard

Access the admin dashboard at `/admin` to:
- View all submitted applications
- See detailed information for each application
- Filter and search applications

## Database Management

### View Data with Prisma Studio

```bash
npx prisma studio
```

### Run Migrations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy
```

### Reset Database (⚠️ Deletes all data)

```bash
npx prisma migrate reset
```

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Make sure to set `DATABASE_URL` in your hosting platform's environment variables.

### Recommended Hosting

- **Vercel** - Easy Next.js deployment
- **Railway** - Includes database
- **DigitalOcean** - Full server control
- **AWS/Azure** - Enterprise solutions

## Documentation

- **MySQL Setup Guide:** [MYSQL_SETUP_GUIDE.md](./MYSQL_SETUP_GUIDE.md)
- **MySQL Quick Start:** [MYSQL_QUICK_START.md](./MYSQL_QUICK_START.md)
- **Production Database Guide:** [PRODUCTION_DATABASE_GUIDE.md](./PRODUCTION_DATABASE_GUIDE.md)

## Support

For issues or questions:
- Check the MySQL setup guides
- Review Prisma documentation: https://www.prisma.io/docs
- Check Next.js documentation: https://nextjs.org/docs

## License

Private - Ba Labah Services Pvt Ltd
