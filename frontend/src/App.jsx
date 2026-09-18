import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Students from "./components/Students";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Balance from "./components/Balance";
import "./App.css";

function App() {
    return (
        <BrowserRouter>

          <div className="app-container">

    <header className="app-header">

        <div className="app-header-inner">

            <div className="app-title">

                <div className="app-logo">
                    PG
                </div>

                <div>
                    <h1>PostgreSQL Store</h1>
                    <span>Database Management Dashboard</span>
                </div>

            </div>


            <nav className="app-nav">

                <Link to="/students">
                    Students
                </Link>

                <Link to="/products">
                    Products
                </Link>

                <Link to="/orders">
                    Orders
                </Link>

                <Link to="/balance">
                    Balance
                </Link>

            </nav>

        </div>

    </header>


    <main className="page-content">

        <Routes>

            <Route
                path="/students"
                element={<Students />}
            />

            <Route
                path="/products"
                element={<Products />}
            />

            <Route
                path="/orders"
                element={<Orders />}
            />

            <Route
                path="/balance"
                element={<Balance />}
            />

        </Routes>

    </main>

</div>

        </BrowserRouter>
    );
}

export default App;