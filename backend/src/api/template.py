from datetime import datetime
from typing import Annotated

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from fastapi.logger import logger
from fastapi.openapi.models import Response
from pymongo.errors import PyMongoError
from starlette import status

from backend.src.api.question import delete_questions
from backend.src.api.test import TemplateDto, get_test, QuestionOptionDto
from backend.src.database.collections import Test, Question, Option, QuestionOption
from backend.src.database.mongo import MongoDBDatabase
from backend.src.database.singletons import get_mongo_db

router = APIRouter()
db_dep = Annotated[MongoDBDatabase, Depends(get_mongo_db)]


@router.post("/add")
async def add_template(db: db_dep, dto: TemplateDto):
    try:
        test = Test(
            title=dto.title,
            description=dto.description,
            isTemplate=True,
            date_created=datetime.now(),
            total_questions=len(dto.questions)
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

        return {"message": "Template added successfully", "test_id": test_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding template: {str(e)}")


@router.post("/copy/{id}")
async def copy_template(db: db_dep, id: str):
    try:
        original = await get_test(db, id)

        copy_dto = TemplateDto(
            title=original.test.title + " Copy",
            description=original.test.description,
            questions=[
                QuestionOptionDto(
                    question=q.question.question,
                    options=[o.value for o in q.options]
                )
                for q in original.questions
            ]
        )

        result = await add_template(db, copy_dto)

        return {"message": "Template copied successfully", "new_id": result["test_id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error copying template: {str(e)}")


@router.post("/delete/{id}")
async def delete_template(db: db_dep, id: str):
    try:
        template = await get_test(db, id)
        if await db.count_entries(Test, {"template_id": id}):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Template can't be deleted because it has dependent tests."
            )
        await db.delete_entity(template.test)
        await delete_questions(db, id)
        return Response(description="Template deleted successfully")

    except HTTPException as he:
        raise he
    except PyMongoError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database operation failed"
        )
    except Exception as e:
        logger.error(f"Unexpected error deleting template {id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/check_existing_tests/{id}")
async def check_existing_tests(db: db_dep, id: str):
    try:
        if await db.count_entries(Test, {"template_id": id}):
            return True
        return False
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Invalid ObjectId format: {str(e)}")