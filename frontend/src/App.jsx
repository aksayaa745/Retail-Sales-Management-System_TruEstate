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
  const [pageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search + sort
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState("customerName_asc");
  const [sortBy, setSortBy] = useState("customerName");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filters (single-select style like top chips)
  const [regions, setRegions] = useState([]);
  const [genders, setGenders] = useState([]);
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [categoryText, setCategoryText] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleSingleSelect = (value, setter) => {
    if (!value) setter([]);
    else setter([value]);
    setPage(1);
  };

  function updateSortFromValue(value) {
    setSortValue(value);
    if (!value) {
      setSortBy("");
      setSortOrder("asc");
      setPage(1);
      return;
    }
    const [field, order] = value.split("_");
    if (field === "date") setSortBy("date");
    else if (field === "quantity") setSortBy("quantity");
    else if (field === "customerName") setSortBy("customerName");
    else setSortBy("");
    setSortOrder(order === "desc" ? "desc" : "asc");
    setPage(1);
  }

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (search.trim() !== "") params.set("search", search.trim());
        if (sortBy) {
          params.set("sortBy", sortBy);
          params.set("sortOrder", sortOrder);
        }
        if (regions.length > 0) params.set("regions", regions.join(","));
        if (genders.length > 0) params.set("genders", genders.join(","));
        if (ageMin) params.set("ageMin", ageMin);
        if (ageMax) params.set("ageMax", ageMax);
        if (categoryText.trim() !== "")
          params.set("categories", categoryText.trim());
        if (paymentMethods.length > 0)
          params.set("paymentMethods", paymentMethods.join(","));
        if (dateFrom) params.set("dateFrom", dateFrom);
        if (dateTo) params.set("dateTo", dateTo);

        const res = await fetch(
          `${API_BASE_URL}/api/sales?${params.toString()}`
        );
        if (!res.ok) throw new Error("Failed to fetch sales data");

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
  }, [
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
    regions,
    genders,
    ageMin,
    ageMax,
    categoryText,
    paymentMethods,
    dateFrom,
    dateTo,
  ]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") setPage(1);
  };

  const handlePageClick = (newPage) => {
    if (newPage >= 1 && newPage <= (meta.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const buildPageNumbers = () => {
    const totalPages = meta.totalPages || 1;
    const current = meta.currentPage || page || 1;
    const maxToShow = 6;
    const pages = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(totalPages, start + maxToShow - 1);
    if (end - start < maxToShow - 1) {
      start = Math.max(1, end - maxToShow + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // Simple KPI values (current page only)
  const totalUnitsPage = transactions.reduce((sum, row) => {
    const q = Number(row["Quantity"] || row.quantity || 0);
    return sum + (Number.isNaN(q) ? 0 : q);
  }, 0);

  const totalAmountPage = transactions.reduce((sum, row) => {
    const v = Number(row["Final Amount"] || row.finalAmount || 0);
    return sum + (Number.isNaN(v) ? 0 : v);
  }, 0);

  return (
    <div className="app-window">
      <div className="app-shell">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="vault-card">
            <div className="vault-logo-circle">V</div>
            <div className="vault-text">
              <div className="vault-title">Vault</div>
              <div className="vault-user">Anurag Yadav</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="sidebar-section">
              <div className="sidebar-section-title">Dashboard</div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-section-title">Nexus</div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-section-title">Intake</div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-section-title with-chevron">
                Services
              </div>
              <ul className="sidebar-radio-list">
                <li>
                  <span className="radio-circle" /> Pre-active
                </li>
                <li className="is-active">
                  <span className="radio-circle filled" /> Active
                </li>
                <li>
                  <span className="radio-circle" /> Blocked
                </li>
                <li>
                  <span className="radio-circle" /> Closed
                </li>
              </ul>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-section-title with-chevron">
                Invoices
              </div>
              <ul className="sidebar-nested-list">
                <li>Proforma Invoices</li>
                <li>Final Invoices</li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* MAIN AREA */}
        <div className="main-area">
          {/* TOP BAR */}
          <header className="top-header">
            <div className="top-header-left">
              <h1>Sales Management System</h1>
            </div>
            <div className="top-header-right">
              <input
                className="global-search"
                type="text"
                placeholder="Name, Phone no."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
          </header>

          <main className="content-area">
            {/* FILTER CHIPS ROW */}
            <section className="filter-chip-row">
              <div className="chip-group">
                <div className="chip">
                  <span>Customer Region</span>
                  <select
                    value={regions[0] || ""}
                    onChange={(e) =>
                      handleSingleSelect(e.target.value, setRegions)
                    }
                  >
                    <option value="">All</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                  </select>
                </div>

                <div className="chip">
                  <span>Gender</span>
                  <select
                    value={genders[0] || ""}
                    onChange={(e) =>
                      handleSingleSelect(e.target.value, setGenders)
                    }
                  >
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="chip">
                  <span>Age Range</span>
                  <div className="chip-inline-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={ageMin}
                      onChange={(e) => {
                        setAgeMin(e.target.value);
                        setPage(1);
                      }}
                    />
                    <span>–</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={ageMax}
                      onChange={(e) => {
                        setAgeMax(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>

                <div className="chip">
                  <span>Product Category</span>
                  <input
                    type="text"
                    placeholder="All"
                    value={categoryText}
                    onChange={(e) => {
                      setCategoryText(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                {/* Tags omitted (dataset doesn’t necessarily have tags) */}

                <div className="chip">
                  <span>Payment Method</span>
                  <select
                    value={paymentMethods[0] || ""}
                    onChange={(e) =>
                      handleSingleSelect(e.target.value, setPaymentMethods)
                    }
                  >
                    <option value="">All</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>

                <div className="chip">
                  <span>Date</span>
                  <div className="chip-inline-inputs">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value);
                        setPage(1);
                      }}
                    />
                    <span>–</span>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="chip-sort">
                <span>Sort by:</span>
                <select
                  value={sortValue}
                  onChange={(e) => updateSortFromValue(e.target.value)}
                >
                  <option value="customerName_asc">
                    Customer Name (A–Z)
                  </option>
                  <option value="customerName_desc">
                    Customer Name (Z–A)
                  </option>
                  <option value="date_desc">Date – Newest First</option>
                  <option value="date_asc">Date – Oldest First</option>
                  <option value="quantity_desc">
                    Quantity – High to Low
                  </option>
                  <option value="quantity_asc">
                    Quantity – Low to High
                  </option>
                </select>
              </div>
            </section>

            {/* KPI CARDS */}
            <section className="kpi-row">
              <div className="kpi-card">
                <div className="kpi-label">Total units sold</div>
                <div className="kpi-value">{totalUnitsPage}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Total Amount</div>
                <div className="kpi-value">
                  ₹ {totalAmountPage.toLocaleString("en-IN")} (page)
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Total Discount</div>
                <div className="kpi-value">₹ 0 (not in dataset)</div>
              </div>
            </section>

            {/* TABLE + PAGINATION */}
            <section className="table-shell">
              <div className="table-header-row">
                <h2>Transactions</h2>
                <p className="table-meta">
                  {loading
                    ? "Loading data..."
                    : `Page ${meta.currentPage || 1} of ${
                        meta.totalPages || 1
                      } • ${meta.totalItems || 0} records`}
                </p>
              </div>

              {error && <div className="error-banner">{error}</div>}

              <div className="table-wrapper">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer ID</th>
                      <th>Customer name</th>
                      <th>Phone Number</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Product Category</th>
                      <th>Quantity</th>
                      <th>Total Amount</th>
                      <th>Customer region</th>
                      <th>Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="11">Loading...</td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan="11">No records found.</td>
                      </tr>
                    ) : (
                      transactions.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row["Date"] || row.date}</td>
                          <td>{row["Customer ID"] || row.customerId}</td>
                          <td>{row["Customer Name"] || row.customerName}</td>
                          <td>{row["Phone Number"] || row.phoneNumber}</td>
                          <td>{row["Gender"] || row.gender}</td>
                          <td>{row["Age"] || row.age}</td>
                          <td>
                            {row["Product Category"] || row.productCategory}
                          </td>
                          <td>{row["Quantity"] || row.quantity}</td>
                          <td>{row["Final Amount"] || row.finalAmount}</td>
                          <td>
                            {row["Customer Region"] || row.customerRegion}
                          </td>
                          <td>{row["Payment Method"] || row.paymentMethod}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination-row">
                {buildPageNumbers().map((p) => (
                  <button
                    key={p}
                    className={
                      "page-number" +
                      (p === (meta.currentPage || page) ? " active" : "")
                    }
                    onClick={() => handlePageClick(p)}
                    disabled={loading}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
