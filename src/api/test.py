from typing import Annotated

from fastapi import APIRouter, Depends

from src.database.collections import Test
from src.database.mongo import MongoDBDatabase
from src.database.singletons import get_mongo_db

router = APIRouter()
db_dep = Annotated[MongoDBDatabase, Depends(get_mongo_db)]


@router.post('/test')
async def get(db: db_dep):
    await db.get_entries(Test)
    return {"message": f"Tests returned!"}


@router.post('/test/add')
async def add(db: db_dep, test: Test):
    await db.add_entry(test, "")
    return {"message": f"Test {test.title} created!", "data": test}
