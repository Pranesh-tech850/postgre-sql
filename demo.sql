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


