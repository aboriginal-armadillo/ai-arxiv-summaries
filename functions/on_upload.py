import fitz  # PyMuPDF
import openai
import tiktoken
from firebase_functions import logger
from google.cloud import storage

from time import sleep

def check_size(text, n):
    """
    take a string text - if it is larger than n tokens- clip the string to the first n tokens
    :param text: (str)
    :param n: (int) number of tokens
    :return: the string `text` but  no longer than n tokens
    """
    logger.log('checking_size...')
    encoding = tiktoken.get_encoding("cl100k_base")
    tokens = encoding.encode(text)
    n_tokens = len(tokens)
    logger.log(f"text is {n_tokens} tokens long")
    if n_tokens > n:
        logger.log(f"clipping text to {n} tokens")
        text = encoding.decode(tokens[:n])
    else:
        logger.log("no further processing needed")
    return text, n_tokens

def text_from_pdf(pdf_path):
    logger.log(f"extracting text from pdf at {pdf_path}")
    text = ""
    with fitz.open(pdf_path) as doc:
        for page_num in range(0, len(doc)):
            page = doc.load_page(page_num)
            text += page.get_text()
    logger.log(f"extraction successful - {len(text)} characters")
    logger.log(f"writing text to ")
    return text

def download_file_to_local(file_name, bucket_name):
    logger.log(f"downloading {file_name} to /tmp/article.pdf for processing")
    storage_client = storage.Client()
    # Get the bucket and file objects
    bucket = storage_client.get_bucket(bucket_name)
    file = bucket.blob(file_name)
    file.download_to_filename('/tmp/article.pdf')
    logger.log("download complete.")

def write_text_to_bucket(bucket_name, file_name, text):
    """
    Writes a string of text to a file in a Google Cloud Storage bucket.

    Args:
    - bucket_name (str): The name of the bucket.
    - file_name (str): The name of the file to write to.
    - text (str): The text to write.

    Returns:
    - None
    """
    logger.log(f"writing text to {bucket_name}/{file_name}")
    # Create a storage client
    storage_client = storage.Client()

    # Get the bucket
    bucket = storage_client.get_bucket(bucket_name)

    # Create a new blob (i.e., a file) and upload the text to it
    blob = bucket.blob(file_name)
    blob.upload_from_string(text)
    logger.log("text written to bucket.")

def handle_upload_internal(bucket_name, file_name, db):
    logger.log(f"main.handle_upload: {file_name}")
    arxiv_id = file_name.split('/')[0]
    logger.log(f"arxiv_id: {arxiv_id}")
    download_file_to_local(file_name, bucket_name)
    text = text_from_pdf('/tmp/article.pdf')
    write_text_to_bucket(bucket_name, f"{arxiv_id}/article.txt", text)
    text, n_tokens = check_size(text, 124000)
    model = "gpt-3.5-turbo-16k"
    if n_tokens > 14000:
        model = "gpt-4-turbo-preview"
    logger.log(f"{arxiv_id}: summarizing text with {model}")
    summary = summarize(text, model)
    logger.log(f"writing summary to {arxiv_id}/summary.txt")
    write_text_to_bucket(bucket_name, f"{arxiv_id}/summary.txt", summary)
    logger.log(f"{arxiv_id}: updating doc with summary")
    update_doc(arxiv_id, db, summary)
    logger.log(f"{arxiv_id}: done")

def summarize(text, model):
    completion = openai.ChatCompletion.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": "Summarize content you are provided in great "
                           "detail (at least 600 words, up to 2000 words). Do not insert knowledge beyond the document into the summary, and do not name the author or title of the work. Your task is to summarize the document, not continue it. Some documents will end mid-sentance, still summarize the document."
            },
            {
                "role": "user",
                "content": text
            }])
    return completion.choices[0].message.content

def update_doc(arxiv_id, db, summary):
    logger.log(f"{arxiv_id}: updating doc")
    doc_ref = db.collection('arxiv').document(arxiv_id)
    doc_ref.update({"summary": summary, "status": "Complete"})
