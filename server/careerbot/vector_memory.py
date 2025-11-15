from qdrant_client import QdrantClient
from qdrant_client.models import (
    VectorParams,
    Distance,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue
)
from sentence_transformers import SentenceTransformer
import uuid

COLLECTION = "careerbot_memory"

# Lazy globals
_qdrant = None
_encoder = None


# -------------------------
# Lazy load Qdrant
# -------------------------
def get_qdrant():
    global _qdrant
    if _qdrant is None:
        _qdrant = QdrantClient(path="vector_db", prefer_grpc=False)
        init_collection(_qdrant)
    return _qdrant


# -------------------------
# Lazy load embedding model
# -------------------------
def get_encoder():
    global _encoder
    if _encoder is None:
        _encoder = SentenceTransformer("all-MiniLM-L6-v2")
    return _encoder


# -------------------------
# Create collection (runs once)
# -------------------------
def init_collection(qdrant):
    collections = qdrant.get_collections().collections
    names = [c.name for c in collections]

    if COLLECTION not in names:
        qdrant.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )


# -------------------------
# Embed text
# -------------------------
def embed(text):
    return get_encoder().encode(text).tolist()


# -------------------------
# Save Memory
# -------------------------
def save_memory(bot_id, sender, text, message_id):
    qdrant = get_qdrant()

    qdrant.upsert(
        collection_name=COLLECTION,
        points=[
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embed(text),
                payload={
                    "bot_id": bot_id,
                    "sender": sender,
                    "text": text,
                    "message_id": message_id,
                }
            )
        ]
    )


# -------------------------
# Search Memory
# -------------------------
def search_memory(bot_id, query, limit=5):
    qdrant = get_qdrant()

    hits = qdrant.search(
        collection_name=COLLECTION,
        query_vector=embed(query),
        limit=limit,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="bot_id",
                    match=MatchValue(value=bot_id)
                )
            ]
        )
    )

    return [hit.payload["text"] for hit in hits]


# -------------------------
# Delete ALL memory for bot
# -------------------------
def delete_memory_for_bot(bot_id):
    qdrant = get_qdrant()

    qdrant.delete(
        collection_name=COLLECTION,
        points_selector=Filter(
            must=[
                FieldCondition(
                    key="bot_id",
                    match=MatchValue(value=bot_id)
                )
            ]
        )
    )


# -------------------------
# Delete specific message
# -------------------------
def delete_memory_for_message(message_id):
    qdrant = get_qdrant()

    qdrant.delete(
        collection_name=COLLECTION,
        points_selector=Filter(
            must=[
                FieldCondition(
                    key="message_id",
                    match=MatchValue(value=message_id)
                )
            ]
        )
    )
