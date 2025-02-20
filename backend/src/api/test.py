from collections import defaultdict
from datetime import datetime
from typing import Annotated, List, Dict

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from backend.src.database.collections import (
    Test, QuestionOption, Question, Option, SubmittedTest, Answer, User
)
from backend.src.database.mongo import MongoDBDatabase
from backend.src.database.singletons import get_mongo_db

router = APIRouter()
db_dep = Annotated[MongoDBDatabase, Depends(get_mongo_db)]


class QuestionDto(BaseModel):
    question: Question
    options: List[Option]


class QuestionAnswer(BaseModel):
    question: Question
    answer: Option


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


class SubmittedTestReview(BaseModel):
    test: Test
    user: User
    question_answer: List[QuestionAnswer]


class SubmittedTests(BaseModel):
    test: SubmittedTest
    user: User


class QuestionOptionDto(BaseModel):
    question: str
    options: List[str]


class TestDto(BaseModel):
    title: str
    password: str
    description: str
    sector: str
    questions: List[QuestionOptionDto]



@router.get("/")
async def get_tests(db: db_dep):
    try:
        return await db.get_entries(Test)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching submitted tests: {str(e)}")


@router.get("/{id}/submitted")
async def get_submitted_tests(db: db_dep, id: str):
    try:
        tests = await db.get_entries(SubmittedTest, {"test_id": id})

        user_ids = [ObjectId(test.user_id) for test in tests]
        users = await db.get_entries(User, {"_id": {"$in": user_ids}})

        user_map = {str(user.id): user for user in users}

        submitted_tests = [
            SubmittedTests(test=test, user=user_map.get(str(test.user_id)))
            for test in tests
        ]

        return submitted_tests

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching submitted tests: {str(e)}")


@router.get("/{id}")
async def get_test(db: db_dep, id: str):
    try:
        obj_id = ObjectId(id)
        test = await db.get_entry(obj_id, Test)
        if not test:
            raise HTTPException(status_code=404, detail="Test not found")

        questions = await db.get_entries(Question, {"test_id": test.id})
        questions_dict: Dict[str, List[Option]] = defaultdict(list)

        for question in questions:
            question_options = await db.get_entries(QuestionOption, {"question_id": question.id})
            option_ids = [ObjectId(option.option_id) for option in question_options]
            options = await db.get_entries(Option, {"_id": {"$in": option_ids}})
            questions_dict[question.id] = options

        return TestResponse(
            test=test,
            questions=[QuestionDto(question=question, options=questions_dict[question.id]) for question in questions]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid ObjectId format: {str(e)}")


@router.get("/add")
async def test_form(db: db_dep):
    question = await db.get_entries(Question)
    options = await db.get_entries(Option)

    return question, options


@router.post("/add")
async def add_test(db: db_dep, dto: TestDto):
    try:
        test = Test(
            title=dto.title,
            description=dto.description,
            password=dto.password,
            sector=dto.sector,
            date_created=datetime.now()
        )
        test_id = await db.add_entry(test)

        questions = []
        options = []
        question_options = []

        for q in dto.questions:
            question = Question(question=q.question, test_id=test_id)
            questions.append(question)

        question_ids = await db.add_entries(questions)

        for q, question_id in zip(dto.questions, question_ids):
            for o in q.options:
                option = Option(value=o)
                options.append(option)

        option_ids = await db.add_entries(options)

        option_index = 0
        for question_id, q in zip(question_ids, dto.questions):
            for _ in q.options:
                question_options.append(
                    QuestionOption(question_id=question_id, option_id=option_ids[option_index])
                )
                option_index += 1

        await db.add_entries(question_options)

        return {"message": "Test added successfully", "test_id": test_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding test: {str(e)}")


@router.post("/submit")
async def submit_test(db: db_dep, response: SubmittedTestResponse):
    try:
        submitted_test = SubmittedTest(
            test_id=response.test_id,
            user_id=response.user_id,
            date_submitted=datetime.now()
        )
        submitted_test_id = await db.add_entry(submitted_test)

        question_options_map = {
            (answer.question_id, answer.option_id): True
            for answer in response.answers
        }

        valid_question_options = await db.get_entries(
            QuestionOption,
            {"$or": [{"question_id": qid, "option_id": oid} for qid, oid in question_options_map.keys()]}
        )
        valid_set = {(qo.question_id, qo.option_id) for qo in valid_question_options}

        for answer in response.answers:
            if (answer.question_id, answer.option_id) not in valid_set:
                raise HTTPException(status_code=400, detail=f"Invalid option for question {answer.question_id}")
            await db.add_entry(Answer(submitted_test_id=submitted_test_id, question_option_id=answer.option_id))

        return {"message": "Test submitted successfully", "submitted_test_id": submitted_test_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting test: {str(e)}")


@router.get("/submitted/{id}")
async def get_submitted_test(db: db_dep, id: str):
    try:
        obj_id = ObjectId(id)
        submitted_test = await db.get_entry(obj_id, SubmittedTest)
        if not submitted_test:
            raise HTTPException(status_code=404, detail="Submitted test not found")

        test = await db.get_entry(ObjectId(submitted_test.test_id), Test)
        user = await db.get_entry(ObjectId(submitted_test.user_id), User)
        if not test or not user:
            raise HTTPException(status_code=404, detail="Test or user not found")

        answers = await db.get_entries(Answer, {"submitted_test_id": submitted_test.id})
        question_options_ids = [ObjectId(answer.question_option_id) for answer in answers]
        question_options = await db.get_entries(QuestionOption, {"_id": {"$in": question_options_ids}})
        option_ids = [ObjectId(qo.option_id) for qo in question_options]
        options = {str(opt.id): opt for opt in await db.get_entries(Option, {"_id": {"$in": option_ids}})}

        questions = await db.get_entries(Question, {"test_id": submitted_test.test_id})
        question_dict = {str(q.id): q for q in questions}

        question_answer = [
            QuestionAnswer(question=question_dict[qo.question_id], answer=options[qo.option_id])
            for qo in question_options if qo.question_id in question_dict and qo.option_id in options
        ]

        return SubmittedTestReview(test=test, user=user, question_answer=question_answer)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid ObjectId format: {str(e)}")
