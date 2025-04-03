# Adify

Adify is a full-stack contextual ad and service engine for parking sessions. It delivers targeted ads and add-on services (like EV charging, carwash, food coupons) at the right time.

## Getting Started

### Prerequisites

- Docker
- Node.js
- MySQL 8.0 (via Docker)

### Database Setup

1. Start the MySQL container:
   ```bash
   docker start adify-mysql
   ```

2. Create the database:
   ```bash
   ./backend/scripts/setup_db.sh
   ```

3. Initialize and seed the database:
   ```bash
   ./backend/scripts/seed.sh
   ```

   This script will:
   - Drop all existing tables (if any)
   - Create the database schema
   - Seed the database with initial data for:
     - Locations
     - Ad Categories
     - Members
     - Advertisers
     - Ads
     - Ad Clicks
     - Transactions

#### Database Configuration

The database connection details are loaded from the `.env` file in the `backend` directory. Copy the example environment file and update it with your values:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your database credentials. The following variables are required:
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`

### Development

More instructions will be added as the project develops.
