-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate tables in reverse dependency order
TRUNCATE TABLE transactions;
TRUNCATE TABLE ad_clicks;
TRUNCATE TABLE ads;
TRUNCATE TABLE advertisers;
TRUNCATE TABLE ad_categories;
TRUNCATE TABLE members;
TRUNCATE TABLE locations;

-- Reset AUTO_INCREMENT for all tables
ALTER TABLE transactions AUTO_INCREMENT = 1;
ALTER TABLE ad_clicks AUTO_INCREMENT = 1;
ALTER TABLE ads AUTO_INCREMENT = 1;
ALTER TABLE advertisers AUTO_INCREMENT = 1;
ALTER TABLE ad_categories AUTO_INCREMENT = 1;
ALTER TABLE members AUTO_INCREMENT = 1;
ALTER TABLE locations AUTO_INCREMENT = 1;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1; 