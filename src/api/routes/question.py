from typing import Annotated

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from src.database.collections import Question, Option, QuestionOption
from src.database.mongo import MongoDBDatabase
from src.database.singletons import get_mongo_db

router = APIRouter()
db_dep = Annotated[MongoDBDatabase, Depends(get_mongo_db)]


async def delete_questions(db: db_dep, test_id: str):
    try:
        questions = await db.get_entries(Question, {"test_id": test_id})
        for question in questions:
            question_options = await db.get_entries(QuestionOption, {"question_id": question.id})
            option_ids = [ObjectId(option.option_id) for option in question_options]
            await db.delete_entries(Option, {"_id": {"$in": option_ids}})
            await db.delete_entries(QuestionOption, {"question_id": question.id})

        await db.delete_entries(Question, {"test_id": test_id})
        return {"message": "Questions and options deleted successfully"}
    except:
        raise HTTPException(status_code=500, detail="Questions and options cannot be deleted")
