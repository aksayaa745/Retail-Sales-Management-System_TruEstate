from fastapi import APIRouter, Response
from controllers.sales_controller import get_sales

router = APIRouter()

# ============================
# CORS PRE-FLIGHT (IMPORTANT)
# ============================
@router.options("/api/sales")
async def sales_options():
    return Response(status_code=200)

# ============================
# MAIN GET ENDPOINT
# ============================
@router.get("/api/sales")
async def sales_endpoint(
    page: int = 1,
    pageSize: int = 10,
    sortBy: str = "customerName",
    sortOrder: str = "asc",
    regions: str = None,
):
    return await get_sales(
        page=page,
        pageSize=pageSize,
        sortBy=sortBy,
        sortOrder=sortOrder
    )
