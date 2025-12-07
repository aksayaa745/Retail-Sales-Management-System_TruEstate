from fastapi import APIRouter
from controllers.sales_controller import get_sales

router = APIRouter()

@router.get("/api/sales")
async def sales_endpoint(
    page: int = 1,
    pageSize: int = 10,
    sortBy: str = "customerName",
    sortOrder: str = "asc"
):
    return await get_sales(
        page=page,
        pageSize=pageSize,
        sortBy=sortBy,
        sortOrder=sortOrder
    )
