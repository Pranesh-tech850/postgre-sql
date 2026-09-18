import { useState } from "react";
import "./Orders.css";

function Orders() {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        customer_name: "",
        product_name: "",
        quantity: "",
        total_price: ""
    });


    // ========================================
    // FETCH ORDERS
    // ========================================

    const fetchOrders = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:8000/orders"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();

            setOrders(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // INPUT CHANGE
    // ========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // ========================================
    // OPEN ADD ORDER MODAL
    // ========================================

    const openAddOrder = () => {

        setFormData({
            customer_name: "",
            product_name: "",
            quantity: "",
            total_price: ""
        });

        setShowForm(true);

    };


    // ========================================
    // CLOSE MODAL
    // ========================================

    const closeModal = () => {

        setShowForm(false);

    };


    // ========================================
    // ADD ORDER
    // ========================================

    const addOrders = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8000/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        customer_name: formData.customer_name,
                        product_name: formData.product_name,
                        quantity: Number(formData.quantity),
                        total_price: Number(formData.total_price)
                    })
                }
            );


            if (!response.ok) {
                throw new Error("Failed to add order");
            }


            const data = await response.json();

            console.log("Order added:", data);


            // Close popup

            setShowForm(false);


            // Refresh orders

            fetchOrders();


        } catch (error) {

            console.error(error);

        }

    };


    return (

        <section className="orders-section">


            {/* ========================================
                HEADER
            ======================================== */}

            <div className="orders-header">


                <div>

                    <span className="orders-label">
                        TRANSACTIONS
                    </span>

                    <h2>
                        Orders
                    </h2>

                    <p>
                        Explore large-scale order data
                    </p>

                </div>


                <div className="orders-actions">

                    <button
                        className="add-order-btn"
                        onClick={openAddOrder}
                    >
                        + Add Order
                    </button>


                    <button
                        className="orders-fetch-btn"
                        onClick={fetchOrders}
                    >
                        {loading
                            ? "Fetching..."
                            : "Fetch Orders"
                        }
                    </button>

                </div>

            </div>


            {/* ========================================
                ORDERS CARD
            ======================================== */}

            <div className="orders-card">


                <div className="orders-top">

                    <div>

                        <h3>
                            Order Records
                        </h3>

                        <span>
                            {orders.length.toLocaleString()}
                            {" "}
                            records loaded
                        </span>

                    </div>


                    {orders.length > 0 && (

                        <span className="large-data-badge">
                            Large Dataset
                        </span>

                    )}

                </div>


                {/* ========================================
                    EMPTY STATE
                ======================================== */}

                {orders.length === 0 ? (

                    <div className="orders-empty">

                        <div className="orders-icon">
                            🧾
                        </div>

                        <h3>
                            No orders loaded
                        </h3>

                        <p>
                            Click "Fetch Orders" to retrieve
                            order data.
                        </p>

                    </div>

                ) : (

                    <div className="orders-table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>Customer</th>

                                    <th>Product</th>

                                    <th>Quantity</th>

                                    <th>Total Price</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {orders.map((order) => (

                                    <tr key={order.id}>

                                        <td>

                                            <span className="order-id">
                                                #{order.id}
                                            </span>

                                        </td>


                                        <td>
                                            {order.customer_name}
                                        </td>


                                        <td>
                                            {order.product_name}
                                        </td>


                                        <td>

                                            <span className="quantity">
                                                {order.quantity}
                                            </span>

                                        </td>


                                        <td className="order-price">
                                            ₹{order.total_price}
                                        </td>
                                        
                                        <td>
                                            <button>Edit</button>
                                            <button>Delete</button>
                                        </td>
                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ========================================
                ADD ORDER MODAL
            ======================================== */}

            {showForm && (

                <div
                    className="order-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="order-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="order-modal-header">

                            <div>

                                <span className="modal-label">
                                    NEW TRANSACTION
                                </span>

                                <h3>
                                    Add New Order
                                </h3>

                                <p>
                                    Enter the order details below.
                                </p>

                            </div>


                            <button
                                className="close-order-modal"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form onSubmit={addOrders}>


                            {/* CUSTOMER */}

                            <div className="order-form-group">

                                <label>
                                    Customer Name
                                </label>

                                <input
                                    type="text"
                                    name="customer_name"
                                    placeholder="Enter customer name"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* PRODUCT */}

                            <div className="order-form-group">

                                <label>
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="product_name"
                                    placeholder="Enter product name"
                                    value={formData.product_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* QUANTITY */}

                            <div className="order-form-row">


                                <div className="order-form-group">

                                    <label>
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        placeholder="1"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* TOTAL PRICE */}

                                <div className="order-form-group">

                                    <label>
                                        Total Price
                                    </label>

                                    <input
                                        type="number"
                                        name="total_price"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.total_price}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                            </div>


                            {/* BUTTONS */}

                            <div className="order-modal-actions">


                                <button
                                    type="button"
                                    className="order-cancel-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="order-save-btn"
                                >
                                    Add Order
                                </button>


                            </div>


                        </form>


                    </div>

                </div>

            )}

        </section>

    );

}

export default Orders;