import os
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Depends, Request, Response
from jwt.exceptions import PyJWTError
from passlib.context import CryptContext
from pydantic import BaseModel

from src.database.collections import User, Role
from src.database.mongo import MongoDBDatabase
from src.database.singletons import get_mongo_db

load_dotenv()
secret = os.getenv("JWT_SECRET")
algorithm = os.getenv("ALGORITHM")

router = APIRouter()
db_dep = Annotated[MongoDBDatabase, Depends(get_mongo_db)]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


class UserRegistration(BaseModel):
    username: str
    password: str


@router.post("/register")
async def register(db: db_dep, user_data: UserRegistration):
    if await db.count_entries(User, {"username": user_data.username}) > 0:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_pw = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        hashed_password=hashed_pw,
        role=Role.user,
    )
    await db.add_entry(new_user)
    return {"message": "Registration successful"}


class UserLogin(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(db: db_dep, user_data: UserLogin, response: Response):
    user = await db.get_entry_from_col_values(
        columns={"username": user_data.username},
        class_type=User
    )
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    expires = datetime.now(timezone.utc) + timedelta(minutes=60 * 24)
    jwt_token = jwt.encode(
        {"sub": user.username, "exp": expires},
        secret,
        algorithm=algorithm,
    )

    response.set_cookie(
        key="access_token",
        value=f"Bearer {jwt_token}",
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24,
    )

    user = await db.get_entry_from_col_values(
        columns={"username": user_data.username},
        class_type=User
    )

    return {"access_token": jwt_token, "token_type": "bearer", "id": user.id, "username": user.username,
            "role": user.role}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        "access_token",
        httponly=True,
        secure=True,
        samesite="strict"
    )
    return {"message": "Logged out successfully"}


async def get_current_user(db: db_dep, request: Request) -> User:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        token = token.replace("Bearer ", "").strip()
        payload = jwt.decode(token, secret, algorithms=[algorithm])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
    except PyJWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

    user = await db.get_entry_from_col_values(
        columns={"username": username},
        class_type=User
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/me")
async def get_protected_data(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "username": current_user.username, "role": current_user.role}
