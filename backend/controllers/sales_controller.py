import csv
import os

# Path to CSV
DATA_FILE = os.path.join(os.path.dirname(__file__), "../data/sales.csv")

# Load CSV into memory
sales_data = []
with open(DATA_FILE, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Clean + normalize keys so frontend can use them directly
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

    # ----------------------------------------
    # SORTING MAPPING
    # ----------------------------------------
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

    # ----------------------------------------
    # PAGINATION
    # ----------------------------------------
    total = len(rows)
    totalPages = (total + pageSize - 1) // pageSize

    start = (page - 1) * pageSize
    end = start + pageSize
    page_rows = rows[start:end]

    # ----------------------------------------
    # RESPONSE FORMAT
    # ----------------------------------------
    return {
        "data": page_rows,
        "page": page,
        "pageSize": pageSize,
        "total": total,
        "totalPages": totalPages
    }
