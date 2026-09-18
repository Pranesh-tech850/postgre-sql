
import { useState } from "react";
import "./Orders.css";

const API_URL = import.meta.env.VITE_API_URL;

function Orders() {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(false);

    const [showForm, setShowForm] = useState(false);

    // Search
    const [search, setSearch] = useState("");
    const [searchTime, setSearchTime] = useState(null);

    // null = Add mode
    // object = Edit mode
    const [editingOrder, setEditingOrder] = useState(null);

    const [formData, setFormData] = useState({
        customer_name: "",
        product_name: "",
        quantity: "",
        total_price: ""
    });

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);


    // ========================================
    // FETCH ORDERS
    // ========================================

    const fetchOrders = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/orders`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();

            setOrders(data);

            // Reset search information
            setSearchTime(null);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // SEARCH ORDERS BY ID
    // ========================================

    const searchOrders = async () => {

        if (!search.trim()) {

            fetchOrders();

            return;
        }

        try {

            setLoading(true);

            const start = performance.now();

            const response = await fetch(
                `${API_URL}/orders/search?id=${encodeURIComponent(search)}`
            );

            if (!response.ok) {
                throw new Error("Failed to search orders");
            }

            const data = await response.json();

            setOrders(data);

            const end = performance.now();

            setSearchTime(
                (end - start).toFixed(2)
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // CLEAR SEARCH
    // ========================================

    const clearSearch = () => {

        setSearch("");

        setSearchTime(null);

        fetchOrders();

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

        setEditingOrder(null);

        setFormData({
            customer_name: "",
            product_name: "",
            quantity: "",
            total_price: ""
        });

        setShowForm(true);

    };


    // ========================================
    // OPEN EDIT ORDER MODAL
    // ========================================

    const openEditOrder = (order) => {

        setEditingOrder(order);

        setFormData({
            customer_name: order.customer_name,
            product_name: order.product_name,
            quantity: order.quantity,
            total_price: order.total_price
        });

        setShowForm(true);

    };


    // ========================================
    // CLOSE MODAL
    // ========================================

    const closeModal = () => {

        if (saving) {
            return;
        }

        setShowForm(false);

        setEditingOrder(null);

        setFormData({
            customer_name: "",
            product_name: "",
            quantity: "",
            total_price: ""
        });

    };


    // ========================================
    // ADD / UPDATE ORDER
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);


            // ====================================
            // EDIT ORDER
            // ====================================

            if (editingOrder) {

                const response = await fetch(
                    `${API_URL}/orders/${editingOrder.id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            customer_name:
                                formData.customer_name,

                            product_name:
                                formData.product_name,

                            quantity:
                                Number(formData.quantity),

                            total_price:
                                Number(formData.total_price)
                        })
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to update order"
                    );

                }


                const data = await response.json();

                console.log(
                    "Order updated:",
                    data
                );

            }


            // ====================================
            // ADD ORDER
            // ====================================

            else {

                const response = await fetch(
                    `${API_URL}/orders`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            customer_name:
                                formData.customer_name,

                            product_name:
                                formData.product_name,

                            quantity:
                                Number(formData.quantity),

                            total_price:
                                Number(formData.total_price)
                        })
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to add order"
                    );

                }


                const data = await response.json();

                console.log(
                    "Order added:",
                    data
                );

            }


            // ====================================
            // CLOSE MODAL
            // ====================================

            setShowForm(false);

            setEditingOrder(null);

            setFormData({
                customer_name: "",
                product_name: "",
                quantity: "",
                total_price: ""
            });


            // ====================================
            // REFRESH ORDERS
            // ====================================

            await fetchOrders();

        } catch (error) {

            console.error(error);

        } finally {

            setSaving(false);

        }

    };


    // ========================================
    // DELETE ORDER
    // ========================================

    const deleteOrder = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this order?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            setDeletingId(id);


            const response = await fetch(
                `${API_URL}/orders/${id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete order"
                );

            }


            const data = await response.json();

            console.log(
                "Order deleted:",
                data
            );


            // ====================================
            // REFRESH ORDERS
            // ====================================

            await fetchOrders();

        } catch (error) {

            console.error(error);

        } finally {

            setDeletingId(null);

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
                        disabled={loading}
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


                    {/* TITLE */}

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


                    {/* SEARCH */}

                    <div className="order-search-container">

                        <input
                            type="text"
                            placeholder="Search order ID..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }

                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    searchOrders();
                                }

                            }}
                        />


                        <button
                            className="order-search-btn"
                            onClick={searchOrders}
                            disabled={loading}
                        >
                            {loading
                                ? "Searching..."
                                : "Search"
                            }
                        </button>


                        {search && (

                            <button
                                className="order-clear-btn"
                                onClick={clearSearch}
                                disabled={loading}
                            >
                                Clear
                            </button>

                        )}

                    </div>


                    {/* SEARCH TIME */}

                    {searchTime !== null && (

                        <span className="order-search-time">
                            Search time: {searchTime} ms
                        </span>

                    )}


                    {/* LARGE DATA */}

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
                            No orders found
                        </h3>

                        <p>
                            {search
                                ? `No orders found for "${search}".`
                                : 'Click "Fetch Orders" to retrieve order data.'
                            }
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


                                        {/* ID */}

                                        <td>

                                            <span className="order-id">
                                                #{order.id}
                                            </span>

                                        </td>


                                        {/* CUSTOMER */}

                                        <td>
                                            {order.customer_name}
                                        </td>


                                        {/* PRODUCT */}

                                        <td>
                                            {order.product_name}
                                        </td>


                                        {/* QUANTITY */}

                                        <td>

                                            <span className="quantity">
                                                {order.quantity}
                                            </span>

                                        </td>


                                        {/* TOTAL PRICE */}

                                        <td className="order-price">
                                            ₹{order.total_price}
                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <button
                                                onClick={() =>
                                                    openEditOrder(order)
                                                }

                                                disabled={
                                                    deletingId === order.id
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                onClick={() =>
                                                    deleteOrder(order.id)
                                                }

                                                disabled={
                                                    deletingId === order.id
                                                }
                                            >

                                                {deletingId === order.id
                                                    ? "Deleting..."
                                                    : "Delete"
                                                }

                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ========================================
                ADD / EDIT ORDER MODAL
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


                        {/* ========================================
                            MODAL HEADER
                        ======================================== */}

                        <div className="order-modal-header">

                            <div>

                                <span className="modal-label">

                                    {editingOrder
                                        ? "UPDATE TRANSACTION"
                                        : "NEW TRANSACTION"
                                    }

                                </span>


                                <h3>

                                    {editingOrder
                                        ? "Edit Order"
                                        : "Add New Order"
                                    }

                                </h3>


                                <p>

                                    {editingOrder
                                        ? "Update the order details below."
                                        : "Enter the order details below."
                                    }

                                </p>

                            </div>


                            <button
                                className="close-order-modal"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                ×
                            </button>

                        </div>


                        {/* ========================================
                            FORM
                        ======================================== */}

                        <form onSubmit={handleSubmit}>


                            {/* CUSTOMER */}

                            <div className="order-form-group">

                                <label>
                                    Customer Name
                                </label>

                                <input
                                    type="text"
                                    name="customer_name"
                                    placeholder="Enter customer name"
                                    value={
                                        formData.customer_name
                                    }
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
                                    value={
                                        formData.product_name
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* QUANTITY + PRICE */}

                            <div className="order-form-row">


                                {/* QUANTITY */}

                                <div className="order-form-group">

                                    <label>
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        placeholder="1"
                                        value={
                                            formData.quantity
                                        }
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
                                        value={
                                            formData.total_price
                                        }
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                            </div>


                            {/* ========================================
                                BUTTONS
                            ======================================== */}

                            <div className="order-modal-actions">


                                <button
                                    type="button"
                                    className="order-cancel-btn"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="order-save-btn"
                                    disabled={saving}
                                >

                                    {saving

                                        ? editingOrder
                                            ? "Updating..."
                                            : "Adding..."

                                        : editingOrder
                                            ? "Update Order"
                                            : "Add Order"

                                    }

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

