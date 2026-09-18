CREATE TABLE student (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100),
    age INT
);


-- =========================================
-- INSERT 10 STUDENTS
-- =========================================

INSERT INTO student (id, name, email, age)
VALUES
(1, 'Praneshwar', 'praneshwar@gmail.com', 22),
(2, 'Arun', 'arun@gmail.com', 21),
(3, 'Karthik', 'karthik@gmail.com', 23),
(4, 'Rahul', 'rahul@gmail.com', 22),
(5, 'Vijay', 'vijay@gmail.com', 24),
(6, 'Ajay', 'ajay@gmail.com', 21),
(7, 'Suresh', 'suresh@gmail.com', 23),
(8, 'Dinesh', 'dinesh@gmail.com', 22),
(9, 'Hari', 'hari@gmail.com', 24),
(10, 'Ravi', 'ravi@gmail.com', 21);

select * from student;

CREATE TABLE products (
    id INT PRIMARY KEY,
    product_name VARCHAR(100),
    price NUMERIC(10,2),
    category VARCHAR(50)
);


-- =========================================
-- INSERT 500 PRODUCTS
-- =========================================

INSERT INTO products (id, product_name, price, category)
SELECT
    id,
    'Product ' || id,
    ROUND((RANDOM() * 10000 + 100)::NUMERIC, 2),
    CASE
        WHEN id % 5 = 0 THEN 'Electronics'
        WHEN id % 5 = 1 THEN 'Clothing'
        WHEN id % 5 = 2 THEN 'Books'
        WHEN id % 5 = 3 THEN 'Furniture'
        ELSE 'Grocery'
    END
FROM generate_series(1, 500) AS id;

select * from products;

CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    student_id INT,
    product_id INT,
    quantity INT,
    order_date DATE,
    
    CONSTRAINT fk_student
        FOREIGN KEY (student_id)
        REFERENCES student(id),

    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
);


-- =========================================
-- INSERT 6 LAKH ORDERS
-- =========================================

INSERT INTO orders (
    id,
    student_id,
    product_id,
    quantity,
    order_date
)
SELECT
    id,
    FLOOR(RANDOM() * 10 + 1)::INT,
    FLOOR(RANDOM() * 500 + 1)::INT,
    FLOOR(RANDOM() * 5 + 1)::INT,
    CURRENT_DATE - FLOOR(RANDOM() * 365)::INT
FROM generate_series(1, 600000) AS id;

select * from product

CREATE TABLE balance (
    id SERIAL PRIMARY KEY,
    product VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL
);

INSERT INTO balance (product, quantity)
VALUES
    ('Laptop', 100),
    ('Mobile', 200),
    ('Keyboard', 150),
    ('Mouse', 300),
    ('Monitor', 120);

select count (*) from balance;
INSERT INTO balance (product, quantity)
VALUES('Gopro',10),
('Gagets',10);

select count(*) from balance;
select * from balance;

UPDATE balance
SET quantity = quantity - 1
WHERE id = 2
  AND quantity > 0
RETURNING *;

DELETE FROM balance;
select * from balance;
TRUNCATE TABLE balance RESTART IDENTITY;
select * from balance;

INSERT INTO balance (product, quantity)
VALUES
('Gopro', 10),
('Gagets', 10),
('Laptop', 25),
('Mobile', 40),
('Keyboard', 30),
('Mouse', 50),
('Monitor', 20),
('Headphones', 35),
('Webcam', 15),
('Microphone', 18),
('Speaker', 22),
('Tablet', 28),
('Smartwatch', 32),
('Powerbank', 45),
('USB Cable', 60),
('Charger', 55),
('SSD', 12),
('Hard Disk', 16),
('Graphics Card', 8),
('Printer', 14);


select * from orders;

select * from orders where id=1000;

SELECT *
FROM orders
ORDER BY id DESC;

select count(*) from orders;
