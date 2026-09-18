TRUNCATE TABLE students, products, orders, balance RESTART IDENTITY;
SELECT
    (SELECT COUNT(*) FROM students) AS students,
    (SELECT COUNT(*) FROM products) AS products,
    (SELECT COUNT(*) FROM orders) AS orders,
    (SELECT COUNT(*) FROM balance) AS balance;