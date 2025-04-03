#!/bin/bash

# Change to the script's directory
cd "$(dirname "$0")"

# Database connection details
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="adify"
DB_PASS="adify123"
DB_NAME="adify"

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
docker exec -i -e MYSQL_PWD="$DB_PASS" adify-mysql mysql -u"$DB_USER" "$DB_NAME" < "../init.sql"

# Run cleanup first
echo "Running cleanup..."
run_sql_file "cleanup.sql"

# Run all seeders in numerical order
for file in $(ls -v *.sql | grep -v cleanup.sql); do
    run_sql_file "$file"
done

echo "All seeders completed!" 