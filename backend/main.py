from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api import test
from src.database.singletons import get_mongo_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_mongo_db()
    yield
    mdb = await get_mongo_db()
    mdb.client.close()


app = FastAPI(lifespan=lifespan)
app.include_router(test.router, prefix="/test", tags=["flag"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
