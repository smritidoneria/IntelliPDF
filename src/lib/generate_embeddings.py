from sentence_transformers import SentenceTransformer
from PyPDF2 import PdfFileReader
import sys
import json

# Load the Sentence Transformer model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def pdf_to_text(file_path):
    text = ""
    with open(file_path, 'rb') as file:
        reader = PdfFileReader(file)
        for page_num in range(reader.numPages):
            page = reader.getPage(page_num)
            text += page.extract_text()
    return text

def generate_embeddings(text):
    sentences = text.split('.')
    embeddings = model.encode(sentences)
    return embeddings.tolist()

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    text = pdf_to_text(pdf_path)
    embeddings = generate_embeddings(text)
    print(json.dumps(embeddings))
