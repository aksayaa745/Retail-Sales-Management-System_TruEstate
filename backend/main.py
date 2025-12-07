from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router

app = FastAPI()

# ============================
# CORS FIX (must be BEFORE routes)
# ============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://retail-sales-management-system-tru-estate-7oaaksdkb.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],    # allow GET, POST, OPTIONS, etc.
    allow_headers=["*"],    # allow all headers
)

# ============================
# INCLUDE ROUTER
# ============================
app.include_router(router)

# ============================
# TEST ROUTE
# ============================
@app.get("/ping")
async def ping():
    return {"message": "pong"}
