from datetime import datetime
from typing import Any, Optional

from backend.src.database.mongo import MongoEntry


class User(MongoEntry):
    username: str
    hashed_password: str
    is_admin: bool


class Test(MongoEntry):
    title: str
    description: str
    isTemplate: bool
    sector: Optional[str] = None
    password: Optional[str] = None
    date_created: datetime
    template_id: Optional[str] = None


class Question(MongoEntry):
    test_id: str
    question: str


class Option(MongoEntry):
    value: Any


class QuestionOption(MongoEntry):
    question_id: str
    option_id: str


class Answer(MongoEntry):
    submitted_test_id: str
    question_option_id: str


class SubmittedTest(MongoEntry):
    test_id: str
    user_id: str
    date_submitted: datetime
