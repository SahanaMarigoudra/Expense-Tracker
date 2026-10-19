import os
import sys

sys.path.insert(0, os.path.abspath("backend"))
sys.path.insert(0, os.path.abspath("."))

try:
    from app.main import app
except ImportError:
    from backend.app.main import app
