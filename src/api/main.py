from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import test, template, auth
from src.database.singletons import get_mongo_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_mongo_db()
    yield
    mdb = await get_mongo_db()
    mdb.client.close()


prefix = "/api"
app = FastAPI(lifespan=lifespan)
app.include_router(test.router, prefix=prefix + "/test", tags=["test"])
app.include_router(template.router, prefix=prefix + "/template", tags=["template"])
app.include_router(auth.router, prefix=prefix + "/auth", tags=["auth"])

origins = [
    "http://localhost:3000",          # Local dev frontend
    "http://localhost:8100",         # Alternative local port
    "http://frontend:3000",          # Docker-compose service name
    "http://localhost:5000",         # Local alternative
    "http://dimiserver.duckdns.org", # Your production domain
    "http://dimiserver.duckdns.org:3000",  # Your production domain
    "http://tianaserver.duckdns.org",
    "https://tianaserver.duckdns.org",
    "http://test.thewireup.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
    expose_headers=["X-Custom-Header"],
    max_age=600,
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000, reload=False)
