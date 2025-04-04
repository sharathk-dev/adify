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

Start the backend development server:

```bash
cd backend && npm run dev
```

The server will be available at http://localhost:3001.

## API Documentation

### Interactive API Documentation

When the server is running, you can access the interactive API documentation powered by Swagger UI at:

```
http://localhost:3001/api-docs
```

This interface allows you to:
- Browse all available endpoints
- See request/response schemas
- Test API endpoints directly from the browser
- View authentication requirements

### Generating Static Documentation

You can generate a static OpenAPI specification file that can be imported into tools like Postman, Insomnia, or other API tools:

```bash
# From the backend directory
cd backend && npm run generate-docs
```

This will create a file called `api-docs.json` in the backend directory, which you can import into:

- **Postman**: Import as "OpenAPI 3.0"
- **Insomnia**: Import as "OpenAPI"
- **Swagger Editor**: File -> Import
- **Stoplight Studio**: Import -> OpenAPI

### API Authentication

Most endpoints require authentication using a JWT token. To authenticate:

1. Make a POST request to `/api/login` with email and password
2. Extract the `sessionToken` from the response
3. Include the token in subsequent requests in the `Authorization` header:
   - Either: `Authorization: Bearer <token>`
   - Or: `Authorization: <token>`

### API Structure

The API is organized into the following categories:

1. **Authentication**: User registration and login
2. **Ad Management**: Recording ad clicks and interactions
3. **Recommendations**: Getting personalized ad recommendations

### Error Handling

The API returns standard HTTP status codes:

- 200/201: Success
- 400: Bad request (client error)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Not found
- 500: Server error

Error responses include a `message` and often an `error` property with additional details.

### Adding New Endpoints

When adding new endpoints to the API, be sure to include JSDoc comments for Swagger. Example:

```javascript
/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Description of your endpoint
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *         description: Parameter description
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 property:
 *                   type: string
 */
```
