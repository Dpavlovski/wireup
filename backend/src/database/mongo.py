import logging
import os
from copy import deepcopy
from typing import Optional, Any, List, Dict, TypeVar, Set, AsyncGenerator
from typing import Type as TypingType

from bson import ObjectId
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from pymongo.errors import DuplicateKeyError, ConnectionFailure


class MongoEntry(BaseModel):
    id: Optional[str] = None


T = TypeVar('T', bound=MongoEntry)


class MongoDBDatabase:
    client: AsyncIOMotorClient

    def __init__(self, database_name: str = "wireup", url: Optional[str] = None):
        load_dotenv()
        url = os.getenv("MONGO_URL") if url is None else url
        print(url)
        self.client = AsyncIOMotorClient(f"mongodb://root:example@{url}:27018/")
        self.db = self.client[database_name]

    async def ping(self) -> bool:
        try:
            await self.client.admin.command("ping")
            return True
        except ConnectionFailure as e:
            raise ConnectionFailure(f"Could not connect to MongoDB: {e}")

    async def add_entry(
            self,
            entity: T,
            collection_name: Optional[str] = None,
            metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        collection_name = entity.__class__.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]
        entry = entity.model_dump()
        if "id" in entry:
            entry.pop("id")
        if metadata:
            entry.update(metadata)

        result = await collection.insert_one(entry)
        return str(result.inserted_id)

    async def add_entry_dict(
            self,
            entity: Dict[str, Any],
            collection_name: str,
            metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        collection = self.db[collection_name]
        entry = deepcopy(entity)
        if "id" in entry:
            entry.pop("id")
        if metadata:
            entry.update(metadata)

        await collection.insert_one(entry)
        return True

    async def add_entries(
            self,
            entities: List[T],
            collection_name: Optional[str] = None,
            metadata: Optional[Dict[str, Any]] = None
    ) -> List[str]:
        if not entities:
            return []

        collection_name = entities[0].__class__.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]

        entries = []
        for entity in entities:
            entry = entity.model_dump()
            entry.pop("id", None)
            if metadata:
                entry.update(metadata)
            entries.append(entry)

        result = await collection.insert_many(entries)
        return [str(inserted_id) for inserted_id in result.inserted_ids]

    async def get_entries(
            self,
            class_type: TypingType[T],
            doc_filter: Dict[str, Any] = None,
            collection_name: Optional[str] = None,
    ) -> List[T]:
        collection_name = class_type.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]

        cursor = collection.find(doc_filter or {})
        results = []
        async for doc in cursor:
            doc['id'] = str(doc.pop('_id'))
            entry = class_type.model_validate(doc)
            results.append(entry)

        return results

    async def stream_entries(
            self,
            class_type: TypingType[T],
            doc_filter: Dict[str, Any] = None,
            collection_name: Optional[str] = None,
    ) -> AsyncGenerator[T, None]:
        collection_name = class_type.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]

        cursor = collection.find(doc_filter or {}, batch_size=1000)

        async for doc in cursor:
            doc['id'] = str(doc.pop('_id'))
            entry = class_type.model_validate(doc)
            yield entry

    async def stream_entries_dict(
            self,
            doc_filter: Dict[str, Any] = None,
            collection_name: Optional[str] = None,
    ) -> AsyncGenerator[Dict[str, any], None]:
        collection = self.db[collection_name]

        cursor = collection.find(doc_filter or {}, batch_size=1000)

        async for doc in cursor:
            doc['id'] = str(doc.pop('_id'))
            yield doc

    async def get_entries_dict(
            self,
            collection_name: str,
            doc_filter: Dict[str, Any] = None,
    ) -> List[Dict[str, Any]]:
        collection = self.db[collection_name]
        documents = await collection.find(doc_filter or {}).to_list(None)

        results = []
        for doc in documents:
            doc['id'] = str(doc.pop('_id'))
            results.append(doc)

        return results

    async def set_unique_index(self, collection_name: str, field_name: str):
        try:
            collection = self.db[collection_name]
            await collection.create_index([(field_name, 1)], unique=True)
            logging.info(f"Unique index set for '{field_name}' in '{collection_name}' collection.")
        except DuplicateKeyError:
            logging.info(f"Cannot create unique index on '{field_name}' due to duplicate values.")
        except Exception as e:
            logging.info(f"An error occurred: {e}")

    async def get_ids(
            self,
            class_type: TypingType[BaseModel],
            collection_name: Optional[str] = None,
            doc_filter: Dict[str, Any] = None,
    ) -> List[ObjectId]:
        collection_name = class_type.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]

        ids_cursor = await collection.find(doc_filter or {}, {"_id": 1}).to_list(None)

        return [doc["_id"] for doc in ids_cursor]

    async def get_entry(
            self,
            id: ObjectId,
            class_type: TypingType[T],
            collection_name: Optional[str] = None,
    ) -> Optional[T]:
        collection_name = class_type.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]

        document = await collection.find_one({"_id": id})

        if document:
            attr_dict = {key: value for key, value in document.items()}
            attr_dict["id"] = str(id)

            instance = class_type(**attr_dict)
            return instance

        return None

    async def get_entry_from_col_value(
            self,
            column_name: str,
            column_value: Any,
            class_type: TypingType[T],
            collection_name: Optional[str] = None,
    ) -> Optional[T]:
        collection_name = class_type.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]

        query = {column_name: column_value}

        document = await collection.find_one(query)

        if document:
            attr_dict = {key: value for key, value in document.items()}
            attr_dict["id"] = str(document["_id"])

            instance = class_type(**attr_dict)
            return instance

        return None

    async def get_entry_from_col_values(
            self,
            columns: Dict[str, Any],
            class_type: TypingType[T],
            collection_name: Optional[str] = None,
    ) -> Optional[T]:
        collection_name = class_type.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]

        query = columns

        document = await collection.find_one(query)

        if document:
            attr_dict = {key: value for key, value in document.items()}
            attr_dict["id"] = str(document["_id"])

            instance = class_type(**attr_dict)
            return instance

        return None

    async def get_entry_from_col_value_dict(
            self,
            column_name: str,
            column_value: str,
            collection_name: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        collection = self.db[collection_name]

        query = {column_name: column_value}

        document = await collection.find_one(query)

        if document:
            attr_dict = {key: value for key, value in document.items()}
            attr_dict["id"] = str(document["_id"])

            return attr_dict

        return None

    async def update_entry(
            self,
            entity: MongoEntry,
            collection_name: Optional[str] = None,
            update: Optional[Dict[str, Any]] = None
    ) -> bool:
        collection_name = entity.__class__.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]

        entity_dict = entity.model_dump()
        if "id" in entity_dict:
            entity_dict.pop("id")

        if update:
            entity_dict.update(update)

        result = await collection.update_one(
            {"_id": ObjectId(entity.id)},
            {"$set": entity_dict}
        )

        return result.modified_count > 0

    async def delete_collection(self, collection_name: str) -> bool:
        if collection_name not in await self.db.list_collection_names():
            logging.info(f"Collection '{collection_name}' does not exist.")

        await self.db[collection_name].drop()
        return True

    async def delete_entity(
            self,
            entity: MongoEntry,
            collection_name: Optional[str] = None
    ) -> bool:
        collection_name = entity.__class__.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]

        result = await collection.delete_one({"_id": ObjectId(entity.id)})

        return result.deleted_count > 0

    async def get_unique_values(
            self,
            collection_name: str,
            column: str
    ) -> Set[Any]:
        collection = self.db[collection_name]
        unique_values = await collection.distinct(column)

        return set(unique_values)

    async def delete_entries(
            self,
            class_type: TypingType[T],
            doc_filter: Dict[str, Any] = None,
            collection_name: Optional[str] = None,
    ) -> int:
        collection_name = class_type.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]
        result = await collection.delete_many(doc_filter or {})
        return result.deleted_count

    async def count_entries(
            self,
            class_type: TypingType[T],
            doc_filter: Dict[str, Any] = None,
            collection_name: Optional[str] = None,
    ) -> int:
        collection_name = class_type.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]
        return await collection.count_documents(doc_filter or {})

    async def count_entries_dict(
            self,
            collection_name: str,
            doc_filter: Dict[str, Any] = None,
    ) -> int:
        collection = self.db[collection_name]
        return await collection.count_documents(doc_filter or {})

    async def create_index(
            self,
            field_name: str,
            class_type: TypingType[T],
            collection_name: Optional[str] = None,
    ):
        try:
            collection_name = class_type.__name__ if collection_name is None else collection_name
            collection = self.db[collection_name]
            await collection.create_index(field_name)
            print("Index created successfully.")
        except Exception as e:
            print(f"An error occurred: {e}")

    async def atomic_update(
            self,
            id: ObjectId,
            update_operation: Dict[str, Any],
            class_type: TypingType[T],
            collection_name: Optional[str] = None,
    ) -> bool:
        collection_name = class_type.__name__ if collection_name is None else collection_name
        collection = self.db[collection_name]

        result = await collection.update_one(
            {"_id": id},
            update_operation
        )
        return result.modified_count > 0
