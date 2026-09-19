import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const { Pool } = pg;

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());


// ========================================
// POSTGRESQL CONNECTION
// ========================================

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

    ssl: {
        rejectUnauthorized: false
    }
});


console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

console.log(
    "DB password exists:",
    !!process.env.DB_PASSWORD
);

console.log(
    "DB password type:",
    typeof process.env.DB_PASSWORD
);


// ========================================
// TEST DATABASE CONNECTION
// ========================================

pool.connect((err, client, release) => {

    if (err) {

        console.error(
            "PostgreSQL connection failed!"
        );

        console.error(err.message);

        return;
    }

    console.log(
        "PostgreSQL connected successfully!"
    );

    release();

});


// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {

    res.send("Server is running");

});


// ==================================================
// STUDENTS
// ==================================================


// ========================================
// GET ALL STUDENTS
// ========================================

app.get("/students", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM students ORDER BY id"
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ========================================
// SEARCH STUDENTS
// ========================================


app.get("/students/search", async (req, res) => {

    try {

        const { email } = req.query;

        const startTime = performance.now();

        const result = await pool.query(
            `SELECT *
             FROM students
             WHERE name ILIKE $1
                OR email ILIKE $1
             ORDER BY id`,
            [`%${email}%`]
        );

        const endTime = performance.now();

        console.log(
            `Database search time: ${(endTime - startTime).toFixed(2)} ms`
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ========================================
// ADD STUDENT
// ========================================

app.post("/students", async (req, res) => {

    try {

        const {
            name,
            email,
            age,
            course
        } = req.body;

        const result = await pool.query(
            `INSERT INTO students
            (name, email, age, course)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                name,
                email,
                age,
                course
            ]
        );

        res.status(201).json(
            result.rows[0]
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to add student"
        });

    }

});


// ========================================
// UPDATE STUDENT
// ========================================

app.put("/students/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            email,
            age,
            course
        } = req.body;

        const result = await pool.query(
            `UPDATE students
             SET name = $1,
                 email = $2,
                 age = $3,
                 course = $4
             WHERE id = $5
             RETURNING *`,
            [
                name,
                email,
                age,
                course,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.json(
            result.rows[0]
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ==================================================
// PRODUCTS
// ==================================================


// ========================================
// GET ALL PRODUCTS
// ========================================

app.get("/products", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM products ORDER BY id"
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ========================================
// ADD PRODUCT
// ========================================

app.post("/products", async (req, res) => {

    try {

        const {
            id,
            product,
            price,
            stock
        } = req.body;

        const result = await pool.query(
            `INSERT INTO products
            (id, product, price, stock)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                id,
                product,
                price,
                stock
            ]
        );

        res.status(201).json(
            result.rows[0]
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to add product"
        });

    }

});


// ========================================
// SEARCH PRODUCTS
// ========================================

app.get("/products/search", async (req, res) => {

    try {

        const { search } = req.query;

        const startTime = performance.now();

        const result = await pool.query(
            `SELECT *
             FROM products
             WHERE name ILIKE $1
                OR CAST(id AS TEXT) ILIKE $1
             ORDER BY id`,
            [`%${search}%`]
        );

        const endTime = performance.now();

        console.log(
            `Database product search time: ${(endTime - startTime).toFixed(2)} ms`
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ========================================
// UPDATE PRODUCT
// ========================================

app.put("/products/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            price,
            stock
        } = req.body;

        const result = await pool.query(
            `UPDATE products
             SET name = $1,
                 price = $2,
                 stock = $3
             WHERE id = $4
             RETURNING *`,
            [
                name,
                price,
                stock,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json(
            result.rows[0]
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ==================================================
// ORDERS
// ==================================================


// ========================================
// GET ORDERS
// Default: first 1000 records
// ========================================

app.get("/orders/debug", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                current_database() AS database,
                current_schema() AS schema,
                COUNT(*) AS total_orders,
                COUNT(email) AS orders_with_email
            FROM orders
        `);

        res.json(result.rows[0]);

    } catch (error) {
        console.error("DEBUG ERROR:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/orders", async (req, res) => {

    try {

        const limit =
            Number(req.query.limit) || 1000;

        const offset =
            Number(req.query.offset) || 0;


        const result = await pool.query(
            `SELECT
                id,
                customer_name,
                product_name,
                quantity,
                total_price,
                email
             FROM orders
             ORDER BY id
             LIMIT $1
             OFFSET $2`,
            [
                limit,
                offset
            ]
        );


        console.log(
            "Orders returned:",
            result.rows.length
        );


        if (result.rows.length > 0) {

            console.log(
                "First order:",
                result.rows[0]
            );

        }


        res.json(
            result.rows
        );

    } catch (error) {

        console.error(
            "GET ORDERS ERROR:",
            error
        );

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ========================================
// SEARCH ORDERS BY EMAIL
// ========================================

app.get("/orders/search", async (req, res) => {

    try {

        const email =
            req.query.email?.trim();


        console.log(
            "================================"
        );

        console.log(
            "SEARCH EMAIL:",
            email
        );


        if (!email) {

            return res.status(400).json({
                message: "Email is required"
            });

        }


        const startTime =
            performance.now();


        const result = await pool.query(
            `SELECT
                id,
                customer_name,
                product_name,
                quantity,
                total_price,
                email
             FROM orders
             WHERE email = $1
             ORDER BY id`,
            [
                email
            ]
        );


        const endTime =
            performance.now();


        console.log(
            "ROWS FOUND:",
            result.rows.length
        );


        console.log(
            "SEARCH TIME:",
            `${(endTime - startTime).toFixed(2)} ms`
        );


        console.log(
            "ROWS:",
            result.rows
        );


        console.log(
            "================================"
        );


        res.json(
            result.rows
        );

    } catch (error) {

        console.error(
            "SEARCH ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to search orders"
        });

    }

});


// ========================================
// ADD ORDER
// ========================================

app.post("/orders", async (req, res) => {

    try {

        const {
            customer_name,
            product_name,
            quantity,
            total_price,
            email
        } = req.body;


        if (!customer_name ||
            !product_name ||
            !email ||
            quantity === undefined ||
            total_price === undefined) {

            return res.status(400).json({
                message: "All order fields are required"
            });

        }


        const result = await pool.query(
            `INSERT INTO orders
            (
                customer_name,
                product_name,
                quantity,
                total_price,
                email
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            )
            RETURNING *`,
            [
                customer_name,
                product_name,
                quantity,
                total_price,
                email.trim()
            ]
        );


        res.status(201).json(
            result.rows[0]
        );

    } catch (error) {

        console.error(
            "ADD ORDER ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to add order"
        });

    }

});


// ========================================
// UPDATE ORDER
// ========================================

app.put("/orders/:id", async (req, res) => {

    try {

        const { id } =
            req.params;


        const {
            customer_name,
            product_name,
            quantity,
            total_price,
            email
        } = req.body;


        if (!customer_name ||
            !product_name ||
            !email ||
            quantity === undefined ||
            total_price === undefined) {

            return res.status(400).json({
                message: "All order fields are required"
            });

        }


        const result = await pool.query(
            `UPDATE orders
             SET
                customer_name = $1,
                product_name = $2,
                quantity = $3,
                total_price = $4,
                email = $5
             WHERE id = $6
             RETURNING *`,
            [
                customer_name,
                product_name,
                quantity,
                total_price,
                email.trim(),
                id
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Order not found"
            });

        }


        res.json(
            result.rows[0]
        );

    } catch (error) {

        console.error(
            "UPDATE ORDER ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to update order"
        });

    }

});


// ========================================
// DELETE ORDER
// ========================================

app.delete("/orders/:id", async (req, res) => {

    try {

        const { id } =
            req.params;


        const result = await pool.query(
            `DELETE FROM orders
             WHERE id = $1
             RETURNING *`,
            [
                id
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Order not found"
            });

        }


        res.json({

            message:
                "Order deleted successfully",

            order:
                result.rows[0]

        });

    } catch (error) {

        console.error(
            "DELETE ORDER ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to delete order"
        });

    }

});


// ========================================
// TEST DATABASE INFORMATION
// ========================================

app.get("/db-info", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                current_database(),
                current_schema()
        `);

        console.log(
            "DATABASE INFO:",
            result.rows
        );

        res.json(
            result.rows
        );

    } catch (error) {

        console.error(
            "DB INFO ERROR:",
            error
        );

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ========================================
// TEST ORDER EMAILS
// ========================================

app.get("/orders/test-email", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                email
            FROM orders
            WHERE email IS NOT NULL
            ORDER BY id
            LIMIT 20
        `);


        console.log(
            "EMAILS IN DATABASE:",
            result.rows
        );


        res.json(
            result.rows
        );

    } catch (error) {

        console.error(
            "TEST EMAIL ERROR:",
            error
        );

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ========================================
// TEST SPECIFIC USER EMAIL
// ========================================

app.get("/orders/test-user100", async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT
                id,
                customer_name,
                product_name,
                quantity,
                total_price,
                email
             FROM orders
             WHERE email = $1`,
            [
                "user100@gmail.com"
            ]
        );


        console.log(
            "USER100 RESULT:",
            result.rows
        );


        res.json(
            result.rows
        );

    } catch (error) {

        console.error(
            "TEST USER100 ERROR:",
            error
        );

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ==================================================
// BALANCE
// ==================================================


// ========================================
// GET BALANCE
// ========================================

app.get("/balance", async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM balance
             ORDER BY id`
        );

        res.json(
            result.rows
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ========================================
// SEARCH BALANCE
// ========================================

app.get("/balance/search", async (req, res) => {

    try {

        const { search } =
            req.query;


        const startTime =
            performance.now();


        const result = await pool.query(
            `SELECT *
             FROM balance
             WHERE product ILIKE $1
                OR CAST(id AS TEXT) ILIKE $1
             ORDER BY id`,
            [
                `%${search}%`
            ]
        );


        const endTime =
            performance.now();


        console.log(
            `Database balance search time: ${(endTime - startTime).toFixed(2)} ms`
        );


        res.json(
            result.rows
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ========================================
// ADD BALANCE
// ========================================

app.post("/balance", async (req, res) => {

    try {

        const {
            product,
            quantity
        } = req.body;


        const result = await pool.query(
            `INSERT INTO balance
            (product, quantity)
            VALUES ($1, $2)
            RETURNING *`,
            [
                product,
                quantity
            ]
        );


        res.status(201).json(
            result.rows[0]
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ========================================
// UPDATE BALANCE
// ========================================

app.put("/balance/:id", async (req, res) => {

    try {

        const { id } =
            req.params;


        const {
            product,
            quantity
        } = req.body;


        const result = await pool.query(
            `UPDATE balance
             SET
                product = $1,
                quantity = $2
             WHERE id = $3
             RETURNING *`,
            [
                product,
                quantity,
                id
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Balance record not found"
            });

        }


        res.json(
            result.rows[0]
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ========================================
// DELETE BALANCE
// ========================================

app.delete("/balance/:id", async (req, res) => {

    try {

        const { id } =
            req.params;


        const result = await pool.query(
            `DELETE FROM balance
             WHERE id = $1
             RETURNING *`,
            [
                id
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Balance record not found"
            });

        }


        res.json({

            message:
                "Balance record deleted",

            balance:
                result.rows[0]

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ========================================
// BUY BALANCE PRODUCT
// ========================================

app.post("/balance/:id/buy", async (req, res) => {

    try {

        const { id } =
            req.params;

        const { quantity } =
            req.body;


        console.log(
            "Product ID:",
            id
        );

        console.log(
            "User entered quantity:",
            quantity
        );


        if (
            !quantity ||
            Number(quantity) <= 0
        ) {

            return res.status(400).json({
                message: "Invalid quantity"
            });

        }


        const result = await pool.query(
            `UPDATE balance
             SET quantity = quantity - $1
             WHERE id = $2
             AND quantity >= $1
             RETURNING *`,
            [
                Number(quantity),
                id
            ]
        );


        if (result.rows.length === 0) {

            return res.status(409).json({
                message:
                    "Not enough quantity available"
            });

        }


        const product =
            result.rows[0];


        if (
            Number(product.quantity) === 0
        ) {

            await pool.query(
                `DELETE FROM balance
                 WHERE id = $1`,
                [
                    id
                ]
            );


            return res.json({

                message:
                    "Out of stock",

                product:
                    product.product,

                quantity:
                    0

            });

        }


        res.json({

            message:
                "Purchase successful",

            product:
                product.product,

            quantity:
                product.quantity

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });

    }

});


// ==================================================
// START SERVER
// ==================================================

const PORT =
    process.env.PORT || 8000;

    app.get("/orders/debug-emails", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, customer_name, email
            FROM orders
            ORDER BY id
            LIMIT 20
        `);

        console.log("DEBUG EMAILS:", result.rows);

        res.json(result.rows);

    } catch (error) {
        console.error("DEBUG EMAIL ERROR:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/db-info", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                current_database() AS database,
                current_schema() AS schema,
                current_user AS user,
                (SELECT COUNT(*) FROM public.orders) AS total_orders,
                (SELECT COUNT(*) FROM public.orders WHERE email IS NOT NULL) AS orders_with_email
        `);

        res.json(result.rows[0]);

    } catch (error) {
        console.error("DB INFO ERROR:", error);
        res.status(500).json({
            error: error.message
        });
    }
});

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);