from datetime import datetime
from enum import Enum
from typing import Any, Optional

from src.database.mongo import MongoEntry


class Role(str, Enum):
    user = "user"
    admin = "admin"


class User(MongoEntry):
    username: str
    hashed_password: str
    role: Role = Role.user


class Test(MongoEntry):
    title: str
    description: str
    total_questions: int
    isTemplate: bool
    sector: Optional[str] = None
    password: Optional[str] = None
    date_created: datetime
    template_id: Optional[str] = None
    is_active: Optional[bool] = None


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
