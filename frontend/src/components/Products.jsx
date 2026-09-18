
import { useState } from "react";
import "./Products.css";

const API_URL = import.meta.env.VITE_API_URL;

function Products() {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [searchTime, setSearchTime] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: ""
    });


    // ========================================
    // FETCH ALL PRODUCTS
    // ========================================

    const fetchProducts = async () => {

        try {

            setLoading(true);

            const startTime = performance.now();

            const response = await fetch(
                `${API_URL}/products`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();

            const endTime = performance.now();

            setProducts(data);

            setSearchTime(endTime - startTime);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // SEARCH PRODUCT
    // ========================================

    const searchProduct = async () => {

        if (!search.trim()) {

            fetchProducts();

            return;
        }


        try {

            setLoading(true);

            const startTime = performance.now();


            const response = await fetch(
                `${API_URL}/products/search?search=${encodeURIComponent(search)}`
            );


            if (!response.ok) {
                throw new Error("Failed to search products");
            }


            const data = await response.json();


            const endTime = performance.now();


            setProducts(data);

            setSearchTime(endTime - startTime);


        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // FORM INPUT CHANGE
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

        setEditingProduct(null);

        setFormData({
            name: "",
            price: "",
            stock: ""
        });

        setShowForm(true);

    };


    // ========================================
    // OPEN EDIT FORM
    // ========================================

    const handleEdit = (product) => {

        setEditingProduct(product);

        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock
        });

        setShowForm(true);

    };


    // ========================================
    // ADD / UPDATE PRODUCT
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            // ====================================
            // UPDATE
            // ====================================

            if (editingProduct) {

                const response = await fetch(
                    `${API_URL}/products/${editingProduct.id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            name: formData.name,
                            price: Number(formData.price),
                            stock: Number(formData.stock)
                        })
                    }
                );


                if (!response.ok) {
                    throw new Error("Failed to update product");
                }

            }


            // ====================================
            // ADD
            // ====================================

            else {

                const response = await fetch(
                    `${API_URL}/products`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            name: formData.name,
                            price: Number(formData.price),
                            stock: Number(formData.stock)
                        })
                    }
                );


                if (!response.ok) {
                    throw new Error("Failed to add product");
                }

            }


            // ====================================
            // REFRESH PRODUCTS
            // ====================================

            await fetchProducts();

            setShowForm(false);


        } catch (error) {

            console.error(error);

        }

    };


    // ========================================
    // DELETE PRODUCT
    // ========================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/products/${id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {
                throw new Error("Failed to delete product");
            }


            await fetchProducts();


        } catch (error) {

            console.error(error);

        }

    };


    // ========================================
    // CLEAR SEARCH
    // ========================================

    const clearSearch = () => {

        setSearch("");

        setSearchTime(null);

        fetchProducts();

    };


    return (

        <section className="products-section">


            {/* ========================================
                HEADER
            ======================================== */}

            <div className="products-header">


                <div>

                    <span className="product-label">
                        INVENTORY
                    </span>

                    <h2>
                        Products
                    </h2>

                    <p>
                        Manage and explore product inventory
                    </p>

                </div>


                <div className="product-actions">


                    {/* ADD */}

                    <button
                        className="add-product-btn"
                        onClick={handleAdd}
                    >
                        + Add Product
                    </button>


                    {/* FETCH */}

                    <button
                        className="product-fetch-btn"
                        onClick={fetchProducts}
                    >
                        {loading
                            ? "Loading..."
                            : "Fetch Products"
                        }
                    </button>


                </div>

            </div>


            {/* ========================================
                PRODUCTS CARD
            ======================================== */}

            <div className="products-card">


                {/* ========================================
                    TOP BAR
                ======================================== */}

                <div className="products-top">


                    <div>

                        <h3>
                            Product Inventory
                        </h3>

                        <span>
                            {products.length} products
                        </span>


                        {/* SEARCH TIME */}

                        {searchTime !== null && (

                            <span className="product-search-time">

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

                    <div className="product-search">


                        <input
                            type="text"
                            placeholder="Search product..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    searchProduct();
                                }

                            }}
                        />


                        <button
                            className="product-search-btn"
                            onClick={searchProduct}
                        >
                            Search
                        </button>


                        {search && (

                            <button
                                className="product-clear-btn"
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

                {products.length === 0 ? (

                    <div className="product-empty">


                        <div className="product-icon">
                            📦
                        </div>


                        <h3>
                            No products found
                        </h3>


                        <p>
                            Fetch products or search for a product.
                        </p>


                    </div>

                ) : (


                    /* ========================================
                        TABLE
                    ======================================== */

                    <div className="product-table-wrapper">


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
                                        Price
                                    </th>

                                    <th>
                                        Stock
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>


                                {products.map((product) => (

                                    <tr key={product.id}>


                                        {/* ID */}

                                        <td>

                                            <span className="product-id">
                                                #{product.id}
                                            </span>

                                        </td>


                                        {/* PRODUCT NAME */}

                                        <td>

                                            <strong>
                                                {product.name}
                                            </strong>

                                        </td>


                                        {/* PRICE */}

                                        <td className="price">

                                            ₹{product.price}

                                        </td>


                                        {/* STOCK */}

                                        <td>

                                            <span
                                                className={
                                                    product.stock > 10
                                                        ? "stock-good"
                                                        : "stock-low"
                                                }
                                            >
                                                {product.stock} units
                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="product-table-actions">


                                                <button
                                                    className="product-edit-btn"
                                                    onClick={() =>
                                                        handleEdit(product)
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="product-delete-btn"
                                                    onClick={() =>
                                                        handleDelete(product.id)
                                                    }
                                                >
                                                    Delete
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
                ADD / EDIT MODAL
            ======================================== */}

            {showForm && (

                <div className="product-modal-overlay">


                    <div className="product-modal">


                        {/* MODAL HEADER */}

                        <div className="product-modal-header">


                            <h3>

                                {editingProduct
                                    ? "Edit Product"
                                    : "Add Product"
                                }

                            </h3>


                            <button
                                className="close-product-modal-btn"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                ×
                            </button>


                        </div>


                        {/* FORM */}

                        <form onSubmit={handleSubmit}>


                            {/* PRODUCT NAME */}

                            <div className="form-group">

                                <label>
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* PRICE */}

                            <div className="form-group">

                                <label>
                                    Price
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />

                            </div>


                            {/* STOCK */}

                            <div className="form-group">

                                <label>
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />

                            </div>


                            {/* MODAL BUTTONS */}

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

                                    {editingProduct
                                        ? "Update Product"
                                        : "Add Product"
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

export default Products;

