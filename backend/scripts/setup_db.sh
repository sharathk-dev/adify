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

# Create database if it doesn't exist
echo "Creating database if it doesn't exist..."
docker exec -i -e MYSQL_PWD="$DB_PASS" adify-mysql mysql -u"$DB_USER" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

echo "Database setup completed!" 