from sentence_transformers import SentenceTransformer
import warnings
import os

warnings.filterwarnings("ignore")

# Load model globally to avoid reloading on every request
# The prompt requires: all-MiniLM-L6-v2
MODEL_NAME = "all-MiniLM-L6-v2"
model = None

def get_model():
    global model
    if model is None:
        print(f"Loading embedding model: {MODEL_NAME}...")
        try:
            model = SentenceTransformer(MODEL_NAME)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise e
    return model

def get_embedding(text: str) -> list[float]:
    """
    Generate an embedding vector for the given text.
    """
    if not text or not text.strip():
        # returns 0-vector for 384 dims (expected output size of MiniLM-L6)
        return [0.0] * 384
        
    m = get_model()
    # SentenceTransformer returns a numpy array, convert to list
    embedding = m.encode(text).tolist()
    return embedding
