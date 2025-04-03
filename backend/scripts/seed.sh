#!/bin/bash

# Get the absolute path to the backend directory
BACKEND_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Load environment variables from .env file
if [ -f "$BACKEND_DIR/.env" ]; then
    source "$BACKEND_DIR/.env"
fi

# Map MYSQL_ variables to DB_ variables
DB_HOST=${MYSQL_HOST}
DB_PORT=${MYSQL_PORT}
DB_USER=${MYSQL_USER}
DB_PASS=${MYSQL_PASSWORD}
DB_NAME=${MYSQL_DATABASE}

# Validate required environment variables
if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASS" ] || [ -z "$DB_NAME" ]; then
    echo "Error: Required database environment variables are not set."
    echo "Please ensure MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE are set in $BACKEND_DIR/.env"
    exit 1
fi

# Function to run a SQL file
run_sql_file() {
    echo "Running $1..."
    docker exec -i -e MYSQL_PWD="$DB_PASS" adify-mysql mysql -u"$DB_USER" "$DB_NAME" < "$1"
}

# Drop all tables
echo "Dropping all tables..."
docker exec -i -e MYSQL_PWD="$DB_PASS" adify-mysql mysql -u"$DB_USER" "$DB_NAME" << EOF
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS ad_clicks;
DROP TABLE IF EXISTS ads;
DROP TABLE IF EXISTS advertisers;
DROP TABLE IF EXISTS ad_categories;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS locations;
SET FOREIGN_KEY_CHECKS = 1;
EOF

# Initialize database schema
echo "Initializing database schema..."
docker exec -i -e MYSQL_PWD="$DB_PASS" adify-mysql mysql -u"$DB_USER" "$DB_NAME" < "$BACKEND_DIR/db/init.sql"

# Run cleanup first
echo "Running cleanup..."
run_sql_file "$BACKEND_DIR/db/sql_seeders/cleanup.sql"

# Run all seeders in numerical order
cd "$BACKEND_DIR/db/sql_seeders"
for file in $(ls -v *.sql | grep -v cleanup.sql); do
    run_sql_file "$file"
done

echo "All seeders completed!" 