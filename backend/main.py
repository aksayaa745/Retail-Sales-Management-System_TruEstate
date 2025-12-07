from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router   # import your routes

app = FastAPI()

# ============================
# CORS CONFIGURATION
# ============================
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

# ============================
# INCLUDE ROUTES
# ============================
app.include_router(router)

# ============================
# TEST ROUTE (OPTIONAL)
# ============================
@app.get("/ping")
async def ping():
    return {"message": "pong"}
