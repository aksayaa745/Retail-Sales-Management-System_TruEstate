from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "https://retail-sales-management-system-tru-estate-7oaaksdkb.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your existing routes below
@app.get("/api/sales")
async def get_sales(page: int = 1, pageSize: int = 10):
    return {"data": [], "page": page, "pageSize": pageSize, "total": 0, "totalPages": 0}
