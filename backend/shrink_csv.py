import pandas as pd

# Load the big CSV
df = pd.read_csv("data/sales_data.csv")

# Choose only the columns we need
columns_to_keep = [
    "Date",
    "Customer ID",
    "Customer Name",
    "Phone Number",
    "Gender",
    "Age",
    "Customer Region",
    "Product Category",
    "Quantity",
    "Final Amount",
    "Payment Method"
]

df_small = df[columns_to_keep]

# Save the smaller CSV
df_small.to_csv("data/sales_data_small.csv", index=False)

print("Saved: data/sales_data_small.csv")
print("Rows:", len(df_small))
