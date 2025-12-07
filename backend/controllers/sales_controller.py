import csv
import os

# Correct path to your CSV file
DATA_FILE = os.path.join(os.path.dirname(__file__), "../data/sales_data.csv")

sales_data = []

# Load CSV (comma-separated)
with open(DATA_FILE, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)  # <-- CORRECT for your file
    for row in reader:
        cleaned = {
            "Date": row.get("Date", ""),
            "Customer ID": row.get("Customer ID", ""),
            "Customer Name": row.get("Customer Name", ""),
            "Phone Number": row.get("Phone Number", ""),
            "Gender": row.get("Gender", ""),
            "Age": row.get("Age", ""),
            "Customer Region": row.get("Customer Region", ""),
            "Product Category": row.get("Product Category", ""),
            "Quantity": int(row.get("Quantity", 0)),
            "Final Amount": float(row.get("Final Amount", 0)),
            "Payment Method": row.get("Payment Method", ""),
        }
        sales_data.append(cleaned)


async def get_sales(page=1, pageSize=10, sortBy="customerName", sortOrder="asc"):
    rows = sales_data.copy()

    # Sorting rules
    sort_map = {
        "customerName": "Customer Name",
        "date": "Date",
        "productCategory": "Product Category",
        "quantity": "Quantity",
        "finalAmount": "Final Amount",
    }

    key = sort_map.get(sortBy)
    if key:
        reverse = sortOrder == "desc"
        rows.sort(key=lambda x: x.get(key, ""), reverse=reverse)

    # Pagination
    total = len(rows)
    totalPages = (total + pageSize - 1) // pageSize

    start = (page - 1) * pageSize
    end = start + pageSize

    return {
        "data": rows[start:end],
        "page": page,
        "pageSize": pageSize,
        "total": total,
        "totalPages": totalPages
    }
