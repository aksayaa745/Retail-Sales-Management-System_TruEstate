from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 👇 your frontend URL
origins = [
    "https://retail-sales-management-system-tru-estate-7oaaksdkb.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # only allow this origin
    allow_credentials=False,
    allow_methods=["*"],          # allow all methods
    allow_headers=["*"],          # allow all headers
)

# --- TEMP TEST ROUTE (keep it for now) ---
@app.get("/ping")
async def ping():
    return {"message": "pong"}

# --- your existing routes BELOW this ---
# @app.get("/api/sales")
# async def get_sales(...):
#     ...
