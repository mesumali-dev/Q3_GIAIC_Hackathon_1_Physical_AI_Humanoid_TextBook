import logging
from typing import Optional, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.http import models
from src.lib.config import Config


class QdrantService:
    """
    Service class to manage Qdrant client connection and operations.
    """

    def __init__(self):
        """
        Initialize Qdrant client with configuration from environment variables.
        """
        self.client = QdrantClient(
            url=Config.QDRANT_HOST,
            api_key=Config.QDRANT_API_KEY,
        )
        self.collection_name = Config.QDRANT_COLLECTION_NAME

    def connect_to_qdrant(self) -> bool:
        """
        Test connection to Qdrant server.

        Returns:
            bool: True if connection is successful, False otherwise
        """
        try:
            # Try to get collection info to verify connection
            self.client.get_collection(self.collection_name)
            logging.info(f"Successfully connected to Qdrant collection: {self.collection_name}")
            return True
        except Exception as e:
            logging.error(f"Failed to connect to Qdrant: {str(e)}")
            return False

    def health_check(self) -> Dict[str, Any]:
        """
        Perform health check on Qdrant connection.

        Returns:
            dict: Health check result with status and details
        """
        try:
            health = self.client.health()
            return {
                "status": "healthy",
                "health_info": health,
                "collection_exists": self.collection_exists()
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "collection_exists": False
            }

    def collection_exists(self) -> bool:
        """
        Check if the configured collection exists.

        Returns:
            bool: True if collection exists, False otherwise
        """
        try:
            self.client.get_collection(self.collection_name)
            return True
        except:
            return False

    def search_vectors(self, vector: list, top_k: int = 3, filters: Optional[Dict] = None):
        """
        Search for similar vectors in the collection.

        Args:
            vector: The query vector to search for
            top_k: Number of top results to return
            filters: Optional metadata filters

        Returns:
            Search results from Qdrant
        """
        try:
            # Prepare filters if provided
            qdrant_filters = None
            if filters and isinstance(filters, dict):
                filter_conditions = []

                # Handle both simple dict filters and MetadataFilter objects
                if isinstance(filters, dict):
                    for key, value in filters.items():
                        filter_conditions.append(
                            models.FieldCondition(
                                key=f"metadata.{key}",
                                match=models.MatchValue(value=value)
                            )
                        )

                if filter_conditions:
                    qdrant_filters = models.Filter(
                        must=filter_conditions
                    )

            # Perform the search using query_points method (newer API)
            results = self.client.query_points(
                collection_name=self.collection_name,
                query=vector,
                limit=top_k,
                query_filter=qdrant_filters,
                with_payload=True,
                with_vectors=False
            )

            return results
        except Exception as e:
            logging.error(f"Error during vector search: {str(e)}")
            raise