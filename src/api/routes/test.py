import csv
import io
from collections import defaultdict
from datetime import datetime
from typing import Annotated, List, Dict

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from fastapi.openapi.models import Response
from pydantic import BaseModel
from starlette.responses import StreamingResponse

from src.database.collections import (
    Test, QuestionOption, Question, Option, SubmittedTest, Answer, User
)
from src.database.mongo import MongoDBDatabase
from src.database.singletons import get_mongo_db

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
    date_submitted: datetime


class SubmittedTests(BaseModel):
    test: SubmittedTest
    user: User


class QuestionOptionDto(BaseModel):
    question: str
    options: List[str]


class TemplateDto(BaseModel):
    title: str
    description: str
    questions: List[QuestionOptionDto]


class TestDto(BaseModel):
    template_id: str
    sector: str
    password: str


@router.get("/")
async def get_tests(db: db_dep, is_template: bool):
    try:
        tests = await db.get_entries(Test, {"isTemplate": is_template})
        tests = sorted(tests, key=lambda t: t.date_created, reverse=True)
        return tests
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tests: {str(e)}")


@router.get("/active")
async def get_active_tests(db: db_dep):
    try:
        return await db.get_entries(Test, {"is_active": True})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching active tests: {str(e)}")


@router.get("/{id}/submitted")
async def get_submitted_tests(db: db_dep, id: str):
    try:
        tests = await db.get_entries(SubmittedTest, {"test_id": id})
        if len(tests) == 0:
            return []

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


@router.get("/submitted/user/{id}")
async def get_submitted_templates_by_user(db: db_dep, id: str):
    try:
        submit_tests = await db.get_entries(SubmittedTest, {"user_id": id})
        if len(submit_tests) == 0:
            return []

        test_ids = [ObjectId(test.test_id) for test in submit_tests]
        tests = await db.get_entries(Test, {"_id": {"$in": test_ids}})
        templates = [t.template_id for t in tests]

        return templates

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching submitted tests: {str(e)}")


@router.get("/{id}")
async def get_test(db: db_dep, id: str):
    try:
        obj_id = ObjectId(id)
        test = await db.get_entry(obj_id, Test)
        if not test:
            raise HTTPException(status_code=404, detail="Test not found")
        if not test.is_active and not test.isTemplate:
            raise HTTPException(status_code=500, detail="Test not active")

        test_id = test.id if test.isTemplate else test.template_id
        questions = await db.get_entries(Question, {"test_id": test_id})
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
        raise HTTPException(status_code=400, detail=e)


@router.get("/{id}")
async def get_total_questions_of_test(db: db_dep, id: str):
    try:
        obj_id = ObjectId(id)
        test = await db.get_entry(obj_id, Test)
        if not test:
            raise HTTPException(status_code=404, detail="Test not found")
        if not test.is_active:
            raise HTTPException(status_code=500, detail="Test not active")

        questions = await db.get_entries(Question, {"test_id": test.template_id})
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
        raise HTTPException(status_code=400, detail=e)


@router.get("/add")
async def test_form(db: db_dep):
    question = await db.get_entries(Question)
    options = await db.get_entries(Option)

    return question, options


@router.post("/add")
async def add_test(db: db_dep, dto: TestDto):
    try:
        template = await db.get_entry(ObjectId(dto.template_id), Test)

        test = Test(
            title=template.title,
            description=template.description,
            total_questions=template.total_questions,
            isTemplate=False,
            template_id=dto.template_id,
            password=dto.password,
            sector=dto.sector,
            date_created=datetime.now(),
            is_active=False
        )
        test_id = await db.add_entry(test)
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

        query_conditions = [
            {"question_id": answer.question_id, "option_id": answer.option_id}
            for answer in response.answers
        ]

        question_options = await db.get_entries(
            QuestionOption,
            {"$or": query_conditions}
        )

        for answer in response.answers:
            matching_option = next(
                (
                    qo
                    for qo in question_options
                    if qo.question_id == answer.question_id and qo.option_id == answer.option_id
                ),
                None
            )
            if not matching_option:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid option for question {answer.question_id}"
                )
            await db.add_entry(
                Answer(
                    submitted_test_id=submitted_test_id,
                    question_option_id=str(matching_option.id)
                )
            )

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

        questions = await db.get_entries(Question, {"test_id": test.template_id})
        question_dict = {str(q.id): q for q in questions}

        question_answer = [
            QuestionAnswer(question=question_dict[qo.question_id], answer=options[qo.option_id])
            for qo in question_options if qo.question_id in question_dict and qo.option_id in options
        ]

        return SubmittedTestReview(test=test, user=user, question_answer=question_answer,
                                   date_submitted=submitted_test.date_submitted)
    except Exception as e:
        raise HTTPException(status_code=400, detail=e)


@router.post("/activate/{id}")
async def activate_test(db: db_dep, id: str):
    try:
        obj_id = ObjectId(id)
        test = await db.get_entry(obj_id, Test)
        active_status = test.is_active
        await db.update_entry(test, update={"is_active": not active_status})
        return {"message": "Test " + "activated" if active_status else "deactivated" + "successfully"}
    except:
        raise HTTPException(status_code=404, detail="Object not found")


@router.get("/{test_id}/has_submissions")
async def has_submissions(db: db_dep, test_id: str):
    count = await db.count_entries(SubmittedTest, {"test_id": test_id})
    return count > 0


@router.get("/edit/{test_id}")
async def get_edit_test(db: db_dep, test_id: str):
    try:
        if await db.count_entries(SubmittedTest, {"test_id": test_id}):
            raise HTTPException(400, "Cannot edit test with existing submissions")

        test = await db.get_entry(ObjectId(test_id), Test)
        if not test:
            raise HTTPException(404, "Test not found")

        return test
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error editing test: {str(e)}")


@router.post("/edit/{test_id}")
async def edit_test(db: db_dep, test_id: str, dto: TestDto):
    try:
        if await db.count_entries(SubmittedTest, {"test_id": test_id}):
            raise HTTPException(400, "Cannot edit test with existing submissions")

        test = await db.get_entry(ObjectId(test_id), Test)
        template = await db.get_entry(ObjectId(dto.template_id), Test)
        test.template_id = dto.template_id
        test.sector = dto.sector
        test.password = dto.password
        test.date_created = datetime.now()
        test.title = template.title
        test.description = template.description
        test.total_questions = template.total_questions
        await db.update_entry(test)
        return Response(description="Test edited")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error editing test: {str(e)}")


@router.post("/delete/{test_id}")
async def delete_test(db: db_dep, test_id: str):
    if await db.count_entries(SubmittedTest, {"test_id": test_id}):
        raise HTTPException(400, "Cannot delete test with existing submissions")

    test = await db.get_entry(ObjectId(test_id), Test)
    await db.delete_entity(test)
    return Response(description="Test deleted")


@router.post("/export/{test_id}")
async def export(db: db_dep, test_id: str):
    try:
        test = await db.get_entry(ObjectId(test_id), Test)
        if not test:
            raise HTTPException(status_code=404, detail="Test not found")

        submitted_tests = await db.get_entries(SubmittedTest, {"test_id": test_id})
        if not submitted_tests:
            raise HTTPException(status_code=404, detail="No submissions found for this test")

        csv_data = io.StringIO()
        writer = csv.writer(csv_data)
        questions = await db.get_entries(Question, {"test_id": test.template_id})
        headers = ["Username"] + [q.question for q in questions]
        writer.writerow(headers)

        for st in submitted_tests:
            result = await get_submitted_test(db, st.id)
            user = result.user

            row = [
                user.username if user else "Unknown",
            ]

            for answer in result.question_answer:
                row.append(answer.answer.value if answer.answer.value else "Unknown")

            writer.writerow(row)

        csv_data.seek(0)

        return StreamingResponse(
            iter([csv_data.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=submissions_{test.sector}_{test.title}.csv"}
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting submissions: {str(e)}")
