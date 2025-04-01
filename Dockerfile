FROM python:3.13-slim AS builder

RUN pip install poetry==2.1.2

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

COPY pyproject.toml poetry.lock ./
RUN touch README.md

RUN poetry install --only main --no-root

FROM python:3.13-slim AS runtime

ENV VIRTUAL_ENV=/.venv \
    PATH="/.venv/bin:$PATH"

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

COPY ./src/.env ./src/.env
COPY ./src ./src


ENTRYPOINT ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "5000"]
