from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import uvicorn
import io

from services.extractor import extract_text, extract_entities
from services.embedder import get_embedding

app = FastAPI(title="SmartHire AI Microservice")

class EmbedRequest(BaseModel):
    text: str

class EmbedResponse(BaseModel):
    embedding: list[float]

class ExtractResponse(BaseModel):
    skills: list[str]
    experience_years: int
    education: list[str]
    job_history: list[str]
    certifications: list[str]
    languages: list[str]
    summary: str
    fit_score: int

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/extract", response_model=ExtractResponse)
async def extract_resume(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        content = await file.read()
        file_obj = io.BytesIO(content)
        
        # 1. Extract raw text
        raw_text = extract_text(file_obj, file.filename)
        
        # 2. Extract structured entities via AI
        structured_data = extract_entities(raw_text)
        
        return structured_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed", response_model=EmbedResponse)
def embed_text(req: EmbedRequest):
    try:
        embedding = get_embedding(req.text)
        return {"embedding": embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)


