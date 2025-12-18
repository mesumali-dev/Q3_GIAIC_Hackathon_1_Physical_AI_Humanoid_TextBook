from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Optional
import logging
from backend.src.config.settings import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class QdrantService:
    def __init__(self):
        # Initialize Qdrant client with settings
        if settings.qdrant_api_key:
            self.client = QdrantClient(
                url=settings.qdrant_url,
                api_key=settings.qdrant_api_key,
                timeout=10
            )
        else:
            # For local instances without API key
            self.client = QdrantClient(
                host="localhost",
                port=6333,
                timeout=10
            )

        self.collection_name = settings.qdrant_collection_name or "book_content_chunks"
        logger.info(f"QdrantService initialized with collection: {self.collection_name}")

    async def search(self, query_vector: List[float], top_k: int = 5, filters: Optional[dict] = None) -> List[dict]:
        """
        Search for similar vectors in Qdrant collection
        """
        try:
            # Prepare filters if provided
            search_filters = None
            if filters:
                filter_conditions = []
                for key, value in filters.items():
                    filter_conditions.append(
                        models.FieldCondition(
                            key=key,
                            match=models.MatchValue(value=value)
                        )
                    )

                if filter_conditions:
                    search_filters = models.Filter(
                        must=filter_conditions
                    )

            # Perform the search
            search_results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=top_k,
                query_filter=search_filters,
                with_payload=True,
                with_vectors=False
            )

            # Format results
            formatted_results = []
            for result in search_results:
                formatted_results.append({
                    'id': result.id,
                    'payload': result.payload,
                    'score': result.score
                })

            logger.info(f"Search completed successfully, found {len(formatted_results)} results")
            return formatted_results

        except Exception as e:
            logger.error(f"Error performing search in Qdrant: {str(e)}")
            raise

    async def get_collection_info(self):
        """
        Get information about the collection
        """
        try:
            collection_info = self.client.get_collection(self.collection_name)
            return {
                "name": collection_info.config.params.vectors_count,
                "vectors_count": collection_info.vectors_count,
                "indexed_vectors_count": collection_info.indexed_vectors_count
            }
        except Exception as e:
            logger.error(f"Error getting collection info: {str(e)}")
            raise

    def health_check(self) -> bool:
        """
        Check if Qdrant service is available
        """
        try:
            # Try to get collection info as a basic health check
            self.client.get_collection(self.collection_name)
            return True
        except:
            return False

# Create a singleton instance
qdrant_service = QdrantService()