from collections import defaultdict
from datetime import datetime
from typing import Annotated, List, Dict

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from backend.src.database.collections import Test, QuestionOption, Question, Option, SubmittedTest, Answer
from backend.src.database.mongo import MongoDBDatabase
from backend.src.database.singletons import get_mongo_db

router = APIRouter()
db_dep = Annotated[MongoDBDatabase, Depends(get_mongo_db)]


class QuestionDto(BaseModel):
    question: Question
    options: List[Option]


class TestResponse(BaseModel):
    test: Test
    questions: List[QuestionDto]


class AnswerDto(BaseModel):
    question_id: str
    option_id: str


class SubmittedTestResponse(BaseModel):
    test_id: str
    user_id: str
    answers: List[AnswerDto]


@router.get('')
async def get(db: db_dep):
    return await db.get_entries(Test)


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
    return await db.add_entry(test)


@router.post('/submit')
async def add(db: db_dep, response: SubmittedTestResponse):
    submitted_test = SubmittedTest(
        test_id=response.test_id,
        user_id=response.user_id,
        date_submitted=datetime.now()
    )
    submitted_test_id = await db.add_entry(submitted_test)

    for answer in response.answers:
        question_option = await db.get_entries(
            QuestionOption,
            {"question_id": answer.question_id, "option_id": answer.option_id}
        )

        if not question_option:
            raise HTTPException(status_code=400, detail=f"Invalid option for question {answer.question_id}")

        await db.add_entry(Answer(submitted_test_id=submitted_test_id, question_option_id=question_option[0].id))

    return {"message": "Test submitted successfully", "submitted_test_id": submitted_test.id}


@router.get("/submitted/{id}")
async def get_submitted_test(db: db_dep, id: str):
    try:
        obj_id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    test = await db.get_entry(obj_id, SubmittedTest)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    questions_dict: Dict[str, List[Option]] = defaultdict(list)

    questions = await db.get_entries(Question, {"test_id": test.id})

    for question in questions:
        answer = await db.get_entries(Answer, {"question_id": question.id})

    return TestResponse(test=test, questions=[QuestionDto(question=question, options=questions_dict[question.id])
                                              for question in questions])
