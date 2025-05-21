import uvicorn
from uvicorn.config import LOGGING_CONFIG
from app.config import get_settings
from app.factory import create_app
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = create_app()

def main():
    # Update logging format
    LOGGING_CONFIG["formatters"]["access"][
        "fmt"
    ] = "%(asctime)s %(levelprefix)s - %(message)s - took %(msecs)s ms"
    
    # Get settings and run with explicit parameters
    settings = get_settings().fastapi
    
    uvicorn.run(
        app="run:app",
        host="0.0.0.0",  # Allow external connections
        port=8000,
        reload=False,  # Disable reload in production
        log_level="info"
    )

if __name__ == "__main__":
    main()