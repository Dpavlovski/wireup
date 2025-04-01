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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000, reload=False)
