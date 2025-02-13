from datetime import datetime
from typing import Any, Optional

from backend.src.database.mongo import MongoEntry


class User(MongoEntry):
    username: str
    isAdmin: bool


class Test(MongoEntry):
    title: str
    password: str
    description: str
    sector: str
    date_created: datetime
    date_modified: Optional[datetime] = None


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
