import React, { useState } from "react";
import "./Balance.css";

const Balance = () => {

    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [searchTime, setSearchTime] = useState(null);

    // Add Balance Modal
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        product: "",
        quantity: ""
    });


    // Buy Modal
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [selectedBalance, setSelectedBalance] = useState(null);

    const [buyForm, setBuyForm] = useState({
        name: "",
        email: "",
        quantity: ""
    });

    const [buyLoading, setBuyLoading] = useState(false);
    const [buyError, setBuyError] = useState("");


    // ========================================
    // FETCH ALL BALANCE RECORDS
    // ========================================

    const fetchBalances = async () => {

        try {

            setLoading(true);

            const startTime = performance.now();

            const response = await fetch(
                "http://localhost:8000/balance"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch balance records");
            }

            const data = await response.json();

            const endTime = performance.now();

            setBalances(data);

            setSearchTime(endTime - startTime);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // SEARCH BALANCE
    // ========================================

    const searchBalance = async () => {

        if (!search.trim()) {

            fetchBalances();

            return;
        }

        try {

            setLoading(true);

            const startTime = performance.now();

            const response = await fetch(
                `http://localhost:8000/balance/search?search=${encodeURIComponent(search)}`
            );

            if (!response.ok) {
                throw new Error("Failed to search balance records");
            }

            const data = await response.json();

            const endTime = performance.now();

            setBalances(data);

            setSearchTime(endTime - startTime);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // ADD FORM INPUT CHANGE
    // ========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // ========================================
    // OPEN ADD FORM
    // ========================================

    const handleAdd = () => {

        setFormData({
            product: "",
            quantity: ""
        });

        setShowForm(true);

    };


    // ========================================
    // ADD BALANCE
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8000/balance",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        product: formData.product,
                        quantity: Number(formData.quantity)
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to add balance record"
                );
            }

            await fetchBalances();

            setShowForm(false);

            setFormData({
                product: "",
                quantity: ""
            });

        } catch (error) {

            console.error(error);

        }

    };


    // ========================================
    // OPEN BUY MODAL
    // ========================================

    const handleBuy = (balance) => {

        setSelectedBalance(balance);

        setBuyForm({
            name: "",
            email: "",
            quantity: ""
        });

        setBuyError("");

        setShowBuyModal(true);

    };


    // ========================================
    // BUY FORM INPUT CHANGE
    // ========================================

    const handleBuyChange = (e) => {

        setBuyForm({
            ...buyForm,
            [e.target.name]: e.target.value
        });

        setBuyError("");

    };


    // ========================================
    // CONFIRM BUY
    // ========================================

    const confirmBuy = async (e) => {

        e.preventDefault();

        if (!selectedBalance) {
            return;
        }


        // ====================================
        // VALIDATE QUANTITY
        // ====================================

        const requestedQuantity = Number(
            buyForm.quantity
        );

        if (requestedQuantity <= 0) {

            setBuyError(
                "Please enter a valid quantity."
            );

            return;

        }


        if (
            requestedQuantity >
            Number(selectedBalance.quantity)
        ) {

            setBuyError(
                `Only ${selectedBalance.quantity} units are available.`
            );

            return;

        }


        try {

            setBuyLoading(true);

            setBuyError("");


            // ====================================
            // SEND BUY REQUEST
            // ====================================

            const response = await fetch(
                `http://localhost:8000/balance/${selectedBalance.id}/buy`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: buyForm.name,
                        email: buyForm.email,
                        quantity: Number(requestedQuantity)
                    })
                }
            );


            const data = await response.json();


            // ====================================
            // BACKEND ERROR
            // ====================================

            if (!response.ok) {

                setBuyError(
                    data.message ||
                    "Unable to complete purchase."
                );

                return;

            }


            // ====================================
            // PURCHASE SUCCESS
            // ====================================

            setShowBuyModal(false);

            setSelectedBalance(null);

            setBuyForm({
                name: "",
                email: "",
                quantity: ""
            });

            setBuyError("");


            // ====================================
            // REFRESH TABLE
            // ====================================

            await fetchBalances();


        } catch (error) {

            console.error(error);

            setBuyError(
                "Something went wrong. Please try again."
            );

        } finally {

            setBuyLoading(false);

        }

    };


    // ========================================
    // CLOSE BUY MODAL
    // ========================================

    const closeBuyModal = () => {

        if (buyLoading) {
            return;
        }

        setShowBuyModal(false);

        setSelectedBalance(null);

        setBuyForm({
            name: "",
            email: "",
            quantity: ""
        });

        setBuyError("");

    };


    // ========================================
    // CLEAR SEARCH
    // ========================================

    const clearSearch = () => {

        setSearch("");

        setSearchTime(null);

        fetchBalances();

    };


    return (

        <section className="balance-section">


            {/* ========================================
                HEADER
            ======================================== */}

            <div className="balance-header">

                <div>

                    <span className="balance-label">
                        CONCURRENCY TEST
                    </span>

                    <h2>
                        Balance
                    </h2>

                    <p>
                        Manage product quantity for concurrency testing
                    </p>

                </div>


                <div className="balance-actions">

                    <button
                        className="add-balance-btn"
                        onClick={handleAdd}
                    >
                        + Add Balance
                    </button>


                    <button
                        className="balance-fetch-btn"
                        onClick={fetchBalances}
                    >
                        {loading
                            ? "Loading..."
                            : "Fetch Balance"
                        }
                    </button>

                </div>

            </div>


            {/* ========================================
                BALANCE CARD
            ======================================== */}

            <div className="balance-card">


                {/* ========================================
                    TOP BAR
                ======================================== */}

                <div className="balance-top">

                    <div>

                        <h3>
                            Product Balance
                        </h3>

                        <span>
                            {balances.length} records
                        </span>


                        {searchTime !== null && (

                            <span className="balance-search-time">

                                Search time:
                                {" "}
                                {searchTime.toFixed(2)}
                                {" "}
                                ms

                            </span>

                        )}

                    </div>


                    {/* ========================================
                        SEARCH
                    ======================================== */}

                    <div className="balance-search">

                        <input
                            type="text"
                            placeholder="Search product or ID..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    searchBalance();
                                }

                            }}
                        />


                        <button
                            className="balance-search-btn"
                            onClick={searchBalance}
                        >
                            Search
                        </button>


                        {search && (

                            <button
                                className="balance-clear-btn"
                                onClick={clearSearch}
                            >
                                Clear
                            </button>

                        )}

                    </div>

                </div>


                {/* ========================================
                    EMPTY STATE
                ======================================== */}

                {balances.length === 0 ? (

                    <div className="balance-empty">

                        <div className="balance-icon">
                            📊
                        </div>

                        <h3>
                            No balance records found
                        </h3>

                        <p>
                            Fetch balance records or add a new record.
                        </p>

                    </div>

                ) : (


                    /* ========================================
                        TABLE
                    ======================================== */

                    <div className="balance-table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Quantity
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {balances.map((balance) => (

                                    <tr key={balance.id}>


                                        {/* ID */}

                                        <td>

                                            <span className="balance-id">
                                                #{balance.id}
                                            </span>

                                        </td>


                                        {/* PRODUCT */}

                                        <td>

                                            <strong>
                                                {balance.product}
                                            </strong>

                                        </td>


                                        {/* QUANTITY */}

                                        <td>

                                            <span
                                                className={
                                                    balance.quantity > 10
                                                        ? "quantity-good"
                                                        : "quantity-low"
                                                }
                                            >
                                                {balance.quantity} units
                                            </span>

                                        </td>


                                        {/* BUY */}

                                        <td>

                                            <div className="balance-table-actions">

                                                <button
                                                    className="balance-buy-btn"
                                                    onClick={() =>
                                                        handleBuy(balance)
                                                    }
                                                    disabled={
                                                        Number(balance.quantity) <= 0
                                                    }
                                                >
                                                    Buy
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ========================================
                ADD BALANCE MODAL
            ======================================== */}

            {showForm && (

                <div className="balance-modal-overlay">

                    <div className="balance-modal">


                        {/* MODAL HEADER */}

                        <div className="balance-modal-header">

                            <h3>
                                Add Balance
                            </h3>


                            <button
                                className="close-balance-modal-btn"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form onSubmit={handleSubmit}>


                            {/* PRODUCT */}

                            <div className="form-group">

                                <label>
                                    Product
                                </label>

                                <input
                                    type="text"
                                    name="product"
                                    value={formData.product}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    required
                                />

                            </div>


                            {/* QUANTITY */}

                            <div className="form-group">

                                <label>
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    placeholder="Enter quantity"
                                    min="0"
                                    required
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-btn"
                                >
                                    Add Balance
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ========================================
                BUY MODAL
            ======================================== */}

            {showBuyModal && selectedBalance && (

                <div className="balance-modal-overlay">

                    <div className="balance-modal">


                        {/* ====================================
                            MODAL HEADER
                        ==================================== */}

                        <div className="balance-modal-header">

                            <div>

                                <h3>
                                    Confirm Purchase
                                </h3>

                                <p>
                                    {selectedBalance.product}
                                </p>

                            </div>


                            <button
                                className="close-balance-modal-btn"
                                onClick={closeBuyModal}
                            >
                                ×
                            </button>

                        </div>


                        {/* ====================================
                            PRODUCT DETAILS
                        ==================================== */}

                        <div className="buy-product-details">

                            <div>

                                <span>
                                    Product
                                </span>

                                <strong>
                                    {selectedBalance.product}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Available Quantity
                                </span>

                                <strong>
                                    {selectedBalance.quantity}
                                </strong>

                            </div>

                        </div>


                        {/* ====================================
                            ERROR MESSAGE
                        ==================================== */}

                        {buyError && (

                            <div className="buy-error-message">
                                {buyError}
                            </div>

                        )}


                        {/* ====================================
                            BUY FORM
                        ==================================== */}

                        <form onSubmit={confirmBuy}>


                            {/* NAME */}

                            <div className="form-group">

                                <label>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={buyForm.name}
                                    onChange={handleBuyChange}
                                    placeholder="Enter your name"
                                    required
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={buyForm.email}
                                    onChange={handleBuyChange}
                                    placeholder="Enter your email"
                                    required
                                />

                            </div>


                            {/* QUANTITY */}

                            <div className="form-group">

                                <label>
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    value={buyForm.quantity}
                                    onChange={handleBuyChange}
                                    placeholder="Enter quantity to buy"
                                    min="1"
                                    max={selectedBalance.quantity}
                                    required
                                />

                                <small>
                                    Available:
                                    {" "}
                                    {selectedBalance.quantity}
                                    {" "}
                                    units
                                </small>

                            </div>


                            {/* BUTTONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeBuyModal}
                                    disabled={buyLoading}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={buyLoading}
                                >

                                    {buyLoading
                                        ? "Processing..."
                                        : "Confirm Buy"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>

    );

};

export default Balance;