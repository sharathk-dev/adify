-- Ads seeder
INSERT INTO ads (advertiserId, adUrl, imageUrl, locationIds, costToClick, categoryId)
VALUES 
(1, 'https://mcdonalds.com/promotions', 'https://mcdonalds.com/images/happy-meal.jpg', '[1]', 0.50, 1),
(2, 'https://nike.com/sale', 'https://nike.com/images/summer-sale.jpg', '[2,3]', 0.75, 2),
(5, 'https://amazon.com/sale', 'https://amazon.com/images/electronics.jpg', '[1,2,3]', 0.80, 3),
(7, 'https://puma.com/sale', 'https://puma.com/images/sports.jpg', '[3]', 1.00, 5),
(8, 'https://kfc.com/sale', 'https://kfc.com/images/chicken.jpg', '[3]', 0.60, 1),
(9, 'https://loreal.com/sale', 'https://loreal.com/images/hair.jpg', '[1,2,3]', 0.90, 4),
(3, 'https://burgerking.com/deals', 'https://burgerking.com/images/whopper.jpg', '[1,2]', 0.55, 1),
(4, 'https://adidas.com/running', 'https://adidas.com/images/running-shoes.jpg', '[1,2,3]', 0.85, 2), 
(6, 'https://bestbuy.com/tech', 'https://bestbuy.com/images/gadgets.jpg', '[2,3]', 0.95, 3),
(10, 'https://sephora.com/makeup', 'https://sephora.com/images/cosmetics.jpg', '[1,3]', 0.70, 4),
(11, 'https://underarmour.com/gear', 'https://underarmour.com/images/sports-gear.jpg', '[2]', 0.80, 5);