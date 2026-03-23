import sys
import json
from services.extractor import extract_text, extract_entities

def test_extraction():
    pdf_path = r'C:\Users\91956\Downloads\sona.simon_Angular.pdf'
    
    try:
        print(f"Opening file: {pdf_path}")
        with open(pdf_path, 'rb') as f:
            print("Extracting raw text...")
            text = extract_text(f, "sona.simon_Angular.pdf")
            
            print(f"Extracted {len(text)} characters of text.")
            print("\nExtracting entities with spaCy...")
            entities = extract_entities(text)
            
            print("\n================== NLP EXTRACTION RESULTS ==================")
            print(json.dumps(entities, indent=2))
            print("==========================================================")
            
    except Exception as e:
        print("PYTHON ERROR:", str(e))

if __name__ == "__main__":
    test_extraction()
