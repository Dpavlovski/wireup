from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

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

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
