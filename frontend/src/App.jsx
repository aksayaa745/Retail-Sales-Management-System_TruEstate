import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:4000";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // fixed for now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO in next steps:
  // const [search, setSearch] = useState("");
  // const [sortBy, setSortBy] = useState("");
  // const [sortOrder, setSortOrder] = useState("asc");

  // Fetch transactions from backend
  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          // we'll add search, sort, filters later
        });

        const res = await fetch(`${API_BASE_URL}/api/sales?${params.toString()}`);

        if (!res.ok) {
          throw new Error("Failed to fetch sales data");
        }

        const json = await res.json();
        setTransactions(json.data || []);
        setMeta(json.meta || {});
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [page, pageSize]);

  const handlePrevious = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (meta.totalPages && page < meta.totalPages) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Retail Sales Management</h1>
        <p className="app-subtitle">
          Explore, filter, and analyze retail transactions.
        </p>
      </header>

      <main className="app-main">
        {/* Top bar: Search + Sort (static for now) */}
        <section className="top-bar">
          <div className="search-bar">
            <label htmlFor="search-input">Search</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search by customer name or phone..."
              // value={search}
              // onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="sort-dropdown">
            <label htmlFor="sort-select">Sort By</label>
            <select
              id="sort-select"
              // value={sortBy}
              // onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">None</option>
              <option value="date_desc">Date – Newest First</option>
              <option value="date_asc">Date – Oldest First</option>
              <option value="quantity_desc">Quantity – High to Low</option>
              <option value="quantity_asc">Quantity – Low to High</option>
              <option value="customerName_asc">Customer Name (A–Z)</option>
              <option value="customerName_desc">Customer Name (Z–A)</option>
            </select>
          </div>
        </section>

        <section className="content-layout">
          {/* Left: Filter Panel (static for now) */}
          <aside className="filter-panel">
            <h2>Filters</h2>

            <div className="filter-group">
              <h3>Region</h3>
              <div className="filter-options">
                <label>
                  <input type="checkbox" value="North" /> North
                </label>
                <label>
                  <input type="checkbox" value="South" /> South
                </label>
                <label>
                  <input type="checkbox" value="East" /> East
                </label>
                <label>
                  <input type="checkbox" value="West" /> West
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h3>Gender</h3>
              <div className="filter-options">
                <label>
                  <input type="checkbox" value="Male" /> Male
                </label>
                <label>
                  <input type="checkbox" value="Female" /> Female
                </label>
                <label>
                  <input type="checkbox" value="Other" /> Other
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h3>Age Range</h3>
              <div className="age-inputs">
                <input type="number" placeholder="Min" />
                <span>–</span>
                <input type="number" placeholder="Max" />
              </div>
            </div>

            <div className="filter-group">
              <h3>Product Category</h3>
              <input
                type="text"
                placeholder="e.g., Electronics, Clothing..."
              />
            </div>

            <div className="filter-group">
              <h3>Payment Method</h3>
              <div className="filter-options">
                <label>
                  <input type="checkbox" value="Card" /> Card
                </label>
                <label>
                  <input type="checkbox" value="Cash" /> Cash
                </label>
                <label>
                  <input type="checkbox" value="UPI" /> UPI
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h3>Date Range</h3>
              <div className="date-inputs">
                <input type="date" />
                <span>to</span>
                <input type="date" />
              </div>
            </div>

            <button className="apply-filters-btn">Apply Filters</button>
          </aside>

          {/* Right: Table + Pagination */}
          <section className="table-section">
            <div className="table-header">
              <h2>Transactions</h2>
              <p className="table-subtitle">
                {loading
                  ? "Loading data..."
                  : `Showing page ${meta.currentPage || 1} of ${
                      meta.totalPages || 1
                    } (${meta.totalItems || 0} records)`}
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: "0.5rem 0.75rem",
                  marginBottom: "0.75rem",
                  borderRadius: "0.5rem",
                  background: "#fee2e2",
                  color: "#b91c1c",
                  fontSize: "0.85rem",
                }}
              >
                {error}
              </div>
            )}

            <div className="table-wrapper">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Region</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Final Amount</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8">Loading...</td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan="8">No records found.</td>
                    </tr>
                  ) : (
                    transactions.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row["Date"] || row.date}</td>
                        <td>{row["Customer Name"] || row.customerName}</td>
                        <td>{row["Customer Region"] || row.customerRegion}</td>
                        <td>{row["Product Name"] || row.productName}</td>
                        <td>{row["Product Category"] || row.productCategory}</td>
                        <td>{row["Quantity"] || row.quantity}</td>
                        <td>{row["Final Amount"] || row.finalAmount}</td>
                        <td>{row["Payment Method"] || row.paymentMethod}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                className="page-btn"
                onClick={handlePrevious}
                disabled={page <= 1 || loading}
              >
                Previous
              </button>
              <span className="page-info">
                Page <strong>{meta.currentPage || 1}</strong> of{" "}
                <strong>{meta.totalPages || 1}</strong>
              </span>
              <button
                className="page-btn"
                onClick={handleNext}
                disabled={
                  loading || !meta.totalPages || page >= meta.totalPages
                }
              >
                Next
              </button>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
