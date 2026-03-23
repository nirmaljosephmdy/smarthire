import sys
from services.extractor import extract_text, extract_entities

def test():
    try:
        with open(r'C:\Test\smarthire\backend\uploads\4b03c7e6-b16a-4ef0-919e-7430dbc0bc02.pdf', 'rb') as f:
            text = extract_text(f, 'test.pdf')
            print("Extracted Text Length:", len(text))
            entities = extract_entities(text)
            print(entities)
    except Exception as e:
        print("ERROR:", str(e))

if __name__ == "__main__":
    test()
