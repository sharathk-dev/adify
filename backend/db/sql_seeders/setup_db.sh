#!/bin/bash

# Database connection details
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="adify"
DB_PASS="adify123"
DB_NAME="adify"

# Create database if it doesn't exist
echo "Creating database if it doesn't exist..."
docker exec -i adify-mysql mysql -u"$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

echo "Database setup completed!" 