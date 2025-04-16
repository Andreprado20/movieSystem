import os
import sys
from pathlib import Path

# Add the parent directory to the path so we can import the app module
sys.path.insert(0, str(Path(__file__).parent.parent))

# This file is automatically loaded by pytest before any tests run
# The code above adds the backend directory to the Python path
# so that imports like 'from app.factory import create_app' work correctly in all test files 