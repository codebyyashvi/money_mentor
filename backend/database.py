from motor.motor_asyncio import AsyncIOMotorClient
from motor.motor_asyncio import AsyncIOMotorDatabase
import asyncio
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

async def connect_db():
    """Connect to MongoDB"""
    mongodb_url = os.getenv("MONGODB_URL", "mongodb+srv://Ranu:ranu@cluster0.iwtsa.mongodb.net/")
    database_name = os.getenv("DATABASE_NAME", "money_mentor")
    MongoDB.client = AsyncIOMotorClient(mongodb_url)
    MongoDB.db = MongoDB.client[database_name]
    print("Connected to MongoDB successfully")

async def close_db():
    """Close MongoDB connection"""
    if MongoDB.client:
        MongoDB.client.close()
        print("Closed MongoDB connection")

def get_db():
    """Get database instance"""
    return MongoDB.db
