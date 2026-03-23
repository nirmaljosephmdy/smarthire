import pdfplumber
import docx
import spacy
import re
from typing import Dict, List, Any

# Load spaCy model. In a real environment, you'd run `python -m spacy download en_core_web_sm`
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_text(file_obj, filename: str) -> str:
    text = ""
    if filename.endswith(".pdf"):
        with pdfplumber.open(file_obj) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    elif filename.endswith(".docx"):
        doc = docx.Document(file_obj)
        for para in doc.paragraphs:
            text += para.text + "\n"
    return text.strip()

def extract_entities(text: str) -> Dict[str, Any]:
    # Parse text with spaCy
    doc = nlp(text)
    
    # 1. Skills extraction (basic keyword matching approach)
    common_skills = ["python", "javascript", "react", "nest", "node.js", "docker", "aws", 
                     "kubernetes", "typescript", "postgres", "sql", "git", "machine learning",
                     "redis", "next.js", "tailwind", "fastapi"]
    
    skills = []
    text_lower = text.lower()
    for skill in common_skills:
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            skills.append(skill.title() if skill not in ["aws", "sql"] else skill.upper())
            
    # 2. Extract Years of Experience (very basic heuristic)
    experience_years = 0
    exp_matches = re.finditer(r'(\d+)\+?\s+years?', text_lower)
    for match in exp_matches:
        try:
            val = int(match.group(1))
            if val < 30 and val > experience_years:
                experience_years = val
        except ValueError:
            pass
            
    # Default to 1 if no exact match found but has experience keyword
    if experience_years == 0 and "experience" in text_lower:
        experience_years = 1

    # 3. Education
    education = []
    edu_keywords = ["bachelor", "master", "phd", "b.sc", "b.a", "b.tech", "m.tech", "university", "college"]
    for sent in doc.sents:
        if any(kw in sent.text.lower() for kw in edu_keywords):
            # Only add non-trivial fragments
            if len(sent.text.strip()) > 10 and len(education) < 3:
                education.append(sent.text.strip())
                
    # 4. Job History / ORGs
    job_history = list(set([ent.text for ent in doc.ents if ent.label_ == "ORG"]))[:5]
    
    # 5. Certifications
    certifications = []
    for sent in doc.sents:
        if "certification" in sent.text.lower() or "certificate" in sent.text.lower():
             if len(sent.text.strip()) > 10 and len(certifications) < 3:
                certifications.append(sent.text.strip()[:100])
                
    # 6. Languages
    languages = []
    lang_list = ["english", "spanish", "french", "german", "mandarin", "hindi"]
    for lang in lang_list:
        if re.search(r'\b' + re.escape(lang) + r'\b', text_lower):
            languages.append(lang.capitalize())
            
    # 7. Summary
    sentences = list(doc.sents)
    summary_sents = sentences[:4] if len(sentences) >= 4 else sentences
    summary = " ".join([s.text.strip() for s in summary_sents]).replace("\n", " ")
    if not summary:
        summary = "No summary could be generated."
        
    # 8. Fit Score (random simulated heuristic)
    fit_score = min(100, len(skills) * 8 + experience_years * 5 + len(education) * 5)
    if fit_score < 30: fit_score = 45 # baseline

    return {
        "skills": list(set(skills)),
        "experience_years": experience_years,
        "education": list(set(education)),
        "job_history": job_history,
        "certifications": list(set(certifications)),
        "languages": list(set(languages)),
        "summary": summary,
        "fit_score": fit_score
    }
