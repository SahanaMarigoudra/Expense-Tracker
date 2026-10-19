import os
import sys

# Ensure both root and backend are in Python path
sys.path.insert(0, os.path.abspath("backend"))
sys.path.insert(0, os.path.abspath("."))

try:
    from backend.app.main import app
except ImportError:
    from app.main import app
