from collections import defaultdict
from typing import Annotated, List, Dict

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from backend.src.database.collections import Test, QuestionOption, Question, Option
from backend.src.database.mongo import MongoDBDatabase
from backend.src.database.singletons import get_mongo_db

router = APIRouter()
db_dep = Annotated[MongoDBDatabase, Depends(get_mongo_db)]


@router.get('')
async def get(db: db_dep):
    return await db.get_entries(Test)


class QuestionDto(BaseModel):
    question: Question
    options: List[Option]


class TestResponse(BaseModel):
    test: Test
    questions: List[QuestionDto]


@router.get("/{id}")
async def get_test(db: db_dep, id: str):
    try:
        obj_id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    test = await db.get_entry(obj_id, Test)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    questions_dict: Dict[str, List[Option]] = defaultdict(list)

    questions = await db.get_entries(Question, {"test_id": test.id})

    for question in questions:
        question_options = await db.get_entries(QuestionOption, {"question_id": question.id})

        for option in question_options:
            option_details = await db.get_entries(Option, {"_id": ObjectId(option.option_id)})
            questions_dict[question.id].extend(option_details)

    return TestResponse(test=test, questions=[QuestionDto(question=question, options=questions_dict[question.id])
                                              for question in questions])


@router.post('/add')
async def add(db: db_dep, test: Test):
    await db.add_entry(test)
    return {"message": f"TestView {test.title} created!", "data": test}
